import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// ── MongoDB connection (reuse across warm invocations) ────────────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Schemas ───────────────────────────────────────────────────────────────────
const serviceItemSchema = new mongoose.Schema({ id: String, name: String, price: String });
const serviceSchema = new mongoose.Schema({ id: Number, category: String, items: [serviceItemSchema] });
const gallerySchema = new mongoose.Schema({ id: Number, title: String, category: String, image: String });
const bookingSchema = new mongoose.Schema({
  id: String, name: String, phone: String, email: String,
  service: String, date: String, time: String, message: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: String, default: () => new Date().toISOString() },
});
const businessInfoSchema = new mongoose.Schema({
  name: String, phone: String, email: String, address: String,
  adminPassword: { type: String, default: 'admin123' },
  hours: { weekday: String, weekend: String },
  assetUrls: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const BusinessInfo = mongoose.models.BusinessInfo || mongoose.model('BusinessInfo', businessInfoSchema);

// ── Helper ────────────────────────────────────────────────────────────────────
function send(res, status, data) {
  res.status(status).json(data);
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const url = req.url.replace(/^\/api/, '').split('?')[0];
  const method = req.method;

  try {
    // Health
    if (url === '/health' && method === 'GET') {
      return send(res, 200, { status: 'OK', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
    }

    // Content
    if (url === '/content' && method === 'GET') {
      const [businessInfo, services, gallery, bookings] = await Promise.all([
        BusinessInfo.findOne().lean(),
        Service.find().lean(),
        Gallery.find().lean(),
        Booking.find().lean(),
      ]);
      return send(res, 200, { businessInfo, services, gallery, bookings });
    }

    // Business
    if (url === '/business' && method === 'GET') {
      return send(res, 200, await BusinessInfo.findOne().lean() || {});
    }
    if (url === '/business' && method === 'PUT') {
      const info = await BusinessInfo.findOneAndUpdate({}, { $set: req.body }, { new: true, upsert: true });
      return send(res, 200, { success: true, data: info });
    }

    // Services
    if (url === '/services' && method === 'GET') {
      return send(res, 200, await Service.find().lean());
    }
    if (url === '/services' && method === 'PUT') {
      await Service.deleteMany({});
      const services = await Service.insertMany(req.body);
      return send(res, 200, { success: true, data: services });
    }

    // Service items
    const serviceItemMatch = url.match(/^\/services\/(\d+)\/items$/);
    const serviceItemEditMatch = url.match(/^\/services\/(\d+)\/items\/(.+)$/);

    if (serviceItemMatch && method === 'POST') {
      const category = await Service.findOne({ id: parseInt(serviceItemMatch[1]) });
      if (!category) return send(res, 404, { success: false, error: 'Category not found' });
      const newItem = { id: `item${Date.now()}`, ...req.body };
      category.items.push(newItem);
      await category.save();
      return send(res, 200, { success: true, data: newItem });
    }
    if (serviceItemEditMatch && method === 'PUT') {
      const category = await Service.findOne({ id: parseInt(serviceItemEditMatch[1]) });
      if (!category) return send(res, 404, { success: false, error: 'Category not found' });
      const item = category.items.find(i => i.id === serviceItemEditMatch[2]);
      if (!item) return send(res, 404, { success: false, error: 'Item not found' });
      Object.assign(item, req.body);
      await category.save();
      return send(res, 200, { success: true, data: item });
    }
    if (serviceItemEditMatch && method === 'DELETE') {
      const category = await Service.findOne({ id: parseInt(serviceItemEditMatch[1]) });
      if (!category) return send(res, 404, { success: false, error: 'Category not found' });
      category.items = category.items.filter(i => i.id !== serviceItemEditMatch[2]);
      await category.save();
      return send(res, 200, { success: true });
    }

    // Gallery upload (must be before /gallery POST)
    if (url === '/gallery/upload-base64' && method === 'POST') {
      const { filename, data } = req.body || {};
      if (!filename || !data) return send(res, 400, { success: false, error: 'Missing filename or data' });
      const result = await cloudinary.uploader.upload(data, {
        folder: 'salon-gallery',
        public_id: `${path.basename(filename, path.extname(filename))}-${Date.now()}`,
      });
      return send(res, 200, { success: true, fileUrl: result.secure_url });
    }

    // Gallery
    if (url === '/gallery' && method === 'GET') {
      return send(res, 200, await Gallery.find().lean());
    }
    if (url === '/gallery' && method === 'POST') {
      const newImage = await Gallery.create({ id: Date.now(), ...req.body });
      return send(res, 200, { success: true, data: newImage });
    }
    if (url === '/gallery' && method === 'PUT') {
      await Gallery.deleteMany({});
      const gallery = await Gallery.insertMany(req.body);
      return send(res, 200, { success: true, data: gallery });
    }

    const galleryDeleteMatch = url.match(/^\/gallery\/(\d+)$/);
    if (galleryDeleteMatch && method === 'DELETE') {
      await Gallery.deleteOne({ id: parseInt(galleryDeleteMatch[1]) });
      return send(res, 200, { success: true });
    }

    // Static asset upload → Cloudinary + save URL to BusinessInfo
    if (url === '/upload-static' && method === 'POST') {
      const { targetFilename, data } = req.body || {};
      if (!targetFilename || !data) return send(res, 400, { success: false, error: 'Missing targetFilename or data' });
      const publicId = targetFilename.replace(/[^a-zA-Z0-9_-]/g, '-');
      const result = await cloudinary.uploader.upload(data, {
        folder: 'salon-assets',
        public_id: publicId,
        overwrite: true,
      });
      // Save URL to BusinessInfo so frontend can read it
      await BusinessInfo.findOneAndUpdate({}, { $set: { [`assetUrls.${publicId}`]: result.secure_url } }, { upsert: true });
      return send(res, 200, { success: true, fileUrl: result.secure_url });
    }

    // Get asset URLs
    if (url === '/asset-urls' && method === 'GET') {
      const info = await BusinessInfo.findOne().lean();
      return send(res, 200, info?.assetUrls || {});
    }

    // Images list
    if (url === '/images' && method === 'GET') {
      const result = await cloudinary.api.resources({ type: 'upload', prefix: 'salon-gallery', max_results: 100 });
      return send(res, 200, result.resources.map(r => r.secure_url));
    }

    // Bookings
    if (url === '/bookings' && method === 'GET') {
      return send(res, 200, await Booking.find().sort({ createdAt: -1 }).lean());
    }
    if (url === '/bookings' && method === 'POST') {
      const booking = await Booking.create({ id: `booking${Date.now()}`, ...req.body });
      return send(res, 200, { success: true, data: booking });
    }

    const bookingEditMatch = url.match(/^\/bookings\/(.+)$/);
    if (bookingEditMatch && method === 'PUT') {
      const booking = await Booking.findOneAndUpdate({ id: bookingEditMatch[1] }, { $set: req.body }, { new: true });
      if (!booking) return send(res, 404, { success: false, error: 'Booking not found' });
      return send(res, 200, { success: true, data: booking });
    }
    if (bookingEditMatch && method === 'DELETE') {
      await Booking.deleteOne({ id: bookingEditMatch[1] });
      return send(res, 200, { success: true });
    }

    // Auth
    if (url === '/auth/login' && method === 'POST') {
      const info = await BusinessInfo.findOne().lean();
      const adminPassword = info?.adminPassword || 'admin123';
      if (req.body.password === adminPassword) return send(res, 200, { success: true });
      return send(res, 401, { success: false, error: 'Invalid password' });
    }
    if (url === '/auth/password' && method === 'POST') {
      const { currentPassword, newPassword } = req.body;
      const info = await BusinessInfo.findOne();
      if (currentPassword !== (info?.adminPassword || 'admin123')) {
        return send(res, 401, { success: false, error: 'Incorrect current password' });
      }
      info.adminPassword = newPassword;
      await info.save();
      return send(res, 200, { success: true });
    }
    if (url === '/auth/forgot-password' && method === 'POST') {
      const info = await BusinessInfo.findOne().lean();
      const adminPassword = info?.adminPassword || 'admin123';
      console.log(`PASSWORD RECOVERY: ${adminPassword}`);
      return send(res, 200, { success: true, message: 'Check server logs for password.' });
    }

    return send(res, 404, { error: 'Not found' });

  } catch (error) {
    console.error('API error:', error);
    return send(res, 500, { error: error.message });
  }
}
