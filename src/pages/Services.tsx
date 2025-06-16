import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Search, 
  CreditCard, 
  Shield, 
  Wrench, 
  FileText, 
  Users, 
  Trophy,
  CheckCircle,
  ArrowRight,
  Settings,
  Phone,
  Camera,
  Zap,
  HeadphonesIcon,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: Car,
      title: "Car Sales & Purchase",
      description: "Browse our extensive inventory of brand new, toks, and grade-A Nigerian used vehicles. From sedans to SUVs, luxury to economy cars.",
      features: [
        "Brand new imported vehicles",
        "Foreign used (Toks) cars",
        "Grade-A Nigerian used cars",
        "Wide range of makes and models"
      ]
    },
    {
      icon: Search,
      title: "Vehicle Inspection",
      description: "Professional inspection services to ensure you're getting the best quality vehicle. Our experts check everything from engine to electronics.",
      features: [
        "Comprehensive 150-point inspection",
        "Engine and transmission check",
        "Body and paint assessment", 
        "Electronics and safety features test"
      ]
    },
    {
      icon: Settings,
      title: "Verified Parts & Accessories",
      description: "Genuine automotive parts and accessories from trusted suppliers. Quality guaranteed parts for all major car brands.",
      features: [
        "Original Equipment Manufacturer (OEM) parts",
        "Aftermarket certified components",
        "Performance upgrades available",
        "Installation service included"
      ]
    },
    {
      icon: Wrench,
      title: "Car Customization",
      description: "Transform your vehicle with our professional customization services. From performance upgrades to aesthetic enhancements.",
      features: [
        "Interior & exterior styling",
        "Performance tuning & upgrades",
        "Audio system installation",
        "Window tinting & wrapping"
      ]
    },
    {
      icon: Users,
      title: "Verified Mechanics Network",
      description: "Access our network of certified and trusted mechanics across Lagos. Quality service from vetted professionals.",
      features: [
        "Pre-screened certified mechanics",
        "Transparent pricing",
        "Quality guarantee on all work",
        "Emergency repair services"
      ]
    },
    {
      icon: Phone,
      title: "24/7 Roadside Support",
      description: "Round-the-clock emergency assistance from our partner mechanics. Help is just a phone call away.",
      features: [
        "Emergency towing services",
        "On-site minor repairs",
        "Battery jump-start",
        "Flat tire assistance"
      ]
    },
    {
      icon: CreditCard,
      title: "Car Financing",
      description: "Flexible financing options to help you drive away with your dream car today. We work with multiple financial institutions.",
      features: [
        "Competitive interest rates",
        "Flexible payment terms",
        "Quick approval process",
        "Down payment options"
      ]
    },
    {
      icon: Camera,
      title: "Virtual Car Viewing",
      description: "Can't visit our showroom? View cars remotely with 360° photos, live video tours, and AI-powered virtual assistance.",
      features: [
        "360° car photography",
        "Live video call tours",
        "AI-powered car recommendations",
        "Virtual reality previews"
      ]
    },
    {
      icon: Shield,
      title: "Trade-In Services",
      description: "Get the best value for your current vehicle. Our fair appraisal process ensures you get top naira for your trade-in.",
      features: [
        "Free vehicle appraisal",
        "Competitive trade-in values",
        "Instant quote process",
        "Hassle-free paperwork"
      ]
    },
    {
      icon: FileText,
      title: "Documentation & Registration",
      description: "Complete assistance with all vehicle documentation, registration, and transfer processes in Lagos and nationwide.",
      features: [
        "Vehicle registration assistance",
        "Document transfer services",
        "Insurance coordination",
        "License plate processing"
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: Trophy,
      title: "Trusted Reputation",
      description: "Over years of serving Lagos with quality vehicles and exceptional service."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Knowledgeable staff to guide you through every step of your car buying journey."
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "All our vehicles undergo thorough inspection before being offered for sale."
    },
    {
      icon: CheckCircle,
      title: "Transparent Process",
      description: "No hidden fees, clear pricing, and honest communication throughout."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-nigerian text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Comprehensive automotive services from Nigeria's trusted car dealership
          </p>
          <div className="text-lg">
            <span className="font-semibold">JB AUTOS</span> - Your complete automotive solution
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From finding your perfect car to comprehensive support, we provide end-to-end automotive services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-nigerian-green/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-nigerian-green" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-nigerian-green flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Innovation</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the future of car shopping with our cutting-edge technology solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Camera className="w-12 h-12 text-nigerian-green mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Virtual Showroom</h3>
              <p className="text-gray-600 text-sm">360° car viewing and virtual tours</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 text-nigerian-green mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Smart Recommendations</h3>
              <p className="text-gray-600 text-sm">AI-powered car matching</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <HeadphonesIcon className="w-12 h-12 text-nigerian-green mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Virtual Assistant</h3>
              <p className="text-gray-600 text-sm">24/7 AI customer support</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-nigerian-green mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Remote Services</h3>
              <p className="text-gray-600 text-sm">Complete car buying from home</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JB AUTOS?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the difference with Lagos's most trusted automotive dealership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-nigerian-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-nigerian-green" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-nigerian text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're looking to buy, sell, or trade your vehicle, our team is here to provide exceptional service every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-nigerian-green hover:bg-gray-100">
              <Link to="/cars">
                Browse Our Inventory
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-nigerian-green">
              <Link to="/contact">
                Contact Us Today
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="opacity-90">
              <span className="font-semibold">Visit our showroom:</span> Ikate, Lekki-Epe Expressway, Lagos
            </p>
            <p className="opacity-90 mt-1">
              <span className="font-semibold">Call us:</span> 08147319668 | 0708 040 1188
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;