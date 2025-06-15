
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Calendar, Fuel, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

interface CarCardProps {
  car: Tables<'cars'>;
}

const CarCard = ({ car }: CarCardProps) => {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Car Image */}
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <Car className="w-16 h-16 text-gray-400" />
        </div>
        <Badge className={`absolute top-3 left-3 ${getCategoryColor(getCategory(car.description))}`}>
          {getCategory(car.description)}
        </Badge>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="font-bold text-nigerian-green">{formatPrice(Number(car.price))}</span>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Car Details */}
          <div>
            <h3 className="text-xl font-bold">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>JB AUTOS Showroom</span>
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
          <div className="space-y-3 pt-4">
            <Link to={`/cars/${car.id}`} className="block">
              <Button className="w-full bg-gradient-nigerian hover:opacity-90">
                View Details
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                Inquire
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
