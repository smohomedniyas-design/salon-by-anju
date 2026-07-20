import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Shanika Perera',
    role: 'Bridal Client',
    text: 'Anju did an absolutely stunning job on my bridal makeup and hair. I felt like a princess on my special day. The team was so professional and made sure every detail was perfect. Highly recommend their bridal package!',
    rating: 5,
  },
  {
    name: 'Dilini Fernando',
    role: 'Regular Client',
    text: 'I have been coming to Salon by Anju for over 3 years now. The keratin treatment transformed my frizzy hair completely. They use only the best products and the results always exceed my expectations.',
    rating: 5,
  },
  {
    name: 'Nethmi Silva',
    role: 'First-time Visitor',
    text: 'Visited for a facial and waxing. The salon is beautiful, clean, and has such a relaxing atmosphere. Anju was so friendly and professional. My skin has never looked better! Will definitely be a regular.',
    rating: 5,
  },
  {
    name: 'Tharushi Jayawardena',
    role: 'Bridal Client',
    text: 'The bridal package was worth every rupee. From the trial session to the wedding day, everything was handled with such care. My saree draping was flawless and the makeup lasted the entire day. Thank you Anju!',
    rating: 5,
  },
  {
    name: 'Kavindi Rathnayake',
    role: 'Regular Client',
    text: 'Best salon in Athurugiriya! I get my hair colored here regularly with L\'Or\u00e9al products and the color always looks vibrant and natural. The staff is talented and the prices are very reasonable for the quality.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 sm:py-24 bg-black-900 relative overflow-hidden">
      {/* Decorative elements - hidden on small mobile */}
      <div className="absolute top-10 left-4 sm:left-10 opacity-5 sm:opacity-10">
        <Quote size={60} className="text-gold-400 sm:hidden" />
        <Quote size={120} className="text-gold-400 hidden sm:block" />
      </div>
      <div className="absolute bottom-10 right-4 sm:right-10 opacity-5 sm:opacity-10 rotate-180">
        <Quote size={60} className="text-gold-400 sm:hidden" />
        <Quote size={120} className="text-gold-400 hidden sm:block" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
            Client Love
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our <span className="gold-gradient-text">Clients Say</span>
          </h2>
          <div className="section-divider max-w-xs mx-auto mt-4 sm:mt-6" />
        </motion.div>

        {/* Testimonial Card */}
        <div
          className="relative select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="min-h-[320px] sm:min-h-[260px] flex items-center justify-center px-2 sm:px-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                <div className="text-center">
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-4 sm:mb-6">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={i} size={18} className="text-gold-400 fill-gold-400 sm:hidden" />
                    ))}
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={`d-${i}`} size={20} className="text-gold-400 fill-gold-400 hidden sm:block" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-playfair text-base sm:text-xl lg:text-2xl text-gold-100/80 italic leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
                    &ldquo;{testimonials[current].text}&rdquo;
                  </p>

                  {/* Author */}
                  <div>
                    <p className="font-playfair text-base sm:text-lg font-semibold text-gold-200">
                      {testimonials[current].name}
                    </p>
                    <p className="text-gold-100/50 text-xs sm:text-sm uppercase tracking-wider mt-1">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - positioned better on mobile */}
          <button
            onClick={prev}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full border border-gold-400/20 text-gold-400 hover:bg-gold-400 hover:text-black-900 transition-all duration-300 active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="sm:hidden" />
            <ChevronLeft size={22} className="hidden sm:block" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full border border-gold-400/20 text-gold-400 hover:bg-gold-400 hover:text-black-900 transition-all duration-300 active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="sm:hidden" />
            <ChevronRight size={22} className="hidden sm:block" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`transition-all duration-300 rounded-full min-w-[10px] min-h-[10px] ${
                index === current
                  ? 'w-7 sm:w-8 h-2 sm:h-2.5 gold-gradient-bg'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gold-400/30 hover:bg-gold-400/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Swipe hint on mobile */}
        <p className="text-center text-gold-100/30 text-xs mt-4 sm:hidden">
          Swipe to browse
        </p>
      </div>
    </section>
  );
}
