
import { useState } from 'react';
import { Car, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-nigerian rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-nigerian bg-clip-text text-transparent">
              JB AUTOS
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Home
            </a>
            <a href="#inventory" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Inventory
            </a>
            <a href="#services" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-nigerian-green transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#inventory" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inventory
              </a>
              <a 
                href="#services" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#about" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="px-4 py-2">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
