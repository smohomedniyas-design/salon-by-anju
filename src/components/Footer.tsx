import { Heart, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Prices', href: '#prices' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black-900 border-t border-gold-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <img
                src="/uploads/upload_1.jpeg"
                alt="Salon by Anju"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-gold-400/40 object-cover"
              />
              <span className="font-playfair text-lg sm:text-xl font-semibold gold-gradient-text">
                Salon by Anju
              </span>
            </div>
            <p className="text-gold-100/50 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
              Your destination for hair, beauty, and bridal excellence in Athurugiriya.
            </p>
            <div className="flex items-center gap-2 text-gold-100/50 text-xs sm:text-sm">
              <MapPin size={14} className="text-gold-400 shrink-0" />
              <span>Millennium City, Athurugiriya</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-gold-200 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-gold-100/50 text-xs sm:text-sm hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair text-gold-200 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li className="text-gold-100/50 text-xs sm:text-sm">Hair Styling</li>
              <li className="text-gold-100/50 text-xs sm:text-sm">Facial Treatments</li>
              <li className="text-gold-100/50 text-xs sm:text-sm">Bridal Packages</li>
              <li className="text-gold-100/50 text-xs sm:text-sm">Waxing</li>
              <li className="text-gold-100/50 text-xs sm:text-sm">Keratin & Botox</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-gold-200 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
            <a
              href="tel:0716997670"
              className="flex items-center gap-2 text-gold-100/50 text-xs sm:text-sm hover:text-gold-400 transition-colors mb-2"
            >
              <Phone size={14} className="text-gold-400" />
              071 699 7670
            </a>
            <p className="text-gold-100/50 text-xs sm:text-sm mt-3 sm:mt-4">
              Mon - Sat: 9AM - 7PM
            </p>
            <p className="text-gold-100/50 text-xs sm:text-sm">
              Sunday: By Appointment
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-gold-100/40 text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Salon by Anju. All rights reserved.
            </p>
            <p className="text-gold-100/40 text-xs sm:text-sm flex items-center gap-1">
              Made with <Heart size={12} className="text-gold-400 fill-gold-400 sm:hidden" /><Heart size={14} className="text-gold-400 fill-gold-400 hidden sm:block" /> in Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
