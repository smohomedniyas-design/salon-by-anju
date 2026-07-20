import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      if (scrollPercent > 0.7 && !hasScrolledToBottom) {
        setShowBubble(true);
        setHasScrolledToBottom(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledToBottom]);

  // Auto-hide bubble after 8 seconds
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  const phoneNumber = '94716997670';
  const message = encodeURIComponent('Hi Salon by Anju! I would like to book an appointment. Can you help me?');
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <>
      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-[340px]"
          >
            <div className="bg-black-800 border border-gold-400/20 rounded-2xl shadow-2xl shadow-black-900/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-600 to-gold-400 px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative">
                    <img
                      src="/uploads/upload_1.jpeg"
                      alt="Salon by Anju"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/30 object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gold-500" />
                  </div>
                  <div>
                    <p className="font-playfair text-white font-semibold text-xs sm:text-sm">Salon by Anju</p>
                    <p className="text-white/70 text-[10px] sm:text-xs">Typically replies within minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="px-4 sm:px-5 py-4 sm:py-5 bg-black-800 min-h-[160px] sm:min-h-[180px]">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <img
                    src="/uploads/upload_1.jpeg"
                    alt="Salon by Anju"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="bg-gold-400/10 border border-gold-400/15 rounded-2xl rounded-tl-sm px-3.5 sm:px-4 py-2.5 sm:py-3">
                    <p className="text-gold-100/80 text-xs sm:text-sm leading-relaxed">
                      Hello! 💄 Welcome to Salon by Anju. How can we help you today? Feel free to ask about our services or book an appointment!
                    </p>
                    <p className="text-gold-100/40 text-[10px] sm:text-xs mt-1.5 sm:mt-2">Just now</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-black-700/50 border-t border-gold-400/10">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#1ea855] text-white font-semibold rounded-xl transition-colors duration-300 text-xs sm:text-sm"
                >
                  <MessageCircle size={16} className="sm:hidden" />
                  <MessageCircle size={18} className="hidden sm:block" />
                  Start Chat on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll-triggered Preview Bubble */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="fixed bottom-20 sm:bottom-24 right-16 sm:right-24 z-50 max-w-[220px] sm:max-w-[260px]"
          >
            <div className="bg-black-800 border border-gold-400/20 rounded-2xl rounded-br-sm shadow-xl px-3.5 sm:px-4 py-2.5 sm:py-3 relative">
              <button
                onClick={() => setShowBubble(false)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center text-black-900 hover:bg-gold-300 transition-colors"
                aria-label="Dismiss"
              >
                <X size={12} />
              </button>
              <p className="text-gold-100/80 text-xs sm:text-sm">
                Need help booking? Chat with us on WhatsApp! 💄
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowBubble(false);
        }}
        className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1ea855] shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open WhatsApp chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} className="text-white sm:hidden" />
              <X size={24} className="text-white hidden sm:block" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={22} className="text-white fill-white sm:hidden" />
              <MessageCircle size={26} className="text-white fill-white hidden sm:block" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
