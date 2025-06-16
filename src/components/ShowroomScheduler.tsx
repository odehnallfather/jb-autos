import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShowroomSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Car {
  id: string;
  make: string;
  model: string;
}

const ShowroomScheduler = ({ isOpen, onClose }: ShowroomSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('10:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [carId, setCarId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    carId: null as string | null,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('leads').insert([{
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email,
        source: 'showroom_visit',
        message: `Showroom visit scheduled for ${data.date} at ${data.time}. Interested in: ${data.carId ? `Car ID: ${data.carId}` : 'General browsing'}`,
        interested_car_id: data.carId || null,
        status: 'new' as const
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Scheduled",
        description: "We'll contact you to confirm the details.",
      })
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !name || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setFormData({
      date: format(date, "yyyy-MM-dd"),
      time: time,
      name: name,
      phone: phone,
      email: email,
      carId: carId,
    });

    createAppointmentMutation.mutate({
      date: format(date, "yyyy-MM-dd"),
      time: time,
      name: name,
      phone: phone,
      email: email,
      carId: carId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Showroom Visit</DialogTitle>
          <DialogDescription>
            Choose a date and time to visit our showroom.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone Number
            </Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3 rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="car" className="text-right">
              Interested Car
            </Label>
            <Select onValueChange={setCarId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Browsing All Cars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car-1">Car 1</SelectItem>
                <SelectItem value="car-2">Car 2</SelectItem>
                <SelectItem value="car-3">Car 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={createAppointmentMutation.isLoading}>
            {createAppointmentMutation.isLoading ? "Submitting..." : "Schedule Visit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShowroomScheduler;
