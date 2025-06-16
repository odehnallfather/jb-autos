import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface DirectMessagingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Conversation {
  id: string;
  customer_id: string;
  dealer_id: string | null;
  subject: string | null;
  status: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  message_type: string;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const DirectMessaging: React.FC<DirectMessagingProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`customer_id.eq.${user.id},dealer_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      return data as Conversation[];
    },
    enabled: !!user && isOpen,
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as DirectMessage[];
    },
    enabled: !!selectedConversation,
  });

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          customer_id: user.id,
          dealer_id: null, // Will be assigned by admin
          subject: 'New Inquiry',
          status: 'active'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSelectedConversation(data.id);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({ title: 'New conversation started' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to start conversation', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: string; message: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get conversation to determine recipient
      const { data: conversation } = await supabase
        .from('conversations')
        .select('customer_id, dealer_id')
        .eq('id', conversationId)
        .single();
      
      if (!conversation) throw new Error('Conversation not found');
      
      const recipientId = conversation.customer_id === user.id 
        ? conversation.dealer_id 
        : conversation.customer_id;
      
      if (!recipientId) throw new Error('No recipient found');
      
      const { error } = await supabase
        .from('direct_messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          message: message,
          message_type: 'text'
        }]);
      
      if (error) throw error;
      
      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to send message', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      message: newMessage
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user || !isOpen) return;

    const conversationsSubscription = supabase
      .channel('conversations')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations',
          filter: `customer_id=eq.${user.id}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    const messagesSubscription = supabase
      .channel('direct_messages')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'direct_messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
        }
      )
      .subscribe();

    return () => {
      conversationsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, [user, isOpen, selectedConversation, queryClient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <Button 
                onClick={() => createConversationMutation.mutate()}
                className="w-full bg-gradient-nigerian hover:opacity-90"
                disabled={createConversationMutation.isPending}
              >
                Start New Conversation
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversationsLoading ? (
                <div className="p-4 text-center text-gray-500">Loading conversations...</div>
              ) : conversations?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations?.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-nigerian-green/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {conversation.subject || 'General Inquiry'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                        </div>
                      </div>
                      <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                  ) : messages?.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
                  ) : (
                    messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-4 py-2 ${
                            message.sender_id === user?.id
                              ? 'bg-nigerian-green text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="text-xs opacity-75 mt-1">
                            {new Date(message.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="bg-gradient-nigerian hover:opacity-90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DirectMessaging;