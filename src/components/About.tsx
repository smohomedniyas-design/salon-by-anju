import { motion } from 'framer-motion';
import { Sparkles, Heart, Award } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Products',
    desc: 'We use only L\'Or\u00e9al and other prime brand products for all our treatments.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    desc: 'Every client receives individualized attention tailored to their unique beauty needs.',
  },
  {
    icon: Award,
    title: 'Expert Stylists',
    desc: 'Our skilled professionals bring years of experience in hair, beauty, and bridal styling.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-black-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              <img
                src="https://res.cloudinary.com/pvr1nexp/image/upload/v1784575069/salon-assets/about-image.jpg"
                alt="Beauty Treatment"
                className="w-full h-[350px] sm:h-[450px] lg:h-[500px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl border border-gold-400/20" />
              {/* Floating card - repositioned for mobile */}
              <div className="absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-6 bg-black-800 border border-gold-400/30 rounded-xl p-4 sm:p-6 shadow-xl">
                <p className="font-playfair text-2xl sm:text-3xl font-bold gold-gradient-text">10+</p>
                <p className="text-gold-200/70 text-xs sm:text-sm mt-1">Years of Excellence</p>
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-24 sm:h-24 border-t-2 border-l-2 border-gold-400/40 rounded-tl-xl" />
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 border-b-2 border-r-2 border-gold-400/40 rounded-br-xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
              About Us
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Where Beauty Meets{' '}
              <span className="gold-gradient-text">Elegance</span>
            </h2>
            <p className="text-gold-100/60 leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
              Salon by Anju is your premier destination for hair, beauty, and bridal services 
              in Millennium City, Athurugiriya. We believe every person deserves to look and feel 
              their absolute best.
            </p>
            <p className="text-gold-100/60 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg">
              From precision haircuts and vibrant color treatments to luxurious facials and 
              stunning bridal packages, our team of skilled professionals is dedicated to 
              delivering exceptional results using only premium products.
            </p>

            {/* Feature Cards */}
            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gold-400/10 hover:border-gold-400/30 transition-colors duration-300"
                >
                  <div className="p-2.5 sm:p-3 rounded-lg gold-gradient-bg shrink-0">
                    <feature.icon size={18} className="text-black-900" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-base sm:text-lg font-semibold text-gold-200 mb-0.5 sm:mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gold-100/50 text-xs sm:text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
