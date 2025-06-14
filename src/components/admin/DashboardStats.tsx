
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Users, MessageSquare, BarChart3 } from 'lucide-react';

const DashboardStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [carsResult, leadsResult, inquiriesResult] = await Promise.all([
        supabase.from('cars').select('id, status', { count: 'exact' }),
        supabase.from('leads').select('id, status', { count: 'exact' }),
        supabase.from('inquiries').select('id, is_read', { count: 'exact' })
      ]);

      const availableCars = carsResult.data?.filter(car => car.status === 'available').length || 0;
      const activeLeads = leadsResult.data?.filter(lead => 
        lead.status === 'new' || lead.status === 'contacted' || lead.status === 'interested'
      ).length || 0;
      const unreadInquiries = inquiriesResult.data?.filter(inquiry => !inquiry.is_read).length || 0;

      return {
        totalCars: carsResult.count || 0,
        availableCars,
        activeLeads,
        unreadInquiries,
        totalLeads: leadsResult.count || 0,
        totalInquiries: inquiriesResult.count || 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const statsCards = [
    {
      title: 'Available Cars',
      value: stats?.availableCars || 0,
      subtitle: `${stats?.totalCars || 0} total inventory`,
      icon: Car,
      color: 'text-blue-600',
    },
    {
      title: 'Active Leads',
      value: stats?.activeLeads || 0,
      subtitle: `${stats?.totalLeads || 0} total leads`,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'New Inquiries',
      value: stats?.unreadInquiries || 0,
      subtitle: `${stats?.totalInquiries || 0} total messages`,
      icon: MessageSquare,
      color: 'text-orange-600',
    },
    {
      title: 'This Month',
      value: '₦0',
      subtitle: 'Total sales',
      icon: BarChart3,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
