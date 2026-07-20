import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scissors, Hand, Flower2, Palette, Crown, ChevronDown, Tag } from 'lucide-react';

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
  'Special Promotions': Tag,
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
    id: 0,
    category: 'Special Promotions',
    items: [
      { id: 'sp1', name: '2 Pedicures + 2 Manicures with Gel Nail Color FREE', price: '3,800' },
      { id: 'sp2', name: 'Hair Colors', price: '10% OFF' },
      { id: 'sp3', name: 'Hair Straightening', price: '10% OFF' },
      { id: 'sp4', name: 'Facial - FREE Full Face Threading or Eyebrow Threading', price: 'Promo' },
    ],
  },
  {
    id: 1,
    category: 'Face Treatments',
    items: [
      { id: 'ft1', name: 'Eyebrow Shaping', price: '200' },
      { id: 'ft2', name: 'Upper Lip Threading', price: '100' },
      { id: 'ft3', name: 'Full Face Threading', price: '1,000' },
      { id: 'ft4', name: 'Clean-Up (with Pack)', price: '1,500' },
      { id: 'ft5', name: 'Facial', price: 'From 2,500' },
      { id: 'ft6', name: 'Pimple Treatment', price: '2,800 up' },
      { id: 'ft7', name: 'Gold Facial', price: '3,500 up' },
    ],
  },
  {
    id: 2,
    category: 'Hair Services',
    items: [
      { id: 'hs1', name: 'Haircut & Setting - Short Hair', price: '2,000' },
      { id: 'hs2', name: 'Haircut & Setting - Medium Length', price: '2,500' },
      { id: 'hs3', name: 'Haircut & Setting - Long Layers', price: '3,000' },
      { id: 'hs4', name: 'Root Colour', price: '800' },
      { id: 'hs5', name: 'Root Colour with Colors', price: '2,300' },
      { id: 'hs6', name: 'Deep Conditioning Treatment', price: '2,500' },
      { id: 'hs7', name: 'Oil Massage', price: '1,000' },
      { id: 'hs8', name: 'Oil Massage - Head & Shoulders', price: '1,500' },
      { id: 'hs9', name: "Fashion Hair Colour (L'Oréal)", price: 'From 8,000' },
      { id: 'hs10', name: 'Makeup', price: '2,500 - 3,000' },
      { id: 'hs11', name: 'Early Dressing', price: '3,000' },
      { id: 'hs12', name: 'Hair & Makeup', price: '2,000' },
      { id: 'hs13', name: 'Saree Draping', price: '500' },
    ],
  },
  {
    id: 3,
    category: 'Hand & Foot Care',
    items: [
      { id: 'hf1', name: 'Pedicure (with Pack)', price: '2,500' },
      { id: 'hf2', name: 'Manicure (with Pack)', price: '1,500' },
      { id: 'hf3', name: 'Gel Colour Change', price: '1,300' },
      { id: 'hf4', name: 'Gel Nails', price: '4,500' },
      { id: 'hf5', name: 'Gel Nails - First Set', price: '3,500' },
      { id: 'hf6', name: 'Acrylic Nails', price: '4,000' },
    ],
  },
  {
    id: 4,
    category: 'Waxing Services',
    items: [
      { id: 'ws1', name: 'Full Legs', price: '2,500' },
      { id: 'ws2', name: 'Full Arms', price: '2,000' },
      { id: 'ws3', name: 'Underarms', price: '1,000' },
      { id: 'ws4', name: 'Full Body Wax', price: '5,000' },
      { id: 'ws5', name: 'Brazilian Wax', price: '4,500' },
    ],
  },
  {
    id: 5,
    category: 'Botox Treatment (Prime Brand)',
    items: [
      { id: 'bt1', name: 'Shoulder Length', price: '10,000' },
      { id: 'bt2', name: 'Medium Length', price: '15,000' },
      { id: 'bt3', name: 'Long Hair', price: '20,000' },
    ],
  },
  {
    id: 6,
    category: 'Keratin Treatment (Prime Brand)',
    items: [
      { id: 'kt1', name: 'Shoulder Length', price: '15,000' },
      { id: 'kt2', name: 'Medium Length', price: '20,000' },
      { id: 'kt3', name: 'Long Hair', price: '25,000 up' },
    ],
  },
  {
    id: 7,
    category: 'Bridal Packages',
    items: [
      { id: 'bp1', name: 'Complete Bridal Package', price: '100,000 up' },
    ],
  },
];

export default function Prices() {
  const [priceCategories, setPriceCategories] = useState<ServiceCategory[]>(fallbackCategories);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPriceCategories(data);
        }
      })
      .catch(() => {});
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
            const isPromo = category.category === 'Special Promotions';

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.08 }}
                className={`border rounded-xl overflow-hidden transition-colors duration-500 ${
                  isPromo
                    ? 'border-gold-400/40 hover:border-gold-400/60'
                    : 'border-gold-400/15 hover:border-gold-400/30'
                }`}
              >
                <button
                  onClick={() => toggleCategory(catIndex)}
                  className={`w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 transition-colors duration-300 cursor-pointer min-h-[56px] ${
                    isPromo ? 'bg-gold-400/15 hover:bg-gold-400/20' : 'bg-gold-400/5 hover:bg-gold-400/10'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="p-2 sm:p-2.5 rounded-lg gold-gradient-bg shrink-0">
                      <CategoryIcon size={18} className="text-black-900 sm:hidden" />
                      <CategoryIcon size={20} className="text-black-900 hidden sm:block" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-playfair text-base sm:text-lg lg:text-xl font-semibold text-gold-200 truncate">
                        {category.category}
                      </h3>
                      {isPromo && (
                        <p className="text-gold-400 text-xs mt-0.5">Limited time offers</p>
                      )}
                    </div>
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
                        {category.items.map((item, itemIndex) => {
                          const isSpecial = item.price === 'Promo' || item.price.includes('OFF') || item.price === 'FREE';
                          return (
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
                                <span className={`font-playfair font-semibold whitespace-nowrap text-sm sm:text-base ${
                                  isSpecial ? 'text-green-400' : 'text-gold-400'
                                }`}>
                                  {isSpecial ? item.price : `Rs. ${item.price}`}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
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
