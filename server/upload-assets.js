import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagesDir = path.join(__dirname, '..', 'images');

const assets = [
  { file: 'WhatsApp Image 2026-07-14 at 21.01.00 (1) salona.jpeg', public_id: 'salon-assets/hero-bg' },
  { file: 'WhatsApp Image 2026-07-14 at 21.01.03.jpeg', public_id: 'salon-assets/about-image' },
  { file: 'WhatsApp Image 2026-07-14 at 21.01.01 (1) anju.jpeg', public_id: 'salon-assets/contact-image' },
];

const urls = {};

for (const asset of assets) {
  const filePath = path.join(imagesDir, asset.file);
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: asset.public_id,
    overwrite: true,
  });
  urls[asset.public_id.split('/')[1]] = result.secure_url;
  console.log(`✅ Uploaded ${asset.public_id}: ${result.secure_url}`);
}

console.log('\n📋 Copy these URLs:');
console.log(JSON.stringify(urls, null, 2));
