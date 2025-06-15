
import { useState } from 'react';
import { Car, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
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
            
            {/* Available Cars Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-nigerian-green transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    Available Cars
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border shadow-lg rounded-md p-2 min-w-[200px]">
                    <div className="space-y-2">
                      <a 
                        href="#brand-new" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors"
                      >
                        Brand New
                      </a>
                      <a 
                        href="#toks" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors"
                      >
                        Toks
                      </a>
                      <a 
                        href="#grade-a" 
                        className="block px-4 py-2 text-gray-700 hover:text-nigerian-green hover:bg-gray-50 rounded transition-colors"
                      >
                        Grade-A
                      </a>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

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
              
              {/* Mobile Available Cars Section */}
              <div className="px-4 py-2">
                <div className="text-gray-700 font-medium mb-2">Available Cars</div>
                <div className="ml-4 space-y-2">
                  <a 
                    href="#brand-new" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Brand New
                  </a>
                  <a 
                    href="#toks" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Toks
                  </a>
                  <a 
                    href="#grade-a" 
                    className="block text-gray-600 hover:text-nigerian-green transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Grade-A
                  </a>
                </div>
              </div>

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
