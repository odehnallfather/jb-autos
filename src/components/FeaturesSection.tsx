
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
      icon: Shield,
      title: "Quality Guarantee",
      description: "Every car undergoes thorough inspection and comes with detailed history reports. We guarantee the quality and authenticity of all our vehicles.",
      benefits: ["Comprehensive inspection", "Vehicle history report", "Quality certification"]
    },
    {
      icon: CreditCard,
      title: "Flexible Payment Options",
      description: "We offer various payment plans including installments, bank transfers, and mobile money to make your car purchase convenient and affordable.",
      benefits: ["Installment plans", "Multiple payment methods", "Flexible terms"]
    },
    {
      icon: Camera,
      title: "Virtual Car Viewing",
      description: "Can't visit our showroom? View cars remotely with 360° photos, live video tours, and detailed presentations from the comfort of your home.",
      benefits: ["360° car photos", "Live video tours", "Remote viewing"]
    },
    {
      icon: MessageCircle,
      title: "24/7 Customer Support",
      description: "Our dedicated customer service team is available round the clock to answer your questions and help you find the perfect car for your needs.",
      benefits: ["Always available", "Expert guidance", "Multilingual support"]
    },
    {
      icon: Calendar,
      title: "After-Sales Service",
      description: "We provide comprehensive after-sales support including maintenance scheduling, service reminders, and ongoing customer care.",
      benefits: ["Maintenance support", "Service reminders", "Ongoing care"]
    },
    {
      icon: Car,
      title: "Wide Vehicle Selection",
      description: "Browse our extensive inventory of quality cars from popular brands including Toyota, Honda, Lexus, and more at competitive prices.",
      benefits: ["Multiple brands", "Competitive pricing", "Quality vehicles"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-nigerian-green/10 text-nigerian-green text-sm font-medium mb-4">
            🚗 Why Choose JB AUTOS
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Your Trusted{' '}
            <span className="gradient-text">Car Partner</span>{' '}
            in Lagos
          </h2>
          
          <p className="text-xl text-gray-600">
            At JB AUTOS, we're committed to providing you with the best car buying experience. 
            From quality vehicles to exceptional service, we've got everything you need.
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

        {/* About JB AUTOS Section */}
        <div className="bg-gradient-to-r from-nigerian-green/5 to-nigerian-green-light/5 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                About JB AUTOS
              </h3>
              <p className="text-gray-600 mb-6">
                JB AUTOS has been serving the Lagos community for years, providing quality vehicles 
                and exceptional customer service. We understand the local market and are committed 
                to helping you find the perfect car that fits your needs and budget.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Trusted Dealer</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Local Expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Quick Service</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeadphonesIcon className="w-5 h-5 text-nigerian-green" />
                  <span className="text-sm font-medium">Great Support</span>
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
                    <div className="text-sm text-gray-500">500+ satisfied customers</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-0 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Quality Vehicles</div>
                    <div className="text-sm text-gray-500">50+ cars in stock</div>
                  </div>
                </div>
              </Card>

              <Button className="w-full bg-gradient-nigerian hover:opacity-90">
                Visit Our Showroom
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
