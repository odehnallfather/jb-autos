
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MessageSquare, User, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Lead = Tables<'leads'>;

const LeadsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select(`
          *,
          interested_car:cars(make, model, year)
        `)
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_phone.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: 'Lead status updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update lead', description: error.message, variant: 'destructive' });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'interested': return 'bg-green-100 text-green-800';
      case 'not_interested': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Leads</h2>
        <div className="text-sm text-gray-600">
          {leads?.length || 0} total leads
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {leads?.map((lead) => (
          <Card key={lead.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-nigerian-green rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lead.customer_name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(lead.created_at!), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(lead.status || 'new')}>
                  {lead.status || 'new'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{lead.customer_phone}</span>
                  </div>
                  {lead.customer_email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{lead.customer_email}</span>
                    </div>
                  )}
                  {lead.source && (
                    <div className="text-sm text-gray-600">
                      Source: {lead.source}
                    </div>
                  )}
                </div>
                
                {lead.interested_car && (
                  <div className="text-sm">
                    <strong>Interested in:</strong>
                    <div className="text-nigerian-green">
                      {lead.interested_car.year} {lead.interested_car.make} {lead.interested_car.model}
                    </div>
                  </div>
                )}
              </div>

              {lead.message && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-sm">{lead.message}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Select
                  value={lead.status || 'new'}
                  onValueChange={(status) => updateStatusMutation.mutate({ leadId: lead.id, status })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="not_interested">Not Interested</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                
                {lead.customer_email && (
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leads?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
