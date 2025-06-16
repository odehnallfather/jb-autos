
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, CreditCard, Award, Phone, Calendar } from 'lucide-react';
import ShowroomScheduler from './ShowroomScheduler';

const FeaturesSection = () => {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every vehicle undergoes rigorous inspection by our certified mechanics before sale.',
    },
    {
      icon: CreditCard,
      title: 'Flexible Financing',
      description: 'Multiple payment options and financing plans to make your dream car affordable.',
    },
    {
      icon: Wrench,
      title: 'Expert Maintenance',
      description: 'Comprehensive after-sales service and maintenance by skilled technicians.',
    },
    {
      icon: Award,
      title: 'Trusted Reputation',
      description: 'Over 5 years of excellence in the automotive industry with thousands of satisfied customers.',
    },
  ];

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JB AUTOS Machines?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and quality vehicles that exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Car?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Visit our showroom at Ikate, Lekki-Epe Expressway to see our full inventory and take a test drive. 
              Our expert team is ready to help you find exactly what you're looking for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsSchedulerOpen(true)}
                size="lg" 
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Visit Our Showroom
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8"
                asChild
              >
                <a href="tel:+2348067890123">
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +234 806 789 0123
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ShowroomScheduler
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </>
  );
};

export default FeaturesSection;
