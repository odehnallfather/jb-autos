
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Car, Shield, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import ElevenLabsWidget from './ElevenLabsWidget';
import LiveChatWidget from './LiveChatWidget';

const HeroSection = () => {
  const [showVoiceWidget, setShowVoiceWidget] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);

  return (
    <>
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium">
                  🚗 Quality Cars in Lagos
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Find Your{' '}
                  <span className="gradient-text">Perfect Car</span>{' '}
                  at JB AUTOS
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Welcome to JB AUTOS, your trusted car dealer in Lagos! We offer quality 
                  pre-owned and new vehicles with guaranteed authenticity, flexible payment 
                  options, and exceptional after-sales service.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-nigerian-green" />
                  <span>Verified Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-nigerian-green" />
                  <span>Quick Financing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-nigerian-green" />
                  <span>Warranty Included</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cars">
                  <Button 
                    size="lg" 
                    className="bg-gradient-nigerian hover:opacity-90 text-white px-8 py-6 text-lg w-full sm:w-auto"
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Browse Our Cars
                  </Button>
                </Link>
                
                <Button 
                  onClick={() => setShowVoiceWidget(true)}
                  size="lg" 
                  variant="outline" 
                  className="border-nigerian-green text-nigerian-green hover:bg-nigerian-green hover:text-white px-8 py-6 text-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-nigerian-green">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nigerian-green">50+</div>
                  <div className="text-sm text-gray-600">Cars Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nigerian-green">5⭐</div>
                  <div className="text-sm text-gray-600">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Demo */}
            <div className="relative">
              {/* Main Demo Card */}
              <Card className="bg-white shadow-2xl border-0">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Chat Interface Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <div className="w-10 h-10 bg-gradient-nigerian rounded-full flex items-center justify-center">
                          <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">JB AUTOS Customer Care</div>
                          <div className="text-sm text-gray-500">Online now</div>
                        </div>
                      </div>

                      {/* Sample Chat Messages */}
                      <div className="space-y-3">
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">Hello! I'm looking for a Toyota Camry under ₦8M. Do you have any available?</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <div className="bg-gradient-nigerian text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">Yes! We have 2 excellent Toyota Camrys in your budget. Let me show you the details and photos.</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <div className="bg-gradient-nigerian text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">Would you like to schedule a test drive or visit our showroom?</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features Preview */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <button
                        onClick={() => setShowLiveChat(true)}
                        className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MessageCircle className="w-6 h-6 text-nigerian-green mx-auto mb-2" />
                        <div className="text-xs font-medium">Live Chat</div>
                      </button>
                      <button
                        onClick={() => setShowVoiceWidget(true)}
                        className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Phone className="w-6 h-6 text-nigerian-green mx-auto mb-2" />
                        <div className="text-xs font-medium">Call Support</div>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">🚗</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-nigerian-green rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Widgets */}
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

export default HeroSection;
