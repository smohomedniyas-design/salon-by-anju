# Salon by Anju - Complete Website Guide

Welcome! This is your complete salon website solution with an admin dashboard for managing everything.

## 🎯 Features

✅ **Professional Website**
- Beautiful hero section
- Services showcase
- Gallery with filtering
- Testimonials
- Booking system (WhatsApp + Email)
- Contact section
- Mobile responsive

✅ **Admin Dashboard** 
- Manage business information
- View and manage bookings
- Edit pricing and services
- Manage gallery images
- Password-protected admin access

✅ **Backend System**
- Node.js + Express API
- JSON-based data storage
- Easy to understand and modify
- No database required

---

## 🚀 Setup Instructions

### Step 1: Install Frontend Dependencies

```bash
cd "c:\Users\HP\Downloads\salon project"
npm install
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 3: Start the Backend Server

Open a new terminal and run:

```bash
cd "c:\Users\HP\Downloads\salon project\server"
npm start
```

You should see:
```
✅ Salon Admin Backend running on http://localhost:5000
```

### Step 4: Start the Frontend (in a new terminal)

```bash
cd "c:\Users\HP\Downloads\salon project"
npm run dev
```

The website will open at: **http://localhost:5173/**

---

## 🔐 Access the Admin Dashboard

1. Go to: **http://localhost:5173/admin**
2. Login with password: **admin123**
3. Change the password in `src/components/AdminDashboard.tsx` (line 28)

### Admin Dashboard Features:

**Business Info Tab:**
- Edit salon name, phone, email, address, hours

**Bookings Tab:**
- View all customer bookings
- Change booking status (Pending → Confirmed → Rejected)
- Delete bookings

**Services Tab** (Coming Soon):
- Edit pricing for each service
- Add/remove services
- Bulk updates

**Gallery Tab** (Coming Soon):
- Upload new gallery images
- Manage image categories
- Delete images

---

## 📱 Booking System

Customers can book via two methods:

1. **WhatsApp** - Instant messaging integration
   - Form data automatically formatted
   - Opens WhatsApp Web or app
   - Default number: +94 71 699 7670 (edit in `src/components/Booking.tsx` line 103)

2. **Email** - Send booking request via email
   - Customer fills form
   - Email opens with pre-filled content
   - Edit your email in `src/components/Booking.tsx` (change `salon@example.com`)

---

## 🖼️ Gallery Management

**Current Gallery Images:**
Located in: `public/images/`
- bridal.jpg
- facial.jpg
- hair-color.jpg
- nails.jpg
- salon-interior.jpg

**Add More Images:**
1. Place images in `public/images/` folder
2. Edit `src/components/Gallery.tsx`
3. Add to the `galleryImages` array

Example:
```javascript
{
  id: 9,
  title: 'Your Service',
  category: 'Hair',
  image: '/images/your-image.jpg',
}
```

---

## 💰 Update Pricing

Edit pricing in: `src/components/Prices.tsx`

The `priceCategories` array contains all services. Example:

```javascript
{
  name: 'Gel Nails',
  price: '4,500 (First Set 3,500)'
}
```

Changes are automatically reflected on the website.

---

## 📞 Contact Information

Update salon details in these files:

1. **Phone Number:**
   - `src/components/Booking.tsx` (line 103)
   - `src/components/WhatsAppChat.tsx`

2. **Email:**
   - `src/components/Booking.tsx` (email booking)
   - `src/components/Contact.tsx`

3. **Business Hours:**
   - `src/components/Booking.tsx` (line 168)
   - `server/data/content.json` (business hours)

---

## 🔒 Security Notes

⚠️ **IMPORTANT - Change the Admin Password!**

Currently set to: `admin123`

To change:
1. Open: `src/components/AdminDashboard.tsx`
2. Find line 28: `const ADMIN_PASSWORD = 'admin123';`
3. Change to your secure password
4. Redeploy

---

## 📡 API Endpoints (Backend)

Available at: `http://localhost:5000/api`

```
GET  /api/content          - All content
GET  /api/business         - Business info
PUT  /api/business         - Update business info
GET  /api/services         - All services
PUT  /api/services         - Update services
POST /api/services/:id/items - Add service
PUT  /api/gallery          - Update gallery
POST /api/gallery          - Add image
GET  /api/bookings         - All bookings
POST /api/bookings         - Create booking
```

---

## 🎨 Customize Branding

1. **Logo**: Replace `public/uploads/upload_1.jpeg`
2. **Site Name**: Edit in multiple files:
   - `index.html` (title)
   - `src/components/Navbar.tsx`
   - `server/data/content.json`

3. **Colors**: Edit in CSS files:
   - `src/App.css`
   - `src/index.css`
   - Look for gold and black color variables

---

## 🚀 Deployment

### Option 1: Netlify (Frontend)
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod --dir dist`

### Option 2: Vercel (Frontend)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Backend Deployment (Express Server)
1. Deploy to Heroku, Railway, or Render
2. Set environment variables for production
3. Update API URL in frontend

---

## 📝 Customization Checklist

- [ ] Change admin password in `AdminDashboard.tsx`
- [ ] Update WhatsApp number in `Booking.tsx`
- [ ] Update email address for bookings
- [ ] Update salon phone number
- [ ] Update salon address & hours
- [ ] Upload your logo
- [ ] Add gallery images
- [ ] Update service pricing
- [ ] Review and update testimonials
- [ ] Test booking system

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check if port 5000 is available
- Run: `npm install` in server folder first

**Frontend not showing images?**
- Make sure images are in `public/images/`
- Check image paths in component files

**Booking form not working?**
- Ensure backend is running on port 5000
- Check WhatsApp/email configured correctly
- Browser console for error messages

**Admin dashboard not loading?**
- Refresh the page
- Clear browser cache
- Check if backend is running

---

## 📞 Support

For questions or issues:
1. Check the specific component file
2. Review API endpoints in backend
3. Check browser console for errors
4. Verify all services are running

---

## 📦 Project Structure

```
salon project/
├── public/
│   ├── images/          (Gallery images)
│   └── uploads/         (Logo & assets)
├── server/
│   ├── data/
│   │   └── content.json (All data)
│   ├── index.js         (Express server)
│   └── package.json
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── Navbar.tsx
│   │   ├── Gallery.tsx  (NEW)
│   │   ├── Booking.tsx  (NEW)
│   │   ├── AdminDashboard.tsx (NEW)
│   │   └── ...others
│   ├── pages/
│   │   └── Admin.tsx    (NEW)
│   └── main.tsx
├── package.json
└── README.md (this file)
```

---

Happy Salon Building! 💄✨

Last Updated: July 20, 2026
