
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Car, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import ElevenLabsWidget from './ElevenLabsWidget';

const HeroSection = () => {
  const [isCallWidgetOpen, setIsCallWidgetOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        
        {/* Floating Cars Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 opacity-10 transform rotate-12">
            <Car className="w-32 h-32 text-white" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 opacity-10 transform -rotate-12">
            <Car className="w-24 h-24 text-white" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                  Dream Car
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Premium vehicles at JB AUTOS Machines - Your trusted dealer in Ikate, Lekki-Epe Expressway. 
                Brand new, foreign used (Toks), and Grade-A Nigerian used cars.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 py-8">
              <div className="flex items-center space-x-2 text-white">
                <Car className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold">500+ Cars Available</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold">1000+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Star className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold">5-Star Service</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/cars" className="flex items-center space-x-2">
                  <span>Browse Our Cars</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                onClick={() => setIsCallWidgetOpen(true)}
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12 text-center">
              <p className="text-gray-400 text-sm mb-4">Trusted by thousands of car buyers in Lagos</p>
              <div className="flex justify-center items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-white ml-2 font-semibold">4.9/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ElevenLabsWidget
        isOpen={isCallWidgetOpen}
        onClose={() => setIsCallWidgetOpen(false)}
      />
    </>
  );
};

export default HeroSection;
