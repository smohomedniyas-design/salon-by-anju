import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Service, Gallery, Booking, BusinessInfo } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Auto-migration from content.json ──────────────────────────────────────────
async function migrateFromJson() {
  const dataFilePath = path.join(__dirname, 'data', 'content.json');
  if (!fs.existsSync(dataFilePath)) return;

  const [bizCount, svcCount, galCount] = await Promise.all([
    BusinessInfo.countDocuments(),
    Service.countDocuments(),
    Gallery.countDocuments(),
  ]);

  if (bizCount > 0 && svcCount > 0 && galCount > 0) {
    console.log('✅ MongoDB already has data — skipping migration.');
    return;
  }

  console.log('📦 Migrating data from content.json to MongoDB...');
  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  const data = JSON.parse(raw);

  if (bizCount === 0 && data.businessInfo) {
    await BusinessInfo.create(data.businessInfo);
    console.log('   ✔ Business info migrated');
  }
  if (svcCount === 0 && data.services?.length) {
    await Service.insertMany(data.services);
    console.log('   ✔ Services migrated');
  }
  if (galCount === 0 && data.gallery?.length) {
    await Gallery.insertMany(data.gallery);
    console.log('   ✔ Gallery migrated');
  }
  if (data.bookings?.length) {
    const bkCount = await Booking.countDocuments();
    if (bkCount === 0) {
      await Booking.insertMany(data.bookings);
      console.log('   ✔ Bookings migrated');
    }
  }
  console.log('🎉 Migration complete!');
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Get all content
app.get('/api/content', async (req, res) => {
  const [businessInfo, services, gallery, bookings] = await Promise.all([
    BusinessInfo.findOne().lean(),
    Service.find().lean(),
    Gallery.find().lean(),
    Booking.find().lean(),
  ]);
  res.json({ businessInfo, services, gallery, bookings });
});

// Business info
app.get('/api/business', async (req, res) => {
  const info = await BusinessInfo.findOne().lean();
  res.json(info || {});
});

app.put('/api/business', async (req, res) => {
  const info = await BusinessInfo.findOneAndUpdate({}, { $set: req.body }, { new: true, upsert: true });
  res.json({ success: true, data: info });
});

// Services
app.get('/api/services', async (req, res) => {
  const services = await Service.find().lean();
  res.json(services);
});

app.put('/api/services', async (req, res) => {
  await Service.deleteMany({});
  const services = await Service.insertMany(req.body);
  res.json({ success: true, data: services });
});

app.post('/api/services/:categoryId/items', async (req, res) => {
  const category = await Service.findOne({ id: parseInt(req.params.categoryId) });
  if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
  const newItem = { id: `item${Date.now()}`, ...req.body };
  category.items.push(newItem);
  await category.save();
  res.json({ success: true, data: newItem });
});

app.put('/api/services/:categoryId/items/:itemId', async (req, res) => {
  const category = await Service.findOne({ id: parseInt(req.params.categoryId) });
  if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
  const item = category.items.find((i) => i.id === req.params.itemId);
  if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
  Object.assign(item, req.body);
  await category.save();
  res.json({ success: true, data: item });
});

app.delete('/api/services/:categoryId/items/:itemId', async (req, res) => {
  const category = await Service.findOne({ id: parseInt(req.params.categoryId) });
  if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
  category.items = category.items.filter((i) => i.id !== req.params.itemId);
  await category.save();
  res.json({ success: true });
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  const gallery = await Gallery.find().lean();
  res.json(gallery);
});

app.put('/api/gallery', async (req, res) => {
  await Gallery.deleteMany({});
  const gallery = await Gallery.insertMany(req.body);
  res.json({ success: true, data: gallery });
});

app.post('/api/gallery', async (req, res) => {
  const count = await Gallery.countDocuments();
  const newImage = await Gallery.create({ id: Date.now(), ...req.body });
  res.json({ success: true, data: newImage });
});

app.delete('/api/gallery/:imageId', async (req, res) => {
  await Gallery.deleteOne({ id: parseInt(req.params.imageId) });
  res.json({ success: true });
});

// Upload gallery image via base64 → Cloudinary
app.post('/api/gallery/upload-base64', async (req, res) => {
  try {
    const { filename, data } = req.body || {};
    if (!filename || !data) return res.status(400).json({ success: false, error: 'Missing filename or data' });

    const result = await cloudinary.uploader.upload(data, {
      folder: 'salon-gallery',
      public_id: `${path.basename(filename, path.extname(filename))}-${Date.now()}`,
    });
    res.json({ success: true, fileUrl: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Upload static website asset (hero, about, logo) → Cloudinary
app.post('/api/upload-static', async (req, res) => {
  try {
    const { targetFilename, data } = req.body || {};
    if (!targetFilename || !data) return res.status(400).json({ success: false, error: 'Missing targetFilename or data' });

    const publicId = path.basename(targetFilename, path.extname(targetFilename));
    const result = await cloudinary.uploader.upload(data, {
      folder: 'salon-assets',
      public_id: publicId,
      overwrite: true,
    });
    res.json({ success: true, fileUrl: result.secure_url });
  } catch (error) {
    console.error('Static upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// List images (from Cloudinary)
app.get('/api/images', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({ type: 'upload', prefix: 'salon-gallery', max_results: 100 });
    const urls = result.resources.map((r) => r.secure_url);
    res.json(urls);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ success: false, error: 'Failed to list images' });
  }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  const booking = await Booking.create({ id: `booking${Date.now()}`, ...req.body });
  res.json({ success: true, data: booking });
});

app.put('/api/bookings/:bookingId', async (req, res) => {
  const booking = await Booking.findOneAndUpdate({ id: req.params.bookingId }, { $set: req.body }, { new: true });
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: booking });
});

app.delete('/api/bookings/:bookingId', async (req, res) => {
  await Booking.deleteOne({ id: req.params.bookingId });
  res.json({ success: true });
});

// Auth
app.post('/api/auth/login', async (req, res) => {
  const info = await BusinessInfo.findOne().lean();
  const adminPassword = info?.adminPassword || 'admin123';
  if (req.body.password === adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

app.post('/api/auth/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const info = await BusinessInfo.findOne();
  const adminPassword = info?.adminPassword || 'admin123';
  if (currentPassword !== adminPassword) return res.status(401).json({ success: false, error: 'Incorrect current password' });
  info.adminPassword = newPassword;
  await info.save();
  res.json({ success: true });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const info = await BusinessInfo.findOne().lean();
    const adminPassword = info?.adminPassword || 'admin123';
    const recoveryPath = path.join(__dirname, '..', 'recovery.txt');
    fs.writeFileSync(recoveryPath, `Salon by Anju - Password Recovery\n\nYour current admin password is: ${adminPassword}\n\nGenerated on: ${new Date().toLocaleString()}`);
    console.log(`\n=========================================\nPASSWORD RECOVERY REQUESTED\nPassword saved to: ${recoveryPath}\n=========================================\n`);
    res.json({ success: true, message: 'Recovery file created on server.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate recovery file' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', server: 'Salon by Anju API', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    await migrateFromJson();
    app.listen(PORT, () => {
      console.log(`✅ Salon Admin Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
