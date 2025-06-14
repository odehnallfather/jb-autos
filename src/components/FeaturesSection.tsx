
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Phone, 
  Car, 
  Users, 
  BarChart3, 
  Globe, 
  Shield, 
  Zap,
  Camera,
  CreditCard,
  Calendar,
  HeadphonesIcon
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Customer Support",
      description: "24/7 multilingual chatbot that handles your customer inquiries, qualifies leads, and answers questions in multiple Nigerian languages.",
      benefits: ["Instant customer response", "Lead qualification", "Multi-language support"]
    },
    {
      icon: Phone,
      title: "AI Phone Agent",
      description: "Natural voice conversations that handle your customer calls, follow up with leads, and schedule appointments automatically for your dealership.",
      benefits: ["Human-like conversations", "Automatic scheduling", "Call recording & analysis"]
    },
    {
      icon: Camera,
      title: "Virtual Car Tours",
      description: "Showcase your inventory with 360° virtual tours, live video calls, and detailed car presentations for customers who can't visit in person.",
      benefits: ["Remote car viewing", "Live demonstrations", "Detailed presentations"]
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "AI-powered insights on your customers' behavior, sales performance, and inventory optimization to help you grow your business.",
      benefits: ["Performance tracking", "Customer insights", "Sales optimization"]
    },
    {
      icon: CreditCard,
      title: "Payment Management",
      description: "Integrated payment processing with installment plans, mobile money support, and automated payment tracking for your customers.",
      benefits: ["Multiple payment options", "Installment tracking", "Payment automation"]
    },
    {
      icon: Calendar,
      title: "Service Scheduling",
      description: "Automated service appointment booking, maintenance reminders, and customer follow-up management for your after-sales services.",
      benefits: ["Automated booking", "Service reminders", "Customer retention"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium mb-4">
            🤖 Powerful Features
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Manage</span>{' '}
            Your Dealership
          </h2>
          
          <p className="text-xl text-gray-600">
            From customer engagement to sales automation, JB AUTOS handles your entire 
            dealership operations while you focus on closing deals and growing your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-nigerian rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-nigerian-green rounded-full"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Growth Section */}
        <div className="bg-gradient-to-r from-nigerian-green/5 to-nigerian-green-light/5 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Built for Nigerian Car Dealers
              </h3>
              <p className="text-gray-600 mb-6">
                JB AUTOS understands the unique challenges of running a car dealership in Nigeria. 
                Our system is optimized for local market conditions with offline capabilities, 
                local language support, and integration with popular Nigerian payment platforms.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Secure & Reliable</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Local Languages</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Fast & Efficient</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeadphonesIcon className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-white border-0 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Happy Customers</div>
                    <div className="text-sm text-gray-500">Automated customer service</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-0 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Your Inventory</div>
                    <div className="text-sm text-gray-500">Track and showcase your cars</div>
                  </div>
                </div>
              </Card>

              <Button className="w-full bg-gradient-nigerian hover:opacity-90">
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
