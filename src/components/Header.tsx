
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Car, Phone, Globe } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-nigerian rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Kardilla</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Features
            </a>
            <a href="#inventory" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Inventory
            </a>
            <a href="#dealers" className="text-gray-700 hover:text-nigerian-green transition-colors">
              For Dealers
            </a>
            <a href="#contact" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Contact
            </a>
          </nav>

          {/* Language & Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call AI Agent</span>
            </Button>
            
            <Button className="bg-gradient-nigerian hover:opacity-90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat Now
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                <div className={`w-4 h-0.5 bg-gray-600 my-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-nigerian-green transition-colors">
                Features
              </a>
              <a href="#inventory" className="text-gray-700 hover:text-nigerian-green transition-colors">
                Inventory
              </a>
              <a href="#dealers" className="text-gray-700 hover:text-nigerian-green transition-colors">
                For Dealers
              </a>
              <a href="#contact" className="text-gray-700 hover:text-nigerian-green transition-colors">
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
