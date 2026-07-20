import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const gallerySchema = new mongoose.Schema({ id: Number, title: String, category: String, image: String });
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

// Pick the best images with categories
const imagesToUpload = [
  { file: 'WhatsApp Image 2026-07-14 at 21.00.52.jpeg',     title: 'Bridal Look',           category: 'Bridal' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.52 (1).jpeg', title: 'Bridal Makeup',         category: 'Bridal' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.53.jpeg',     title: 'Bridal Styling',        category: 'Bridal' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.53 (1).jpeg', title: 'Bridal Transformation', category: 'Bridal' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.54.jpeg',     title: 'Hair Styling',          category: 'Hair' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.54 (1).jpeg', title: 'Hair Color',            category: 'Hair' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.55.jpeg',     title: 'Hair Treatment',        category: 'Hair' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.56.jpeg',     title: 'Nail Art',              category: 'Nails' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.57.jpeg',     title: 'Gel Nails',             category: 'Nails' },
  { file: 'WhatsApp Image 2026-07-14 at 21.00.58.jpeg',     title: 'Nail Design',           category: 'Nails' },
  { file: 'WhatsApp Image 2026-07-14 at 21.01.00.jpeg',     title: 'Facial Treatment',      category: 'Facial' },
  { file: 'WhatsApp Image 2026-07-14 at 21.01.01.jpeg',     title: 'Skin Care',             category: 'Facial' },
  { file: 'WhatsApp Image 2026-07-14 at 21.02.29.jpeg',     title: 'Salon Work',            category: 'Hair' },
  { file: 'WhatsApp Image 2026-07-14 at 21.02.37.jpeg',     title: 'Beauty Treatment',      category: 'Facial' },
  { file: 'WhatsApp Image 2026-07-14 at 21.02.42.jpeg',     title: 'Waxing Service',        category: 'Waxing' },
];

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

// Clear old gallery entries
await Gallery.deleteMany({});
console.log('🗑️  Cleared old gallery');

const imagesDir = path.join(__dirname, '..', 'images');
const results = [];

for (const item of imagesToUpload) {
  const filePath = path.join(imagesDir, item.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping (not found): ${item.file}`);
    continue;
  }
  try {
    const publicId = item.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'salon-gallery',
      public_id: publicId,
    });
    results.push({
      id: Date.now() + results.length,
      title: item.title,
      category: item.category,
      image: result.secure_url,
    });
    console.log(`✅ Uploaded: ${item.title}`);
  } catch (err) {
    console.log(`❌ Failed: ${item.file} — ${err.message}`);
  }
}

if (results.length > 0) {
  await Gallery.insertMany(results);
  console.log(`\n🎉 Done! ${results.length} images uploaded to Cloudinary and saved to MongoDB.`);
}

await mongoose.disconnect();
