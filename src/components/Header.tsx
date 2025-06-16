
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Car, Phone, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthButton from './AuthButton';
import ElevenLabsWidget from './ElevenLabsWidget';
import LiveChatWidget from './LiveChatWidget';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCallWidgetOpen, setIsCallWidgetOpen] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Cars', href: '/cars' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">JB AUTOS Machines</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCallWidgetOpen(true)}
                className="flex items-center space-x-1"
              >
                <Phone className="w-4 h-4" />
                <span>Call Support</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatWidgetOpen(true)}
                className="flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Live Chat</span>
              </Button>

              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCallWidgetOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsChatWidgetOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                
                <div className="pt-2">
                  <AuthButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Widgets */}
      <ElevenLabsWidget
        isOpen={isCallWidgetOpen}
        onClose={() => setIsCallWidgetOpen(false)}
      />
      
      <LiveChatWidget
        isOpen={isChatWidgetOpen}
        onClose={() => setIsChatWidgetOpen(false)}
      />
    </>
  );
};

export default Header;
