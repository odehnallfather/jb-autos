import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Phone, 
  Car, 
  Users, 
  Shield, 
  Zap,
  Camera,
  CreditCard,
  Calendar,
  HeadphonesIcon,
  MapPin,
  Fuel,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ShowroomScheduler from './ShowroomScheduler';
import ElevenLabsWidget from './ElevenLabsWidget';
import LiveChatWidget from './LiveChatWidget';
import type { Tables } from '@/integrations/supabase/types';

const FeaturesSection = () => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [showVoiceWidget, setShowVoiceWidget] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);

  // Fetch real cars from Supabase
  const { data: cars, isLoading: carsLoading } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching cars:', error);
        return [];
      }
      return data as Tables<'cars'>[];
    },
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Brand New': return 'bg-green-100 text-green-800';
      case 'Toks': return 'bg-blue-100 text-blue-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Every car undergoes thorough inspection and comes with detailed history reports. We guarantee the quality and authenticity of all our vehicles.",
      benefits: ["Comprehensive inspection", "Vehicle history report", "Quality certification"]
    },
    {
      icon: CreditCard,
      title: "Flexible Payment Options",
      description: "We offer various payment plans including installments, bank transfers, and mobile money to make your car purchase convenient and affordable.",
      benefits: ["Installment plans", "Multiple payment methods", "Flexible terms"]
    },
    {
      icon: Camera,
      title: "Virtual Car Viewing",
      description: "Can't visit our showroom? View cars remotely with 360° photos, live video tours, and detailed presentations from the comfort of your home.",
      benefits: ["360° car photos", "Live video tours", "Remote viewing"]
    },
    {
      icon: MessageCircle,
      title: "24/7 Customer Support",
      description: "Our dedicated customer service team is available round the clock to answer your questions and help you find the perfect car for your needs.",
      benefits: ["Always available", "Expert guidance", "Multilingual support"]
    },
    {
      icon: Calendar,
      title: "After-Sales Service",
      description: "We provide comprehensive after-sales support including maintenance scheduling, service reminders, and ongoing customer care.",
      benefits: ["Maintenance support", "Service reminders", "Ongoing care"]
    },
    {
      icon: Car,
      title: "Wide Vehicle Selection",
      description: "Browse our extensive inventory of quality cars from popular brands including Toyota, Honda, Lexus, and more at competitive prices.",
      benefits: ["Multiple brands", "Competitive pricing", "Quality vehicles"]
    }
  ];

  return (
    <>
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Inventory Section - Moved to Top */}
          <div className="mb-20">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium mb-4">
                🚗 Our Current Inventory
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Quality Vehicles from{' '}
                <span className="gradient-text">JB AUTOS</span>
              </h2>
              
              <p className="text-xl text-gray-600">
                Browse our carefully selected inventory of quality vehicles. Each car is inspected, 
                verified, and comes with detailed history reports for your peace of mind.
              </p>
            </div>

            {/* Inventory Grid */}
            {carsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[1, 2, 3].map((_, idx) => (
                  <Card key={idx} className="card-hover border-0 shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : cars && cars.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {cars.map((car) => (
                  <Card key={car.id} className="card-hover border-0 shadow-lg overflow-hidden cursor-pointer" onClick={() => window.open(`/cars/${car.id}`, '_blank')}>
                    {/* Car Image */}
                    <div className="relative">
                      {car.images && car.images.length > 0 ? (
                        <img 
                          src={car.images[0]} 
                          alt={`${car.make} ${car.model}`}
                          className="w-full aspect-video object-cover"
                        />
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <Car className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(getCategory(car.description))}`}>
                        {getCategory(car.description)}
                      </Badge>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-sm font-bold text-nigerian-green">{formatPrice(Number(car.price))}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Car Details */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>JB AUTOS MACHINES</span>
                          </div>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {car.mileage && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{car.mileage.toLocaleString()} km</span>
                            </div>
                          )}
                          {car.fuel_type && (
                            <div className="flex items-center gap-2">
                              <Fuel className="w-4 h-4 text-gray-400" />
                              <span>{car.fuel_type}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        {car.features && car.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {car.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {car.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{car.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLiveChat(true);
                            }}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Inquire
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-nigerian hover:opacity-90 flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowVoiceWidget(true);
                            }}
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 mb-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars available</h3>
                <p className="text-gray-500 mb-6">
                  We're currently updating our inventory. Please check back soon or contact us directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setShowLiveChat(true)} className="bg-gradient-nigerian hover:opacity-90">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                  <Button variant="outline" onClick={() => setShowScheduler(true)}>
                    Visit Showroom
                  </Button>
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">
                  Looking for Something Specific?
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse our full inventory of quality vehicles or contact us to help you 
                  find the perfect car for your needs and budget.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cars">
                  <Button size="lg" className="bg-gradient-nigerian hover:opacity-90 px-8">
                    <Car className="w-5 h-5 mr-2" />
                    Browse All Cars
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-nigerian-green text-nigerian-green hover:bg-nigerian-green hover:text-white px-8"
                  onClick={() => setShowScheduler(true)}
                >
                  Visit Our Showroom
                </Button>
              </div>
            </div>
          </div>

          {/* Why Choose JB AUTOS Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium mb-4">
              🚗 Why Choose JB AUTOS
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Your Trusted{' '}
              <span className="gradient-text">Car Partner</span>{' '}
              in Lagos
            </h2>
            
            <p className="text-xl text-gray-600">
              At JB AUTOS, we're committed to providing you with the best car buying experience. 
              From quality vehicles to exceptional service, we've got everything you need.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-nigerian rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-nigerian-green rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* About JB AUTOS Section */}
          <div className="bg-gradient-to-r from-nigerian-green/5 to-nigerian-green-light/5 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  About JB AUTOS
                </h3>
                <p className="text-gray-600 mb-6">
                  JB AUTOS has been serving the Lagos community for years, providing quality vehicles 
                  and exceptional customer service. We understand the local market and are committed 
                  to helping you find the perfect car that fits your needs and budget.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-nigerian-green" />
                    <span className="text-sm font-medium">Trusted Dealer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-nigerian-green" />
                    <span className="text-sm font-medium">Local Expertise</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-nigerian-green" />
                    <span className="text-sm font-medium">Quick Service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeadphonesIcon className="w-5 h-5 text-nigerian-green" />
                    <span className="text-sm font-medium">Great Support</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="p-6 bg-white border-0 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Happy Customers</div>
                      <div className="text-sm text-gray-500">500+ satisfied customers</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border-0 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Quality Vehicles</div>
                      <div className="text-sm text-gray-500">
                        {cars && cars.length > 0 ? `${cars.length}+ cars in stock` : 'Premium inventory'}
                      </div>
                    </div>
                  </div>
                </Card>

                <Button 
                  className="w-full bg-gradient-nigerian hover:opacity-90"
                  onClick={() => setShowScheduler(true)}
                >
                  Visit Our Showroom
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Widgets */}
      <ShowroomScheduler 
        isOpen={showScheduler} 
        onClose={() => setShowScheduler(false)} 
      />
      <ElevenLabsWidget 
        isOpen={showVoiceWidget} 
        onClose={() => setShowVoiceWidget(false)} 
      />
      <LiveChatWidget 
        isOpen={showLiveChat} 
        onClose={() => setShowLiveChat(false)} 
      />
    </>
  );
};

export default FeaturesSection;