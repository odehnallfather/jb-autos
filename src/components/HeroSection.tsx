
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Car, Shield, Zap, Globe } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium">
                🇳🇬 Built for Nigerian Car Dealers
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Sell More Cars with{' '}
                <span className="gradient-text">AI-Powered</span>{' '}
                Technology
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Kardilla helps Nigerian car dealers increase sales by 300% through intelligent lead generation, 
                AI phone agents, virtual showings, and seamless customer management.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-nigerian-green" />
                <span>Verified Dealers Only</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-nigerian-green" />
                <span>AI-Powered Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-nigerian-green" />
                <span>Multi-Language Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-nigerian hover:opacity-90 text-white px-8 py-6 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Free Chat Demo
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-nigerian-green text-nigerian-green hover:bg-nigerian-green hover:text-white px-8 py-6 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Try AI Phone Agent
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-nigerian-green">300%</div>
                <div className="text-sm text-gray-600">Sales Increase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-nigerian-green">24/7</div>
                <div className="text-sm text-gray-600">AI Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-nigerian-green">5+</div>
                <div className="text-sm text-gray-600">Languages</div>
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
                        <div className="font-semibold">Kardilla AI Assistant</div>
                        <div className="text-sm text-gray-500">Online now</div>
                      </div>
                    </div>

                    {/* Sample Chat Messages */}
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs">
                          <p className="text-sm">Hello! I'm looking for a Toyota Camry under ₦8M. Can you help?</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-gradient-nigerian text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                          <p className="text-sm">Absolutely! I found 3 perfect Toyota Camrys in your budget. Let me show you the best options with photos and details.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-gradient-nigerian text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                          <p className="text-sm">Would you prefer to see them via virtual tour or schedule a physical viewing?</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Preview */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-nigerian-green mx-auto mb-2" />
                      <div className="text-xs font-medium">WhatsApp Ready</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-6 h-6 text-nigerian-green mx-auto mb-2" />
                      <div className="text-xs font-medium">Voice Calls</div>
                    </div>
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
  );
};

export default HeroSection;
