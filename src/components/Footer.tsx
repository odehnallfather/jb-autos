
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
              <span className="text-2xl font-bold">Kardilla</span>
            </div>
            <p className="text-gray-400">
              Nigeria's leading AI-powered car dealership platform. Connecting buyers and sellers 
              with intelligent automation and seamless experiences.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-nigerian-green" />
                <span>Lagos, Abuja, Port Harcourt</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-nigerian-green" />
                <span>+234 (0) 1 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-nigerian-green" />
                <span>hello@kardilla.ng</span>
              </div>
            </div>
          </div>

          {/* For Buyers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Car Buyers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Browse Inventory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Car Finder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Virtual Tours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Financing Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Car History Reports</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Insurance Services</a></li>
            </ul>
          </div>

          {/* For Dealers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Car Dealers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Join as Dealer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Lead Generation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Inventory Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customer Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payment Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Marketing Tools</a></li>
            </ul>
          </div>

          {/* Support & Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support & Languages</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Live Chat</a></li>
            </ul>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Available Languages:</div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-gray-800 rounded">🇬🇧 English</span>
                <span className="px-2 py-1 bg-gray-800 rounded">🇳🇬 Pidgin</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Yoruba</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Igbo</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Hausa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Kardilla. All rights reserved. Made with ❤️ for Nigerian car dealers.
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
                  <option value="pcm">Pidgin</option>
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
