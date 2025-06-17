import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCarForm from '@/components/ContactCarForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, Calendar, Fuel, Gauge, Palette, Settings, Phone, MessageCircle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const CarDetail = () => {
  const { id } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);

  const { data: car, isLoading } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Tables<'cars'>;
    },
    enabled: !!id,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategory = (description: string | null) => {
    if (!description) return 'Grade-A';
    const desc = description.toLowerCase();
    if (desc.includes('brand new')) return 'Brand New';
    if (desc.includes('toks')) return 'Toks';
    return 'Grade-A';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-600">Car not found</h1>
          <Link to="/cars">
            <Button className="mt-4">Back to Cars</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/cars" className="flex items-center gap-2 text-nigerian-green hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Cars
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Car Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Image */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {car.images && car.images.length > 0 ? (
                    <img 
                      src={car.images[0]} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full aspect-video object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-t-lg">
                      <Car className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-nigerian-green text-white">
                    {getCategory(car.description)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Car Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {car.year} {car.make} {car.model}
                    </CardTitle>
                    <p className="text-xl text-gray-600 mt-2">
                      Available at JB AUTOS
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-nigerian-green">
                      {formatPrice(Number(car.price))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Year</div>
                        <div className="text-gray-600">{car.year}</div>
                      </div>
                    </div>
                    
                    {car.mileage && (
                      <div className="flex items-center gap-3">
                        <Gauge className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Mileage</div>
                          <div className="text-gray-600">{car.mileage.toLocaleString()} km</div>
                        </div>
                      </div>
                    )}
                    
                    {car.fuel_type && (
                      <div className="flex items-center gap-3">
                        <Fuel className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Fuel Type</div>
                          <div className="text-gray-600">{car.fuel_type}</div>
                        </div>
                      </div>
                    )}
                    
                    {car.transmission && (
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Transmission</div>
                          <div className="text-gray-600">{car.transmission}</div>
                        </div>
                      </div>
                    )}
                    
                    {car.color && (
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Color</div>
                          <div className="text-gray-600">{car.color}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {car.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{car.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interested in this car?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-gradient-nigerian hover:opacity-90"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
                
                <div className="space-y-3">
                  <a href="tel:08147319668" className="block">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call: 08147319668
                    </Button>
                  </a>
                  
                  <a href="tel:07080401188" className="block">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call: 0708 040 1188
                    </Button>
                  </a>
                  
                  <a href="https://wa.me/2348147319668" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full">
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Dealership Info */}
            <Card>
              <CardHeader>
                <CardTitle>Visit Our Showroom</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium">JB AUTOS MACHINES</div>
                  <div className="text-sm text-gray-600">Premier car dealership</div>
                </div>
                
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-sm text-gray-600">
                    Ikate, Lekki-Epe Expressway, Lagos, Nigeria
                  </div>
                </div>
                
                <div>
                  <div className="font-medium">Hours</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Mon-Sat: 8am-6pm</div>
                    <div>Sun: 10am-4pm</div>
                    <div>Public Holidays: Closed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactCarForm
          car={car}
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default CarDetail;