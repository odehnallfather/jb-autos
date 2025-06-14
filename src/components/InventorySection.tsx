
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Car, MapPin, Calendar, Fuel } from 'lucide-react';

const InventorySection = () => {
  const sampleCars = [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2020,
      price: "₦7,500,000",
      location: "Lagos",
      mileage: "45,000 km",
      fuel: "Petrol",
      image: "/placeholder.svg",
      dealer: "AutoMax Lagos",
      verified: true,
      features: ["AC", "Leather Seats", "Navigation"]
    },
    {
      id: 2,
      make: "Honda",
      model: "Accord",
      year: 2019,
      price: "₦6,200,000",
      location: "Abuja",
      mileage: "38,000 km",
      fuel: "Petrol",
      image: "/placeholder.svg",
      dealer: "Capital Cars",
      verified: true,
      features: ["Sunroof", "Backup Camera", "Bluetooth"]
    },
    {
      id: 3,
      make: "Lexus",
      model: "ES 350",
      year: 2021,
      price: "₦15,800,000",
      location: "Lagos",
      mileage: "22,000 km",
      fuel: "Petrol",
      image: "/placeholder.svg",
      dealer: "Luxury Motors",
      verified: true,
      features: ["Premium Sound", "Memory Seats", "HUD"]
    }
  ];

  return (
    <section id="inventory" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium mb-4">
            🚗 Featured Inventory
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Premium Cars from{' '}
            <span className="gradient-text">Verified</span>{' '}
            Nigerian Dealers
          </h2>
          
          <p className="text-xl text-gray-600">
            Browse thousands of quality vehicles from trusted dealers across Nigeria. 
            Every car is verified and comes with detailed history reports.
          </p>
        </div>

        {/* Inventory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sampleCars.map((car) => (
            <Card key={car.id} className="card-hover border-0 shadow-lg overflow-hidden">
              {/* Car Image */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Car className="w-16 h-16 text-gray-400" />
                </div>
                {car.verified && (
                  <Badge className="absolute top-3 left-3 bg-nigerian-green text-white">
                    ✓ Verified
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-sm font-bold text-nigerian-green">{car.price}</span>
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
                      <span>{car.location}</span>
                      <span>•</span>
                      <span>{car.dealer}</span>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{car.mileage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-gray-400" />
                      <span>{car.fuel}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Button>
                    <Button size="sm" className="bg-gradient-nigerian hover:opacity-90 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              Ready to Find Your Perfect Car?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI assistant can help you find exactly what you're looking for in seconds. 
              Tell us your budget, preferences, and location - we'll do the rest.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-nigerian hover:opacity-90 px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Car Search with AI
            </Button>
            <Button size="lg" variant="outline" className="border-nigerian-green text-nigerian-green hover:bg-nigerian-green hover:text-white px-8">
              Browse All Inventory
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-nigerian-green">15,000+</div>
              <div className="text-sm text-gray-600">Cars Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nigerian-green">500+</div>
              <div className="text-sm text-gray-600">Verified Dealers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nigerian-green">36</div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nigerian-green">24/7</div>
              <div className="text-sm text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventorySection;
