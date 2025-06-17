import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Car, 
  Calendar, 
  Fuel, 
  Gauge, 
  Palette, 
  Settings, 
  Phone, 
  MessageCircle,
  X,
  Heart,
  Share2
} from 'lucide-react';
import ContactCarForm from './ContactCarForm';
import type { Tables } from '@/integrations/supabase/types';

interface CarModalProps {
  car: Tables<'cars'> | null;
  isOpen: boolean;
  onClose: () => void;
  onChatClick?: () => void;
}

const CarModal = ({ car, isOpen, onClose, onChatClick }: CarModalProps) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!car) return null;

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

  const handleChatClick = () => {
    onClose(); // Close the modal first
    onChatClick?.(); // Then open the chat
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {car.year} {car.make} {car.model}
                </DialogTitle>
                <p className="text-gray-600 mt-1">Available at JB AUTOS MACHINES</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Car Image Section */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      {car.images && car.images.length > 0 ? (
                        <img 
                          src={car.images[currentImageIndex]} 
                          alt={`${car.make} ${car.model}`}
                          className="w-full aspect-video object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-t-lg">
                          <Car className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                      <Badge className={`absolute top-4 left-4 ${getCategoryColor(getCategory(car.description))}`}>
                        {getCategory(car.description)}
                      </Badge>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <span className="text-lg font-bold text-nigerian-green">
                          {formatPrice(Number(car.price))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Thumbnail images */}
                {car.images && car.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {car.images.map((image, idx) => (
                      <div 
                        key={idx}
                        className={`aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                          currentImageIndex === idx ? 'ring-2 ring-nigerian-green' : ''
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img 
                          src={image} 
                          alt={`${car.make} ${car.model} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Car Details Section */}
              <div className="space-y-6">
                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
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

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <Button
                    onClick={handleChatClick}
                    className="w-full bg-gradient-nigerian hover:opacity-90"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Us
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a href="tel:08147319668" className="block">
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </a>
                    
                    <a href="https://wa.me/2348147319668" target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full">
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Dealership Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">JB AUTOS MACHINES</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📍 Ikate, Lekki-Epe Expressway, Lagos</div>
                    <div>📞 08147319668 | 0708 040 1188</div>
                    <div>🕒 Mon-Sat: 8am-6pm | Sun: 10am-4pm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactCarForm
          car={car}
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  );
};

export default CarModal;