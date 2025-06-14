
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageSquare, Search, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Inquiry = Tables<'inquiries'>;

const InquiriesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries', searchTerm, filter],
    queryFn: async () => {
      let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
      }
      
      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (inquiryId: string) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ is_read: true })
        .eq('id', inquiryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({ title: 'Inquiry marked as read' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update inquiry', description: error.message, variant: 'destructive' });
    },
  });

  const respondMutation = useMutation({
    mutationFn: async ({ inquiryId, userId }: { inquiryId: string; userId: string }) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ 
          is_read: true, 
          responded_at: new Date().toISOString(),
          responded_by: userId
        })
        .eq('id', inquiryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      setReplyingTo(null);
      setReplyMessage('');
      toast({ title: 'Response recorded successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to record response', description: error.message, variant: 'destructive' });
    },
  });

  const handleReply = async (inquiryId: string) => {
    // In a real app, you'd send the email here
    console.log('Sending reply:', replyMessage);
    
    // Get current user for responded_by field
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      respondMutation.mutate({ inquiryId, userId: user.id });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading inquiries...</div>;
  }

  const unreadCount = inquiries?.filter(inquiry => !inquiry.is_read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Inquiries</h2>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          <div className="text-sm text-gray-600">
            {inquiries?.length || 0} total inquiries
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            Read
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {inquiries?.map((inquiry) => (
          <Card key={inquiry.id} className={!inquiry.is_read ? 'border-nigerian-green shadow-md' : ''}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{inquiry.customer_name}</span>
                    {!inquiry.is_read && (
                      <Badge variant="default" className="bg-nigerian-green">
                        New
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(inquiry.created_at!), { addSuffix: true })}
                  </p>
                </div>
                {inquiry.responded_at && (
                  <Badge variant="outline" className="text-green-600">
                    Responded
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {inquiry.customer_email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{inquiry.customer_email}</span>
                    </div>
                  )}
                  {inquiry.customer_phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{inquiry.customer_phone}</span>
                    </div>
                  )}
                </div>
                
                {inquiry.subject && (
                  <div className="text-sm">
                    <strong>Subject:</strong> {inquiry.subject}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-sm">{inquiry.message}</p>
                </div>
              </div>

              {replyingTo === inquiry.id ? (
                <div className="space-y-3 border-t pt-4">
                  <Textarea
                    placeholder="Type your response here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(inquiry.id)}
                      disabled={!replyMessage.trim() || respondMutation.isPending}
                    >
                      Send Reply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  {!inquiry.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(inquiry.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      Mark as Read
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(inquiry.id)}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  
                  {inquiry.customer_email && (
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  )}
                  
                  {inquiry.customer_phone && (
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {inquiries?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No inquiries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InquiriesList;
