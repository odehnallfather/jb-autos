
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Car = Tables<'cars'>;

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase.from('cars').select('*').order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (carId: string) => {
      const { error } = await supabase.from('cars').delete().eq('id', carId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast({ title: 'Car deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete car', description: error.message, variant: 'destructive' });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Car
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by make or model..."
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
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars?.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{car.year} {car.make} {car.model}</CardTitle>
                <Badge className={getStatusColor(car.status || 'available')}>
                  {car.status || 'available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-nigerian-green">
                {formatPrice(Number(car.price))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {car.mileage && (
                  <div>Mileage: {car.mileage.toLocaleString()} km</div>
                )}
                {car.fuel_type && (
                  <div>Fuel: {car.fuel_type}</div>
                )}
                {car.transmission && (
                  <div>Transmission: {car.transmission}</div>
                )}
                {car.color && (
                  <div>Color: {car.color}</div>
                )}
              </div>

              {car.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {car.description}
                </p>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => deleteMutation.mutate(car.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cars?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cars found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
