import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

const defaultGalleryImages: GalleryItem[] = [
  { id: 1, title: 'Bridal Makeup', category: 'Bridal', image: '/images/bridal.jpg' },
  { id: 2, title: 'Professional Facial', category: 'Facial', image: '/images/facial.jpg' },
  { id: 3, title: 'Hair Coloring', category: 'Hair', image: '/images/hair-color.jpg' },
  { id: 4, title: 'Nail Art & Design', category: 'Nails', image: '/images/nails.jpg' },
  { id: 5, title: 'Salon Interior', category: 'Studio', image: '/images/salon-interior.jpg' },
];

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>(defaultGalleryImages);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryImages(data);
        }
      })
      .catch(() => {
        // keep fallback content
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(galleryImages.map((image) => image.category)))];

  const filteredImages =
    selectedCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage);
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage);
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1].id);
    }
  };

  const selectedImageData = galleryImages.find((img) => img.id === selectedImage);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-black-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
            Our Work
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Gallery &amp; <span className="gold-gradient-text">Transformations</span>
          </h2>
          <div className="section-divider max-w-xs mx-auto mt-4 sm:mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-10 sm:mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'gold-gradient-bg text-black-900'
                  : 'border border-gold-400/30 text-gold-200 hover:border-gold-400/60 hover:text-gold-400'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedImage(image.id)}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer aspect-square"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-900 via-black-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                  <div>
                    <p className="text-gold-400 text-xs sm:text-sm font-semibold mb-1">
                      {image.category}
                    </p>
                    <h3 className="text-gold-200 text-sm sm:text-base font-semibold">
                      {image.title}
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 border border-gold-400/0 group-hover:border-gold-400/30 rounded-xl sm:rounded-2xl transition-colors duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedImage && selectedImageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[90vh]"
              >
                <img
                  src={selectedImageData.image}
                  alt={selectedImageData.title}
                  className="w-full h-full object-cover rounded-2xl"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black-900 to-transparent rounded-b-2xl">
                  <p className="text-gold-400 text-sm font-semibold mb-1">{selectedImageData.category}</p>
                  <h3 className="text-gold-200 text-xl sm:text-2xl font-semibold">
                    {selectedImageData.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-gold-400/10 hover:bg-gold-400/20 rounded-full transition-colors duration-300"
                >
                  <X size={24} className="text-gold-400" />
                </button>

                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      disabled={filteredImages.findIndex((img) => img.id === selectedImage) === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gold-400/10 hover:bg-gold-400/20 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={24} className="text-gold-400" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={
                        filteredImages.findIndex((img) => img.id === selectedImage) ===
                        filteredImages.length - 1
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gold-400/10 hover:bg-gold-400/20 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={24} className="text-gold-400" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-400/10 rounded-full backdrop-blur-sm">
                  <p className="text-gold-400 text-xs sm:text-sm font-semibold">
                    {filteredImages.findIndex((img) => img.id === selectedImage) + 1} / {filteredImages.length}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
