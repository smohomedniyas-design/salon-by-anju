import { useState, useEffect } from 'react';
import { Menu, X, Phone, Settings } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Prices', href: '#prices' },
  { name: 'Book', href: '#booking' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black-900/95 backdrop-blur-md shadow-lg shadow-gold-900/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#home" onClick={(e) => handleClick(e, '#home')} className="flex items-center gap-2 sm:gap-3">
              <img
                src="/uploads/upload_1.jpeg"
                alt="Salon by Anju"
                className="h-11 w-11 sm:h-14 sm:w-14 rounded-full border-2 border-gold-400/50 object-cover"
              />
              <div className="hidden sm:block">
                <span className="font-playfair text-lg sm:text-xl font-semibold gold-gradient-text tracking-wide">
                  Salon by Anju
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-xs lg:text-sm uppercase tracking-widest text-gold-200 hover:text-gold-400 transition-colors duration-300 font-lato font-light"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-gold-400 hover:text-gold-300 transition-colors text-xs"
                title="Admin Dashboard"
              >
                <Settings size={16} />
              </a>
              <a
                href="tel:0716997670"
                className="flex items-center gap-2 px-4 lg:px-5 py-2.5 gold-gradient-bg text-black-900 text-xs lg:text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-gold-400/30 transition-all duration-300"
              >
                <Phone size={14} />
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gold-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg active:bg-gold-400/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black-900/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        {/* Menu Panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-black-900/98 border-t border-gold-400/20 px-4 py-8 space-y-2 transition-transform duration-500 ${
            isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="block text-center text-gold-200 hover:text-gold-400 uppercase tracking-widest text-sm py-4 transition-colors active:bg-gold-400/5 rounded-lg"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex justify-center">
            <a
              href="tel:0716997670"
              className="flex items-center justify-center gap-2 px-8 py-4 gold-gradient-bg text-black-900 text-sm font-semibold rounded-full w-full max-w-xs"
            >
              <Phone size={18} />
              Book Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
