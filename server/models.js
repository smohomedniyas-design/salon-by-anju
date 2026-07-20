import mongoose from 'mongoose';

const serviceItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
});

const serviceSchema = new mongoose.Schema({
  id: Number,
  category: String,
  items: [serviceItemSchema],
});

const gallerySchema = new mongoose.Schema({
  id: Number,
  title: String,
  category: String,
  image: String,
});

const bookingSchema = new mongoose.Schema({
  id: String,
  name: String,
  phone: String,
  email: String,
  service: String,
  date: String,
  time: String,
  message: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const businessInfoSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  adminPassword: { type: String, default: 'admin123' },
  hours: {
    weekday: String,
    weekend: String,
  },
});

export const Service = mongoose.model('Service', serviceSchema);
export const Gallery = mongoose.model('Gallery', gallerySchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const BusinessInfo = mongoose.model('BusinessInfo', businessInfoSchema);
