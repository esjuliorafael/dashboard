import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = ['Principal', 'Galería', 'Tienda', 'Órdenes', 'Sistema'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 w-full px-4 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-0' : 'pt-4'}`}>
      <header 
        className="max-w-7xl mx-auto w-full bg-brand-50/95 backdrop-blur-md border border-white/40 shadow-sm transition-all duration-500 ease-in-out rounded-full"
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-brand-100 shadow-sm transition-all duration-300 group-hover:scale-105">
                  <img 
                    src="https://rancholastrojes.com.mx/assets/uploads/logo/logo_698abd3f7c34d.png" 
                    alt="Rancho Las Trojes Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Pill Shape (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center justify-center bg-gray-200/40 p-1.5 rounded-full backdrop-blur-sm mx-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ease-out ${
                    activeTab === item
                      ? 'bg-white text-brand-900 shadow-sm scale-105'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-white/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-stone-600 shadow-sm hover:bg-stone-50 hover:text-red-500 transition-all border border-stone-100 group"
                title="Cerrar Sesión"
              >
                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};