import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceItemSchema = new mongoose.Schema({ id: String, name: String, price: String });
const serviceSchema = new mongoose.Schema({ id: Number, category: String, items: [serviceItemSchema] });
const Service = mongoose.model('Service', serviceSchema);

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'content.json'), 'utf-8'));

await Service.deleteMany({});
await Service.insertMany(data.services);
console.log(`✅ Updated ${data.services.length} service categories in MongoDB`);

await mongoose.disconnect();
