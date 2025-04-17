import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Simulating locomotive scroll effect with basic scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // Close mobile menu after click
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-gray-900/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">🐍Vizion 2.0</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Home
            </button>
            <button 
              onClick={() => scrollToSection('play')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              New Twists
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Features
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Home
            </button>
            <button 
              onClick={() => scrollToSection('play')}
              className="block w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              New Twists
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              Features
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}