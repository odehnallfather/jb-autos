import { Car, MessageCircle, Phone, Globe, Mail, MapPin, Clock } from 'lucide-react';

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
            <div className="space-y-2">
              <p className="text-lg font-semibold text-nigerian-green">JB AUTOS MACHINES</p>
              <p className="text-gray-400">
                Premier car dealership in Lagos. Dealer in all kinds of cars - Brand New, Toks, and Grade A Nigerian used vehicles. 
                Your trusted car dealer in Lagos, Nigeria.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-nigerian-green mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Ikate, Lekki-Epe Expressway,<br />
                  Lagos, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-nigerian-green" />
                <span className="text-gray-400">08147319668</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-nigerian-green">Additional Lines:</div>
                <div className="text-gray-400 text-sm">
                  <div>0708 040 1188</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#brand-new" className="hover:text-white transition-colors">Brand New Cars</a></li>
              <li><a href="#toks" className="hover:text-white transition-colors">Toks (Foreign Used)</a></li>
              <li><a href="#grade-a" className="hover:text-white transition-colors">Grade A Nigerian Used</a></li>
              <li><a href="#sedans" className="hover:text-white transition-colors">Sedans</a></li>
              <li><a href="#suvs" className="hover:text-white transition-colors">SUVs</a></li>
              <li><a href="#luxury" className="hover:text-white transition-colors">Luxury Cars</a></li>
            </ul>
          </div>

          {/* Business Hours & Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-nigerian-green" />
                <span className="font-medium">Operating Hours:</span>
              </div>
              <div className="ml-6 space-y-1">
                <div>Monday - Saturday: 8 AM - 6 PM</div>
                <div>Sunday: 10 AM - 4 PM</div>
                <div>Public Holidays: Closed</div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <h4 className="text-md font-medium">Our Services</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Car Sales & Purchase</li>
                <li>Vehicle Inspection</li>
                <li>Trade-In Services</li>
                <li>Car Financing</li>
                <li>After-Sales Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 JB AUTOS MACHINES. All rights reserved.
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

      {/* Fixed WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/2348147319668" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center animate-pulse"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690z"/>
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;