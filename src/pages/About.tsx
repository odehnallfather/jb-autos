
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Users, Award, MapPin, Phone, Clock, Shield, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-nigerian text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            About JEFFWORLDWIDE JB AUTOS
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your trusted partner in quality automobiles since our founding. 
            We specialize in Brand New, Toks, and Grade-A Nigerian used vehicles.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Company Info */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                JEFFWORLDWIDE JB AUTOS has established itself as one of Lagos's premier 
                car dealerships, serving customers with integrity and professionalism. 
                Our commitment to quality and customer satisfaction has made us a trusted 
                name in the automotive industry.
              </p>
              <p>
                As a registered company (RC: 1555217), we operate with full transparency 
                and accountability, ensuring every transaction meets the highest standards 
                of business practice.
              </p>
              <p>
                Whether you're looking for a brand new vehicle, a well-maintained Toks 
                (foreign used) car, or a carefully inspected Grade-A Nigerian used vehicle, 
                we have the expertise and inventory to meet your needs.
              </p>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-nigerian-green" />
                  Visit Our Showroom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-600">
                    Prince Samuel Adedoyin St, Lekki Peninsula II, Lagos 106104
                  </div>
                </div>
                
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Numbers
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div>Hotline: 08147319668</div>
                    <div>Office: 0708 040 1188</div>
                    <div>Phone: 0803 496 9367</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Business Hours
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div>Monday - Thursday: 8:00 AM - 7:00 PM</div>
                    <div>Friday: 7:00 AM - 7:00 PM</div>
                    <div>Saturday: 7:00 AM - 6:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-nigerian-green" />
                </div>
                <h3 className="text-xl font-bold mb-3">Brand New Cars</h3>
                <p className="text-gray-600">
                  Latest models from top manufacturers with full warranty 
                  and manufacturer support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-nigerian-green" />
                </div>
                <h3 className="text-xl font-bold mb-3">Toks (Foreign Used)</h3>
                <p className="text-gray-600">
                  Carefully imported and inspected foreign used vehicles 
                  with verified history and quality assurance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-nigerian-green" />
                </div>
                <h3 className="text-xl font-bold mb-3">Grade-A Nigerian Used</h3>
                <p className="text-gray-600">
                  Premium Nigerian used vehicles that have passed our 
                  rigorous inspection and quality standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose JB AUTOS?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-nigerian-green" />
              </div>
              <h3 className="font-bold mb-2">Quality Assurance</h3>
              <p className="text-sm text-gray-600">Every vehicle undergoes thorough inspection</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-nigerian-green" />
              </div>
              <h3 className="font-bold mb-2">Expert Team</h3>
              <p className="text-sm text-gray-600">Professional and knowledgeable staff</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-nigerian-green" />
              </div>
              <h3 className="font-bold mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-gray-600">Committed to exceeding expectations</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-nigerian-green" />
              </div>
              <h3 className="font-bold mb-2">Trusted Brand</h3>
              <p className="text-sm text-gray-600">Registered and reliable dealership</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Car?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Visit our showroom or browse our online inventory to discover your perfect vehicle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-nigerian hover:opacity-90">
              Browse Cars
            </Button>
            <Button size="lg" variant="outline" className="border-nigerian-green text-nigerian-green hover:bg-nigerian-green hover:text-white">
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
