
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Car, Eye, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import ElevenLabsWidget from './ElevenLabsWidget';
import LiveChatWidget from './LiveChatWidget';

type Car = Tables<'cars'>;

const InventorySection = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isCallWidgetOpen, setIsCallWidgetOpen] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  const { data: cars, isLoading } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Car[];
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
  };

  const handleCloseDetails = () => {
    setSelectedCar(null);
  };

  const handleCallForCar = (car: Car) => {
    setSelectedCar(car);
    setIsCallWidgetOpen(true);
  };

  const handleChatForCar = (car: Car) => {
    setSelectedCar(car);
    setIsChatWidgetOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Inventory
            </h2>
            <p className="text-lg text-gray-600">Loading our latest vehicles...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Inventory
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium vehicles. Every car is thoroughly inspected and comes with our quality guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {cars?.map((car) => (
              <Card key={car.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div onClick={() => handleCarClick(car)}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={car.images?.[0] || "/placeholder.svg"}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-green-700">
                        {car.status}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {car.year} {car.make} {car.model}
                  </CardTitle>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(car.price)}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString() || 'N/A'} km
                    </div>
                    <div>
                      <span className="font-medium">Fuel:</span> {car.fuel_type || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Color:</span> {car.color || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Transmission:</span> {car.transmission || 'N/A'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleChatForCar(car)}
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Inquire
                    </Button>
                    <Button 
                      onClick={() => handleCallForCar(car)}
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link to="/cars" className="flex items-center space-x-2">
                <span>View All Cars</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Car Details Modal */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCar.year} {selectedCar.make} {selectedCar.model}
                  </h2>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatPrice(selectedCar.price)}
                  </p>
                </div>
                <Button variant="outline" onClick={handleCloseDetails}>
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedCar.images?.[0] || "/placeholder.svg"}
                    alt={`${selectedCar.make} ${selectedCar.model}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {selectedCar.images && selectedCar.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {selectedCar.images.slice(1, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedCar.make} ${selectedCar.model} ${index + 2}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Vehicle Details</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{selectedCar.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mileage:</span>
                        <span className="font-medium">{selectedCar.mileage?.toLocaleString() || 'N/A'} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Type:</span>
                        <span className="font-medium">{selectedCar.fuel_type || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transmission:</span>
                        <span className="font-medium">{selectedCar.transmission || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{selectedCar.color || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {selectedCar.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedCar.description && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-600">{selectedCar.description}</p>
                    </div>
                  )}

                  {selectedCar.features && selectedCar.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCar.features.map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => handleChatForCar(selectedCar)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button 
                      onClick={() => handleCallForCar(selectedCar)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ElevenLabsWidget
        isOpen={isCallWidgetOpen}
        onClose={() => setIsCallWidgetOpen(false)}
      />
      
      <LiveChatWidget
        isOpen={isChatWidgetOpen}
        onClose={() => setIsChatWidgetOpen(false)}
        selectedCar={selectedCar}
      />
    </>
  );
};

export default InventorySection;
