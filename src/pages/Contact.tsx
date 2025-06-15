
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          inquiry_type: 'general'
        }]);

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-nigerian text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Contact JB AUTOS
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Get in touch with Nigeria's trusted car dealership
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            <span>Prince Samuel Adedoyin St, Lekki Peninsula II, Lagos</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-gray-600 text-lg mb-8">
                Ready to find your perfect car? Our team at JEFFWORLDWIDE JB AUTOS is here to help you every step of the way.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Address */}
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-nigerian-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-nigerian-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Visit Our Showroom</h3>
                    <p className="text-gray-600">
                      Prince Samuel Adedoyin St,<br />
                      Lekki Peninsula II,<br />
                      Lagos 106104, Lagos, Nigeria
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-nigerian-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-nigerian-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                    <div className="space-y-1 text-gray-600">
                      <p>Main: 0803 496 9367</p>
                      <p>Hotline 1: 08147319668</p>
                      <p>Hotline 2: 0708 040 1188</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-nigerian-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-nigerian-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p>Monday - Thursday: 8 AM - 7 PM</p>
                      <p>Friday: 7 AM - 7 PM</p>
                      <p>Saturday: 7 AM - 6 PM</p>
                      <p className="text-red-500">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                    <p className="text-gray-600 mb-2">Chat with us instantly</p>
                    <a 
                      href="https://wa.me/2348147319668" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-500 hover:text-green-600 font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Start WhatsApp Chat
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="What can we help you with?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us more about your inquiry..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-nigerian-green hover:bg-nigerian-green/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
