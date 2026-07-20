import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/pvr1nexp/image/upload/v1784575068/salon-assets/hero-bg.jpg"
          alt="Salon Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/uploads/upload_1.jpeg"
            alt="Salon by Anju Logo"
            className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-full border-4 border-gold-400/40 shadow-2xl shadow-gold-900/30 mb-6 sm:mb-8 object-cover"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gold-300 uppercase tracking-[0.25em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold gold-gradient-text mb-4 sm:mb-6 px-2"
        >
          Salon by Anju
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-gold-200/80 text-base sm:text-lg md:text-xl tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-6 sm:mb-8 font-lato font-light"
        >
          Hair &bull; Beauty &bull; Bridal
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          <div className="flex items-center gap-2 text-gold-200/70 text-xs sm:text-sm">
            <MapPin size={14} className="text-gold-400" />
            <span>Millennium City, Athurugiriya</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gold-400/30" />
          <a href="tel:0716997670" className="flex items-center gap-2 text-gold-200/70 text-xs sm:text-sm hover:text-gold-400 transition-colors">
            <Phone size={14} className="text-gold-400" />
            <span>071 699 7670</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-7 sm:px-8 py-3 sm:py-3.5 gold-gradient-bg text-black-900 font-semibold rounded-full hover:shadow-xl hover:shadow-gold-400/30 transition-all duration-300 text-sm uppercase tracking-wider w-full sm:w-auto text-center"
          >
            Explore Services
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-7 sm:px-8 py-3 sm:py-3.5 border border-gold-400/50 text-gold-300 font-semibold rounded-full hover:bg-gold-400/10 hover:border-gold-400 transition-all duration-300 text-sm uppercase tracking-wider w-full sm:w-auto text-center"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={28} className="text-gold-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
