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

const studioImages = [
  { file: 'WhatsApp Image 2026-07-14 at 21.01.00 (1) salona.jpeg', title: 'Our Salon' },
  { file: 'WhatsApp Image 2026-07-14 at 21.01.01 (1) anju.jpeg',   title: 'Salon Interior' },
  { file: 'WhatsApp Image 2026-07-14 at 21.02.40.jpeg',            title: 'Salon Space' },
  { file: 'WhatsApp Image 2026-07-14 at 21.02.41.jpeg',            title: 'Salon Workspace' },
];

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

const imagesDir = path.join(__dirname, '..', 'images');

for (const item of studioImages) {
  const filePath = path.join(imagesDir, item.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping (not found): ${item.file}`);
    continue;
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'salon-gallery',
      public_id: `studio-${item.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    });
    await Gallery.create({ id: Date.now(), title: item.title, category: 'Studio', image: result.secure_url });
    console.log(`✅ Uploaded: ${item.title}`);
  } catch (err) {
    console.log(`❌ Failed: ${item.file} — ${err.message}`);
  }
}

console.log('\n🎉 Studio images added to gallery!');
await mongoose.disconnect();
