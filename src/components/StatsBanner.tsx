import { motion } from 'framer-motion';
import { Users, Calendar, Award, Heart } from 'lucide-react';

const stats = [
  { icon: Users, value: '5,000+', label: 'Happy Clients' },
  { icon: Calendar, value: '10+', label: 'Years of Experience' },
  { icon: Award, value: '50+', label: 'Bridal Packages' },
  { icon: Heart, value: '100%', label: 'Satisfaction Rate' },
];

export default function StatsBanner() {
  return (
    <section className="py-12 sm:py-16 bg-black-800 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl gold-gradient-bg mb-3 sm:mb-4">
                <stat.icon size={22} className="text-black-900 sm:hidden" />
                <stat.icon size={28} className="text-black-900 hidden sm:block" />
              </div>
              <motion.p
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring' }}
                className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold gold-gradient-text mb-1"
              >
                {stat.value}
              </motion.p>
              <p className="text-gold-100/50 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
