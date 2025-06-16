
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Calendar as CalendarIcon, Clock, Car, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

interface ShowroomSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShowroomScheduler: React.FC<ShowroomSchedulerProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available cars
  const { data: cars, isLoading } = useQuery({
    queryKey: ['available-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('make', { ascending: true });
      
      if (error) throw error;
      return data as Tables<'cars'>[];
    },
    enabled: isOpen,
  });

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !customerName || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a lead record for the showroom visit
      const leadData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        source: 'showroom_scheduler',
        message: `Showroom visit scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}. ${
          selectedCarId ? `Interested in car ID: ${selectedCarId}. ` : ''
        }${notes ? `Notes: ${notes}` : ''}`,
        interested_car_id: selectedCarId || null,
        status: 'new'
      };

      const { error } = await supabase
        .from('leads')
        .insert(leadData);

      if (error) throw error;

      // Send notification to admin
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: 'admin', // You might want to get actual admin user IDs
          title: 'New Showroom Visit Scheduled',
          message: `${customerName} has scheduled a showroom visit for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
          type: 'inquiry'
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

      toast({
        title: "Visit Scheduled!",
        description: `Your showroom visit has been scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}. We'll call you to confirm.`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedCarId('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setNotes('');
      onClose();

    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast({
        title: "Error",
        description: "Failed to schedule your visit. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Schedule Showroom Visit
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900">JB AUTOS Machines Showroom</h3>
                <p className="text-sm text-green-800">
                  Ikate, Lekki-Epe Expressway<br />
                  Lekki Phase 1, Lagos, Nigeria
                </p>
                <p className="text-sm text-green-700 mt-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Open Monday - Saturday: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Selection */}
            <div>
              <Label htmlFor="car-select">Car of Interest (Optional)</Label>
              <Select value={selectedCarId} onValueChange={setSelectedCarId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a specific car or browse all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Browse all cars in showroom</SelectItem>
                  {cars?.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.year} {car.make} {car.model} - ₦{car.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <Label>Select Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div>
              <Label htmlFor="time-select">Preferred Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time" />
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

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements, questions, or preferences..."
                rows={3}
              />
            </div>

            {/* Submission */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Visit'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">What to Expect:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Professional vehicle inspection and test drive</li>
              <li>• Detailed discussion about financing options</li>
              <li>• No-pressure consultation with our experts</li>
              <li>• Comprehensive vehicle history and documentation</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              We'll call you within 2 hours to confirm your appointment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowroomScheduler;
