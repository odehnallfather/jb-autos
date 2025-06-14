
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
      title: "AI Chat Assistant",
      description: "24/7 multilingual chatbot that qualifies leads, answers questions in English, Pidgin, Yoruba, Igbo, and Hausa.",
      benefits: ["300% increase in lead response", "90% faster qualification", "24/7 availability"]
    },
    {
      icon: Phone,
      title: "AI Phone Agent",
      description: "Natural voice conversations that handle inbound calls, follow up with leads, and schedule appointments automatically.",
      benefits: ["Human-like conversations", "Multi-language support", "Automatic call recording"]
    },
    {
      icon: Camera,
      title: "Virtual Car Tours",
      description: "360° virtual showings, live video calls with dealers, and AR features to showcase car details remotely.",
      benefits: ["Reduce physical visits by 60%", "Serve more customers", "3D car visualization"]
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "AI-powered insights on customer preferences, market demand, and sales performance across Nigeria.",
      benefits: ["Predict market trends", "Customer behavior insights", "Sales optimization"]
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Integrated with Paystack & Flutterwave for seamless payments, installment plans, and mobile money support.",
      benefits: ["Multiple payment options", "Installment calculators", "Mobile money integration"]
    },
    {
      icon: Calendar,
      title: "After-Sales Support",
      description: "Automated service scheduling, WhatsApp reminders, and customer feedback management system.",
      benefits: ["Automated scheduling", "Customer retention", "Service reminders"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium mb-4">
            🤖 AI-Powered Features
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Dominate</span>{' '}
            Car Sales in Nigeria
          </h2>
          
          <p className="text-xl text-gray-600">
            From lead generation to after-sales support, Kardilla automates your entire sales process 
            while you focus on what matters most - closing deals.
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

        {/* Trust Building Section */}
        <div className="bg-gradient-to-r from-nigerian-green/5 to-nigerian-green-light/5 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Built Specifically for Nigerian Market
              </h3>
              <p className="text-gray-600 mb-6">
                We understand the unique challenges of selling cars in Nigeria - from connectivity issues 
                to payment preferences. That's why Kardilla is optimized for the Nigerian market with 
                offline capabilities, local language support, and integration with popular payment platforms.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Verified Dealers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">5+ Local Languages</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Offline Capable</span>
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
                    <div className="font-semibold">500+ Active Dealers</div>
                    <div className="text-sm text-gray-500">Across Lagos, Abuja, Port Harcourt</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-0 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">10,000+ Cars Sold</div>
                    <div className="text-sm text-gray-500">Through our platform monthly</div>
                  </div>
                </div>
              </Card>

              <Button className="w-full bg-gradient-nigerian hover:opacity-90">
                Join 500+ Successful Dealers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
