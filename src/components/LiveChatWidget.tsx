
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, MessageCircle, Send, Car } from 'lucide-react';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm looking for a Toyota Camry under ₦8M. Do you have any available?",
      sender: 'user',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '2',
      text: "Yes! We have 2 excellent Toyota Camrys in your budget. Let me show you the details and photos.",
      sender: 'agent',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '3',
      text: "Would you like to schedule a test drive or visit our showroom?",
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'll help you find the perfect car. Let me check our inventory for you.",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] z-50">
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-nigerian text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <Car className="w-5 h-5" />
            JB AUTOS Live Chat
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Agent Status */}
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">JB AUTOS Customer Care</span>
              <span className="text-xs text-gray-500">Online now</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-gray-100 rounded-br-sm' 
                    : 'bg-gradient-nigerian text-white rounded-bl-sm'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} size="sm" className="bg-gradient-nigerian hover:opacity-90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatWidget;
