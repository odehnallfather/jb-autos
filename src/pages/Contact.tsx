
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Car,
  Send
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: ''
  });

  const { toast } = useToast();

  const createInquiryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('inquiries').insert([{
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        subject: data.subject,
        message: data.message
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Message sent successfully!', description: 'We will get back to you soon.' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiry_type: ''
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to send message', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      toast({ 
        title: 'Missing information', 
        description: 'Please fill in your name and message', 
        variant: 'destructive' 
      });
      return;
    }

    createInquiryMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "0803 496 9367",
        "08147319668", 
        "0708 040 1188"
      ]
    },
    {
      icon: MapPin,
      title: "Showroom Address",
      details: [
        "Prince Samuel Adedoyin St",
        "Lekki Peninsula II, Lagos",
        "Nigeria"
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Saturday: 8:00 AM - 6:00 PM",
        "Sunday: 10:00 AM - 4:00 PM",
        "Public Holidays: Closed"
      ]
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: [
        "0803 496 9367",
        "Quick responses available",
        "Share photos & videos"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-nigerian text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Get in touch with Lagos's most trusted car dealership
          </p>
          <div className="text-lg">
            <span className="font-semibold">JEFFWORLDWIDE JB AUTOS</span> - We're here to help
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-gray-600">
                Have questions about our cars or services? Fill out the form below and we'll get back to you promptly.
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
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
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inquiry_type">Inquiry Type</Label>
                    <Select onValueChange={(value) => handleChange('inquiry_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car-purchase">Car Purchase</SelectItem>
                        <SelectItem value="trade-in">Trade-In</SelectItem>
                        <SelectItem value="financing">Financing</SelectItem>
                        <SelectItem value="parts">Parts & Accessories</SelectItem>
                        <SelectItem value="customization">Car Customization</SelectItem>
                        <SelectItem value="mechanics">Mechanic Services</SelectItem>
                        <SelectItem value="roadside">Roadside Support</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createInquiryMutation.isPending}
                    className="w-full bg-gradient-nigerian hover:opacity-90"
                    size="lg"
                  >
                    {createInquiryMutation.isPending ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600">
                Visit our showroom, call us, or reach out through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-nigerian-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-nigerian-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 space-y-4">
              <Button 
                asChild 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <a href="https://wa.me/2348034969367" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <a href="tel:+2348034969367">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
