
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, MessageCircle, Send, Car, Mic, Upload, Image, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCar?: Tables<'cars'> | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  messageType?: 'text' | 'image' | 'audio';
  mediaUrl?: string;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ isOpen, onClose, selectedCar }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: selectedCar 
          ? `Hello! I see you're interested in the ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}. How can I help you with this vehicle?`
          : "Hello! Welcome to JB AUTOS Machines. I'm here to help you find the perfect car. How can I assist you today?",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, selectedCar, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageToWorkflow = async (message: string, messageType: 'text' | 'image' | 'audio' = 'text', mediaData?: string) => {
    setIsLoading(true);
    try {
      // This is where you'll connect to your n8n workflow
      const workflowUrl = 'YOUR_N8N_VIRTUAL_ASSISTANT_WEBHOOK_URL';
      
      const response = await fetch(workflowUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          messageType,
          mediaData,
          userId: user?.id,
          selectedCar: selectedCar ? {
            id: selectedCar.id,
            make: selectedCar.make,
            model: selectedCar.model,
            year: selectedCar.year,
            price: selectedCar.price
          } : null,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      
      // Add AI response to messages
      const agentMessage: Message = {
        id: Date.now().toString() + '-agent',
        text: data.response || "Thank you for your message! I'm processing your request and will get back to you shortly.",
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Create inquiry record if user is authenticated
      if (user) {
        await supabase.from('inquiries').insert({
          customer_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          customer_email: user.email,
          message: `Chat message: ${message}`,
          subject: selectedCar ? `Inquiry about ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : 'General Inquiry'
        });
      }
      
    } catch (error) {
      console.error('Error sending message to workflow:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again or call us directly at +234 806 789 0123.",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !audioBlob) return;

    if (audioBlob) {
      // Handle audio message
      const audioMessage: Message = {
        id: Date.now().toString(),
        text: 'Voice message',
        sender: 'user',
        timestamp: new Date(),
        messageType: 'audio',
        mediaUrl: URL.createObjectURL(audioBlob)
      };
      
      setMessages(prev => [...prev, audioMessage]);
      
      // Convert audio to base64 and send to workflow
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        sendMessageToWorkflow('Voice message', 'audio', base64Audio);
      };
      reader.readAsDataURL(audioBlob);
      
      setAudioBlob(null);
    } else {
      // Handle text message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      await sendMessageToWorkflow(newMessage);
      setNewMessage('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 60000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const imageMessage: Message = {
      id: Date.now().toString(),
      text: 'Uploaded image',
      sender: 'user',
      timestamp: new Date(),
      messageType: 'image',
      mediaUrl: imageUrl
    };
    
    setMessages(prev => [...prev, imageMessage]);
    
    // Convert image to base64 and send to workflow
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      sendMessageToWorkflow('Image uploaded for analysis', 'image', base64Image);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50">
      <Card className="h-full flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <Car className="w-5 h-5" />
            JB AUTOS Machines Chat
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Agent Status */}
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Assistant</span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-green-600 text-white rounded-br-sm' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}>
                  {message.messageType === 'image' ? (
                    <div>
                      <img src={message.mediaUrl} alt="Uploaded" className="w-full rounded mb-2" />
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ) : message.messageType === 'audio' ? (
                    <div className="flex items-center gap-2">
                      <audio controls className="max-w-full">
                        <source src={message.mediaUrl} type="audio/wav" />
                      </audio>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Audio Recording Preview */}
          {audioBlob && (
            <div className="p-3 bg-green-50 border-t border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Voice message ready</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudioBlob(null)}
                >
                  Cancel
                </Button>
              </div>
              <audio controls className="w-full mt-2">
                <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
              </audio>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2 items-end">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2"
                >
                  <Image className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
                >
                  <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
              
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isRecording ? 'Recording...' : 'Type your message...'}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isRecording || audioBlob !== null}
                className="flex-1"
              />
              
              <Button 
                onClick={sendMessage} 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                disabled={(!newMessage.trim() && !audioBlob) || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {isRecording && (
              <div className="mt-2 text-center">
                <span className="text-xs text-red-600 animate-pulse">Recording... (max 60s)</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default LiveChatWidget;
