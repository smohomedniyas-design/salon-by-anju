import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-black-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
            Get in Touch
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact <span className="gold-gradient-text">Us</span>
          </h2>
          <div className="section-divider max-w-xs mx-auto mt-4 sm:mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gold-400/10 hover:border-gold-400/30 transition-colors duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl gold-gradient-bg shrink-0">
                  <MapPin size={18} className="text-black-900 sm:hidden" />
                  <MapPin size={22} className="text-black-900 hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-playfair text-base sm:text-lg font-semibold text-gold-200 mb-0.5 sm:mb-1">Visit Us</h3>
                  <p className="text-gold-100/60 text-sm">Millennium City, Athurugiriya, Sri Lanka</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gold-400/10 hover:border-gold-400/30 transition-colors duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl gold-gradient-bg shrink-0">
                  <Phone size={18} className="text-black-900 sm:hidden" />
                  <Phone size={22} className="text-black-900 hidden sm:block" />
                </div>
                <div>
                  <h3 className="font-playfair text-base sm:text-lg font-semibold text-gold-200 mb-0.5 sm:mb-1">Call Us</h3>
                  <a href="tel:0716997670" className="text-gold-100/60 text-sm hover:text-gold-400 transition-colors">
                    071 699 7670
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gold-400/10 hover:border-gold-400/30 transition-colors duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl gold-gradient-bg shrink-0">
                  <Clock size={18} className="text-black-900 sm:hidden" />
                  <Clock size={22} className="text-black-900 hidden sm:block" />
                </div>
                <div>
                  <h3 className="font-playfair text-base sm:text-lg font-semibold text-gold-200 mb-0.5 sm:mb-1">Opening Hours</h3>
                  <p className="text-gold-100/60 text-sm">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gold-100/60 text-sm">Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 sm:pt-4">
              <h3 className="font-playfair text-base sm:text-lg font-semibold text-gold-200 mb-3 sm:mb-4">Follow Us</h3>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="#"
                  className="p-2.5 sm:p-3 rounded-full border border-gold-400/20 text-gold-400 hover:bg-gold-400 hover:text-black-900 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="sm:hidden" />
                  <Instagram size={20} className="hidden sm:block" />
                </a>
                <a
                  href="#"
                  className="p-2.5 sm:p-3 rounded-full border border-gold-400/20 text-gold-400 hover:bg-gold-400 hover:text-black-900 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="sm:hidden" />
                  <Facebook size={20} className="hidden sm:block" />
                </a>
                <a
                  href="#"
                  className="p-2.5 sm:p-3 rounded-full border border-gold-400/20 text-gold-400 hover:bg-gold-400 hover:text-black-900 transition-all duration-300"
                  aria-label="Message"
                >
                  <MessageCircle size={18} className="sm:hidden" />
                  <MessageCircle size={20} className="hidden sm:block" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map / Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[320px] sm:h-full sm:min-h-[400px] rounded-xl sm:rounded-2xl overflow-hidden border border-gold-400/20">
              <img
                src="https://res.cloudinary.com/pvr1nexp/image/upload/v1784575948/salon-assets/contact-image.jpg"
                alt="Salon Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-900/80 via-transparent to-transparent" />
              
              {/* Overlay Card */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <div className="bg-black-800/40 backdrop-blur-sm border border-gold-400/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="font-playfair text-sm sm:text-base font-semibold text-gold-200 mb-1">
                    Book Your Appointment
                  </h3>
                  <p className="text-gold-100/60 text-xs mb-2 sm:mb-3">
                    Walk-ins welcome, but appointments are recommended for the best experience.
                  </p>
                  <a
                    href="tel:0716997670"
                    className="inline-flex items-center gap-2 px-4 py-2 gold-gradient-bg text-black-900 font-semibold rounded-full text-xs hover:shadow-lg hover:shadow-gold-400/30 transition-all duration-300"
                  >
                    <Phone size={14} className="sm:hidden" />
                    <Phone size={16} className="hidden sm:block" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
