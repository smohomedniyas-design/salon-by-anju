import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface ServiceOption {
  name: string;
  price: string;
}

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  const [bookingMethod, setBookingMethod] = useState<'whatsapp' | 'email' | null>(null);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([
    { name: 'Hair Coloring', price: '' },
    { name: 'Hair Straightening', price: '' },
    { name: 'Gel Nails', price: '' },
    { name: 'Acrylic Nails', price: '' },
    { name: 'Facial', price: '' },
    { name: 'Full Body Wax', price: '' },
    { name: 'Brazilian Wax', price: '' },
    { name: 'Oil Massage', price: '' },
    { name: 'Bridal Package', price: '' },
  ]);
  const [selectedServicePrice, setSelectedServicePrice] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const services = data.flatMap((category: any) =>
            Array.isArray(category.items)
              ? category.items.map((item: any) => ({ name: item.name, price: item.price }))
              : [],
          );
          if (services.length > 0) {
            setServiceOptions(services);
          }
        }
      })
      .catch(() => {});
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'service') {
      const selected = serviceOptions.find((s: ServiceOption) => s.name === value);
      setSelectedServicePrice(selected?.price || '');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.service) {
      setError('Please select a service');
      return false;
    }
    if (!formData.date) {
      setError('Please select a date');
      return false;
    }
    return true;
  };

  const handleWhatsAppBooking = () => {
    if (!validateForm()) return;

    const message = `Hello Salon by Anju! 💄

I would like to book an appointment:

📝 Name: ${formData.name}
📞 Phone: ${formData.phone}
${formData.email ? `📧 Email: ${formData.email}` : ''}
💇 Service: ${formData.service}
📅 Date: ${formData.date}
${formData.time ? `⏰ Time: ${formData.time}` : ''}
${formData.notes ? `📌 Notes: ${formData.notes}` : ''}

Looking forward to your confirmation!`;

    const whatsappNumber = '94716997670'; // Change this to your actual WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    // Persist booking to backend, but don't block opening WhatsApp
    submitBookingToApi().catch(() => {});
  };

  const handleEmailBooking = () => {
    if (!validateForm()) return;

    const emailBody = `Hello Salon by Anju,

I would like to book an appointment:

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time || 'Not specified'}
Additional Notes: ${formData.notes || 'None'}

Please confirm my booking at your earliest convenience.

Thank you!`;

    const mailtoLink = `mailto:infosalonbyanju@gmail.com?subject=Salon Booking Request - ${formData.name}&body=${encodeURIComponent(emailBody)}`;
    // Persist booking to backend, then open mail client
    submitBookingToApi().finally(() => {
      window.location.href = mailtoLink;
    });
  };

  const submitBookingToApi = async () => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        setSubmitted(true);
        resetForm();
      } else {
        setError('Could not submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking submit error:', err);
      setError('Network error sending booking');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      notes: '',
    });
    setBookingMethod(null);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="booking" className="py-16 sm:py-24 bg-black-900 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gold-400/3 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-lato">
            Easy Booking
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Book Your <span className="gold-gradient-text">Appointment</span>
          </h2>
          <p className="text-gold-100/50 text-sm sm:text-base max-w-xl mx-auto">
            Choose your preferred booking method and get confirmed instantly!
          </p>
          <div className="section-divider max-w-xs mx-auto mt-4 sm:mt-6" />
        </motion.div>

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 sm:p-5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
          >
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-300 font-semibold">Booking request sent!</p>
              <p className="text-green-300/70 text-sm mt-1">
                We'll confirm your appointment shortly.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 sm:p-5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 font-semibold text-sm">{error}</p>
          </motion.div>
        )}

        {/* Booking Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12"
        >
          {/* WhatsApp Method */}
          <button
            onClick={() => setBookingMethod(bookingMethod === 'whatsapp' ? null : 'whatsapp')}
            className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
              bookingMethod === 'whatsapp'
                ? 'border-gold-400 bg-gold-400/10'
                : 'border-gold-400/20 bg-black-800 hover:border-gold-400/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle size={24} className="text-gold-400" />
              <h3 className="text-lg font-semibold text-gold-200">WhatsApp</h3>
            </div>
            <p className="text-gold-100/50 text-sm">Get instant confirmation on WhatsApp</p>
          </button>

          {/* Email Method */}
          <button
            onClick={() => setBookingMethod(bookingMethod === 'email' ? null : 'email')}
            className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
              bookingMethod === 'email'
                ? 'border-gold-400 bg-gold-400/10'
                : 'border-gold-400/20 bg-black-800 hover:border-gold-400/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Mail size={24} className="text-gold-400" />
              <h3 className="text-lg font-semibold text-gold-200">Email</h3>
            </div>
            <p className="text-gold-100/50 text-sm">Receive booking confirmation via email</p>
          </button>
        </motion.div>

        {/* Form - Show when method is selected */}
        {bookingMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-black-800 border border-gold-400/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block text-gold-200 text-sm font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white placeholder:text-gold-100/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gold-200 text-sm font-semibold mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+94 71 234 5678"
                className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white placeholder:text-gold-100/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>

            {/* Email */}
            {bookingMethod === 'email' && (
              <div>
                <label className="block text-gold-200 text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white placeholder:text-gold-100/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            )}

            {/* Service */}
            <div>
              <label className="block text-gold-200 text-sm font-semibold mb-2">
                Service *
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400/50 transition-colors"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((service: ServiceOption) => (
                  <option key={service.name} value={service.name}>
                    {service.name} {service.price ? `- Rs. ${service.price}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Service Price Display */}
            {selectedServicePrice && (
              <div className="p-4 bg-gold-400/10 border border-gold-400/20 rounded-lg">
                <p className="text-gold-200 text-sm font-semibold">
                  Estimated Price: <span className="text-gold-400">Rs. {selectedServicePrice}</span>
                </p>
              </div>
            )}

            {/* Date */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gold-200 text-sm font-semibold mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-gold-200 text-sm font-semibold mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gold-200 text-sm font-semibold mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special requests or questions?"
                rows={3}
                className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white placeholder:text-gold-100/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={
                bookingMethod === 'whatsapp' ? handleWhatsAppBooking : handleEmailBooking
              }
              className="w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              {bookingMethod === 'whatsapp'
                ? 'Book via WhatsApp'
                : 'Send Booking Request'}
            </motion.button>
          </motion.div>
        )}

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-gold-100/40 text-xs sm:text-sm mt-8 sm:mt-10"
        >
          💬 Available Monday - Sunday, 9:00 AM - 8:00 PM | Contact: +94 71 699 7670
        </motion.p>
      </div>
    </section>
  );
}
