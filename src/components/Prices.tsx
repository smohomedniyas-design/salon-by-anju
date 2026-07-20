import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scissors, Hand, Flower2, Palette, Crown, ChevronDown } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  price: string;
}

interface ServiceCategory {
  id: number;
  category: string;
  items: ServiceItem[];
}

const iconMap: Record<string, typeof Sparkles> = {
  'Face Treatments': Sparkles,
  'Hair Services': Scissors,
  'Hand & Foot Care': Hand,
  'Waxing Services': Flower2,
  'Botox Treatment (Prime Brand)': Palette,
  'Keratin Treatment (Prime Brand)': Palette,
  'Bridal Packages': Crown,
};

const fallbackCategories: ServiceCategory[] = [
  {
    id: 1,
    category: 'Face Treatments',
    items: [
      { id: 'ft1', name: 'Facial - Full Face Trending or Eyebrow Trending', price: 'FREE' },
      { id: 'ft2', name: 'Eyebrow Shaping', price: '200' },
      { id: 'ft3', name: 'Upper Lip Threading', price: '100' },
      { id: 'ft4', name: 'Full Face Threading', price: '1,000' },
      { id: 'ft5', name: 'Clean-Up (with Pack)', price: '1,500' },
    ],
  },
  {
    id: 2,
    category: 'Hair Services',
    items: [
      { id: 'hs1', name: 'Hair Colors', price: '10% OFF' },
      { id: 'hs2', name: 'Hair Straightening', price: '10% OFF' },
      { id: 'hs3', name: 'Oil Massage (Head & Shoulders)', price: '1,500' },
      { id: 'hs4', name: 'Haircut & Setting - Short Hair', price: '2,000' },
    ],
  },
  {
    id: 3,
    category: 'Hand & Foot Care',
    items: [
      { id: 'hf1', name: '2 Pedicures Bundle', price: '3,800 (with FREE gel nail color)' },
      { id: 'hf2', name: 'Gel Nails', price: '4,500 (First Set 3,500)' },
      { id: 'hf3', name: 'Acrylic Nails', price: '4,000' },
    ],
  },
];

export default function Prices() {
  const [priceCategories, setPriceCategories] = useState<ServiceCategory[]>(fallbackCategories);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPriceCategories(data);
        }
      })
      .catch(() => {
        // Keep fallback categories if backend is unavailable.
      });
  }, []);

  const toggleCategory = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="prices" className="py-16 sm:py-24 bg-black-900 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gold-400/3 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
            Transparent Pricing
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Our <span className="gold-gradient-text">Price List</span>
          </h2>
          <p className="text-gold-100/50 text-sm sm:text-base max-w-xl mx-auto">
            Tap a category to view prices. All prices in LKR.
          </p>
          <div className="section-divider max-w-xs mx-auto mt-4 sm:mt-6" />
        </motion.div>

        <div className="space-y-2.5 sm:space-y-3">
          {priceCategories.map((category, catIndex) => {
            const isOpen = openIndex === catIndex;
            const CategoryIcon = iconMap[category.category] || Sparkles;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.08 }}
                className="border border-gold-400/15 rounded-xl overflow-hidden hover:border-gold-400/30 transition-colors duration-500"
              >
                <button
                  onClick={() => toggleCategory(catIndex)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 bg-gold-400/5 hover:bg-gold-400/10 transition-colors duration-300 cursor-pointer min-h-[56px]"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="p-2 sm:p-2.5 rounded-lg gold-gradient-bg shrink-0">
                      <CategoryIcon size={18} className="text-black-900 sm:hidden" />
                      <CategoryIcon size={20} className="text-black-900 hidden sm:block" />
                    </div>
                    <h3 className="font-playfair text-base sm:text-lg lg:text-xl font-semibold text-gold-200 text-left truncate">
                      {category.category}
                    </h3>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
                    <ChevronDown size={20} className="text-gold-400 sm:hidden" />
                    <ChevronDown size={22} className="text-gold-400 hidden sm:block" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-gold-400/5 border-t border-gold-400/10">
                        {category.items.map((item, itemIndex) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: itemIndex * 0.04 }}
                            className="price-row flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 transition-colors duration-300 gap-3"
                          >
                            <span className="text-gold-100/70 text-xs sm:text-sm lg:text-base pr-2 min-w-0">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <div className="h-px w-4 sm:w-12 bg-gold-400/20 hidden sm:block" />
                              <span className="font-playfair text-gold-400 font-semibold whitespace-nowrap text-sm sm:text-base">
                                Rs. {item.price}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-gold-100/40 text-xs sm:text-sm mt-8 sm:mt-10"
        >
          * Prices may vary based on hair length and complexity. Please contact us for exact quotes.
        </motion.p>
      </div>
    </section>
  );
}
