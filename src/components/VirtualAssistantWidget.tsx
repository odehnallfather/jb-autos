import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, MessageCircle, Send, Mic, MicOff, Image, Play, Pause, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VirtualAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  n8nWebhookUrl?: string; // Your n8n workflow webhook URL
}

interface Message {
  id: string;
  text?: string;
  type: 'text' | 'audio' | 'image';
  sender: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
  imageUrl?: string;
  audioBlob?: Blob;
  isPlaying?: boolean;
}

const VirtualAssistantWidget: React.FC<VirtualAssistantWidgetProps> = ({ 
  isOpen, 
  onClose, 
  n8nWebhookUrl = 'YOUR_N8N_WEBHOOK_URL' 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with car inquiries, analyze car images, and answer questions via text or voice. How can I assist you today?",
      type: 'text',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendToN8n = async (messageData: any) => {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message to n8n');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending to n8n:', error);
      throw error;
    }
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: 'text',
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendToN8n({
        type: 'text',
        message: inputText,
        timestamp: new Date().toISOString()
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message || "I received your message and I'm processing it.",
        type: 'text',
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleSendAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'audio',
      sender: 'user',
      timestamp: new Date(),
      audioUrl,
      audioBlob
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert audio blob to base64 for n8n
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const response = await sendToN8n({
          type: 'audio',
          audioData: base64Audio,
          timestamp: new Date().toISOString()
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message || "I received your voice message and I'm processing it.",
          type: 'text',
          sender: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send audio message. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'image',
      sender: 'user',
      timestamp: new Date(),
      imageUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert image to base64 for n8n
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const response = await sendToN8n({
          type: 'image',
          imageData: base64Image,
          timestamp: new Date().toISOString()
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message || "I can see the image you shared. Let me analyze it for you.",
          type: 'text',
          sender: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send image. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const playAudio = (messageId: string, audioUrl: string) => {
    const audio = new Audio(audioUrl);
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying: true } : msg
    ));

    audio.onended = () => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ));
    };

    audio.play();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50">
      <Card className="h-full flex flex-col shadow-2xl border-2 border-nigerian-green/20">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-nigerian text-white rounded-t-lg p-4">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <MessageCircle className="w-5 h-5" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-nigerian-green text-white rounded-br-sm' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {message.type === 'text' && (
                    <p className="text-sm">{message.text}</p>
                  )}
                  
                  {message.type === 'audio' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => message.audioUrl && playAudio(message.id, message.audioUrl)}
                        className="p-1 h-8 w-8"
                      >
                        {message.isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="text-xs opacity-75">Voice message</div>
                        <div className="w-20 h-1 bg-white/30 rounded-full">
                          <div className="h-full bg-white rounded-full w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'image' && (
                    <div className="space-y-2">
                      <img 
                        src={message.imageUrl} 
                        alt="Uploaded" 
                        className="max-w-full h-32 object-cover rounded"
                      />
                      <p className="text-xs opacity-75">Image uploaded</p>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nigerian-green"></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-gray-50">
            {/* Recording Indicator */}
            {isRecording && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-700">Recording...</span>
                  </div>
                  <span className="text-sm text-red-700">{formatTime(recordingTime)}</span>
                </div>
              </div>
            )}

            {/* Input Controls */}
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  disabled={isRecording || isLoading}
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRecording || isLoading}
                >
                  <Image className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={isRecording ? 'bg-red-50 border-red-200' : ''}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button 
                onClick={handleSendText} 
                size="sm" 
                className="bg-gradient-nigerian hover:opacity-90"
                disabled={!inputText.trim() || isRecording || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-2 text-center">
              Send text, voice (max 60s), or images for AI analysis
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualAssistantWidget;