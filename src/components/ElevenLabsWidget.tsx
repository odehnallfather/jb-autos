
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Phone, Mic, MicOff } from 'lucide-react';

interface ElevenLabsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startConversation = async () => {
    try {
      // This will be connected to your ElevenLabs API when you set it up
      console.log('Starting ElevenLabs conversation...');
      setIsConnected(true);
      setIsListening(true);
      
      // Placeholder for ElevenLabs integration
      // You'll replace this with actual ElevenLabs SDK calls
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    console.log('Ending conversation...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Voice Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isListening ? 'bg-green-100 animate-pulse' : 'bg-gray-100'
            }`}>
              {isListening ? (
                <Mic className="w-8 h-8 text-green-600" />
              ) : (
                <MicOff className="w-8 h-8 text-gray-600" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {!isConnected 
                ? "Click to start talking with our AI assistant about cars, financing, and services."
                : isListening 
                ? "Listening... Speak now!"
                : "Connected. Click to speak."
              }
            </p>
          </div>

          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={startConversation}
                className="w-full bg-gradient-nigerian hover:opacity-90"
              >
                Start Voice Chat
              </Button>
            ) : (
              <Button 
                onClick={endConversation}
                variant="destructive"
                className="w-full"
              >
                End Call
              </Button>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            AI assistant powered by ElevenLabs
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElevenLabsWidget;
