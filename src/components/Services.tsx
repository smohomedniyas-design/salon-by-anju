import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Hand, Flower2, Crown, Palette } from 'lucide-react';

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

const imageMap: Record<string, string> = {
  'Face Treatments': '/images/facial.jpg',
  'Hair Services': '/images/hair-color.jpg',
  'Hand & Foot Care': '/images/nails.jpg',
  'Waxing Services': '/images/salon-interior.jpg',
  'Botox Treatment (Prime Brand)': '/images/hair-color.jpg',
  'Keratin Treatment (Prime Brand)': '/images/hair-color.jpg',
  'Bridal Packages': '/images/bridal.jpg',
};

const serviceKeyMap: Record<string, string> = {
  'Face Treatments': 'service-face-treatments',
  'Hair Services': 'service-hair-services',
  'Hand & Foot Care': 'service-hand-foot-care',
  'Waxing Services': 'service-waxing-services',
  'Botox Treatment (Prime Brand)': 'service-botox-treatment',
  'Keratin Treatment (Prime Brand)': 'service-keratin-treatment',
  'Bridal Packages': 'service-bridal-packages',
};

const descriptionMap: Record<string, string> = {
  'Face Treatments': 'Eyebrow shaping, threading, facials, clean-ups, and pimple treatments for radiant skin.',
  'Hair Services': 'Precision haircuts, coloring, conditioning, oil massages, and professional styling.',
  'Hand & Foot Care': 'Manicures, pedicures, gel & acrylic nails for perfectly polished hands and feet.',
  'Waxing Services': 'Smooth hair removal for legs, arms, underarms, full body & Brazilian waxing.',
  'Botox Treatment (Prime Brand)': 'Premium treatments using prime brand products for silky, manageable hair.',
  'Keratin Treatment (Prime Brand)': 'Premium smoothing treatments for healthier, frizz-free hair.',
  'Bridal Packages': 'Complete bridal transformations including makeup, hair, and saree draping.',
};

const fallbackServices: ServiceCategory[] = [
  {
    id: 1,
    category: 'Face Treatments',
    items: [
      { id: 'ft1', name: 'Facial - Full Face Trending or Eyebrow Trending', price: 'FREE' },
      { id: 'ft2', name: 'Eyebrow Shaping', price: '200' },
      { id: 'ft3', name: 'Upper Lip Threading', price: '100' },
    ],
  },
  {
    id: 2,
    category: 'Hair Services',
    items: [
      { id: 'hs1', name: 'Hair Colors', price: '10% OFF' },
      { id: 'hs2', name: 'Hair Straightening', price: '10% OFF' },
      { id: 'hs3', name: 'Oil Massage (Head & Shoulders)', price: '1,500' },
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
  {
    id: 4,
    category: 'Waxing Services',
    items: [
      { id: 'ws1', name: 'Full Body Wax', price: '5,000' },
      { id: 'ws2', name: 'Brazilian Wax', price: '4,500' },
    ],
  },
  {
    id: 5,
    category: 'Bridal Packages',
    items: [
      { id: 'bp1', name: 'Complete Bridal Package', price: '100,000 up' },
    ],
  },
];

export default function Services() {
  const [categories, setCategories] = useState<ServiceCategory[]>(fallbackServices);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setCategories(data); })
      .catch(() => {});
    fetch('/api/asset-urls')
      .then((res) => res.json())
      .then((data) => { if (data) setAssetUrls(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="py-16 sm:py-24 bg-black-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
            What We Offer
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our <span className="gold-gradient-text">Services</span>
          </h2>
          <div className="section-divider max-w-xs mx-auto mt-4 sm:mt-6" />
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((service, index) => {
            const Icon = iconMap[service.category] || Sparkles;
            const key = serviceKeyMap[service.category];
            const image = (key && assetUrls[key]) || imageMap[service.category] || '/images/salon-interior.jpg';
            const desc = descriptionMap[service.category] || 'Expert salon care with premium products.';

            return (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gold-400/10 hover:border-gold-400/30 transition-all duration-500"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={image}
                    alt={service.category}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-900 via-black-900/50 to-transparent" />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-full gold-gradient-bg">
                    <Icon size={20} className="text-black-900" />
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="font-playfair text-lg sm:text-xl font-semibold text-gold-200 mb-1.5 sm:mb-2 group-hover:text-gold-400 transition-colors">
                    {service.category}
                  </h3>
                  <p className="text-gold-100/50 text-xs sm:text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gold-400/5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
