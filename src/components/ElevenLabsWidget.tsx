
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Phone, Mic, MicOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ElevenLabsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const startConversation = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('connecting');
      
      // This is where you'll connect to your ElevenLabs integration
      // You can either:
      // 1. Connect directly to ElevenLabs API
      // 2. Route through your n8n workflow for enhanced AI capabilities
      
      console.log('Starting ElevenLabs conversation...', {
        userId: user?.id,
        userEmail: user?.email,
        timestamp: new Date().toISOString()
      });

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setIsListening(true);
      setConnectionStatus('connected');
      
      // Here you would integrate with ElevenLabs Conversational AI
      // Example integration points:
      // - Initialize ElevenLabs WebSocket connection
      // - Set up audio input/output streams
      // - Configure conversation parameters
      
      // For now, we'll simulate the connection
      console.log('ElevenLabs conversation started successfully');
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setConnectionStatus('idle');
    console.log('Ending conversation...');
    
    // Here you would cleanup ElevenLabs connection
    // - Close WebSocket connections
    // - Stop audio streams
    // - Save conversation data
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        endConversation();
      }
    };
  }, [isConnected]);

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
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ${
              connectionStatus === 'connecting' ? 'bg-yellow-100 animate-pulse' :
              connectionStatus === 'connected' && isListening ? 'bg-green-100 animate-pulse' : 
              connectionStatus === 'error' ? 'bg-red-100' :
              'bg-gray-100'
            }`}>
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
              ) : isListening ? (
                <Mic className="w-8 h-8 text-green-600" />
              ) : connectionStatus === 'error' ? (
                <MicOff className="w-8 h-8 text-red-600" />
              ) : (
                <MicOff className="w-8 h-8 text-gray-600" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {connectionStatus === 'connecting' 
                ? "Connecting to our AI assistant..."
                : connectionStatus === 'error'
                ? "Connection failed. Please try again."
                : !isConnected 
                ? "Start a voice conversation with our AI assistant about cars, financing, and services."
                : isListening 
                ? "I'm listening... Speak now!"
                : "Connected. The assistant is speaking."
              }
            </p>

            {connectionStatus === 'connected' && (
              <div className="text-xs text-gray-500 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live conversation active</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={startConversation}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Start Voice Chat'
                )}
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

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>AI assistant powered by ElevenLabs</p>
            <p>Speak naturally about any car-related questions</p>
          </div>

          {/* Connection Instructions */}
          {connectionStatus === 'idle' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Click "Start Voice Chat" to begin</li>
                <li>• Allow microphone access when prompted</li>
                <li>• Speak naturally about cars you're interested in</li>
                <li>• Our AI will respond with helpful information</li>
              </ul>
            </div>
          )}

          {/* Error Recovery */}
          {connectionStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                Unable to connect to voice assistant. Please check your microphone permissions and try again.
              </p>
              <Button 
                onClick={() => setConnectionStatus('idle')}
                variant="outline"
                size="sm"
                className="mt-2 w-full text-red-600 border-red-300"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ElevenLabsWidget;
