
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, Clock, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShowroomSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShowroomScheduler: React.FC<ShowroomSchedulerProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carInterest: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const availableCars = [
    { id: 1, name: "2020 Toyota Camry - ₦7,500,000" },
    { id: 2, name: "2019 Honda Accord - ₦6,200,000" },
    { id: 3, name: "2021 Lexus ES 350 - ₦15,800,000" }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.carInterest || !formData.preferredDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Showroom visit scheduled:', formData);
    
    toast({
      title: 'Visit Scheduled!',
      description: 'We will contact you to confirm your showroom visit.',
    });

    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      carInterest: '',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Showroom Visit
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="carInterest">Car of Interest *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, carInterest: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a car to inspect" />
                </SelectTrigger>
                <SelectContent>
                  {availableCars.map((car) => (
                    <SelectItem key={car.id} value={car.name}>
                      {car.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any specific requirements or questions..."
                rows={3}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Showroom Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📍 Prince Samuel Adedoyin St, Lekki Peninsula II, Lagos</p>
                <p>🕒 Mon-Sat: 8:00 AM - 6:00 PM</p>
                <p>📞 0803 496 9367</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-nigerian hover:opacity-90"
            >
              Schedule Visit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowroomScheduler;
