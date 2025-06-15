
import { useState } from 'react';
import { Car, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import AuthButton from '@/components/AuthButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-nigerian rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-nigerian bg-clip-text text-transparent">
              JB AUTOS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Home
            </Link>
            
            {/* Available Cars Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-nigerian-green transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    Available Cars
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border shadow-lg rounded-md p-2 min-w-[200px]">
                    <div className="space-y-2">
                      <Link 
                        to="/cars?category=brand-new" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors"
                      >
                        Brand New
                      </Link>
                      <Link 
                        to="/cars?category=toks" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors"
                      >
                        Toks
                      </Link>
                      <Link 
                        to="/cars?category=grade-a" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors"
                      >
                        Grade-A
                      </Link>
                      <Link 
                        to="/cars" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors border-t"
                      >
                        View All Cars
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/services" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Services
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-nigerian-green transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-nigerian-green transition-colors">
              Contact
            </Link>
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
              <Link 
                to="/" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Available Cars Section */}
              <div className="px-4 py-2">
                <div className="text-gray-700 font-medium mb-2">Available Cars</div>
                <div className="ml-4 space-y-2">
                  <Link 
                    to="/cars?category=brand-new" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Brand New
                  </Link>
                  <Link 
                    to="/cars?category=toks" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Toks
                  </Link>
                  <Link 
                    to="/cars?category=grade-a" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Grade-A
                  </Link>
                  <Link 
                    to="/cars" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View All Cars
                  </Link>
                </div>
              </div>

              <Link 
                to="/services" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-nigerian-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
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
