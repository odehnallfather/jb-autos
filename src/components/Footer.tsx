
import { Car, MessageCircle, Phone, Globe, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-nigerian rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">JB AUTOS</span>
            </div>
            <p className="text-gray-400">
              Your trusted car dealership powered by AI technology. We provide quality vehicles 
              and exceptional customer service to help you find your perfect car.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-nigerian-green" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-nigerian-green" />
                <span>+234 (0) 1 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-nigerian-green" />
                <span>info@jbautos.ng</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Car Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Virtual Tours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Car Financing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trade-In Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">After-Sales Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Car Insurance</a></li>
            </ul>
          </div>

          {/* Vehicle Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Types</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Sedans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SUVs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hatchbacks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Crossovers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Luxury Cars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Commercial Vehicles</a></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Live Chat</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book Appointment</a></li>
            </ul>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Business Hours:</div>
              <div className="text-gray-400 text-sm">
                <div>Mon - Fri: 8:00 AM - 6:00 PM</div>
                <div>Saturday: 9:00 AM - 4:00 PM</div>
                <div>Sunday: Closed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 JB AUTOS. All rights reserved. Quality cars, exceptional service.
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-nigerian-green" />
                <select className="bg-transparent text-sm border-none focus:outline-none">
                  <option value="en">English</option>
                  <option value="yo">Yoruba</option>
                  <option value="ig">Igbo</option>
                  <option value="ha">Hausa</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-gradient-nigerian hover:opacity-90 rounded-full shadow-lg flex items-center justify-center animate-pulse">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
