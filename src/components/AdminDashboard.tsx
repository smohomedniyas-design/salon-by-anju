import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  LogOut,
  Package,
  Image as ImageIcon,
  Calendar,
  Layout,
  Upload,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: {
    weekday: string;
    weekend: string;
  };
}

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time?: string;
  status: string;
  createdAt: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: string;
}

interface ServiceCategory {
  id: number;
  category: string;
  items: ServiceItem[];
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('business');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'Bridal',
    image: '',
  });
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [uploadError, setUploadError] = useState('');
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'business') {
        const res = await fetch(`${API_URL}/business`);
        const data = await res.json();
        setBusinessInfo(data);
      } else if (activeTab === 'bookings') {
        const res = await fetch(`${API_URL}/bookings`);
        const data = await res.json();
        setBookings(data);
      } else if (activeTab === 'services') {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        setServices(data || []);
      } else if (activeTab === 'assets') {
        const res = await fetch(`${API_URL}/asset-urls`);
        const data = await res.json();
        setAssetUrls(data || {});
      }
        const [galleryRes, imageRes] = await Promise.all([
          fetch(`${API_URL}/gallery`),
          fetch(`${API_URL}/images`),
        ]);
        const galleryData = await galleryRes.json();
        const imageData = await imageRes.json();
        setGalleryItems(galleryData || []);
        setImageFiles(imageData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
        setMessage('');
      } else {
        setMessage(data.error || 'Invalid password');
      }
    } catch (error) {
      setMessage('Network error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/forgot-password`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Recovery file generated on the server!');
      } else {
        setMessage('❌ Failed to generate recovery file');
      }
    } catch (error) {
      setMessage('Network error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMessage('Please fill in both fields');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMessage('✅ Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordMessage(''), 3000);
      } else {
        setPasswordMessage(`❌ ${data.error || 'Failed to change password'}`);
      }
    } catch (error) {
      setPasswordMessage('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    if (!businessInfo) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/business`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessInfo),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Business info saved!');
        setEditingBusiness(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error saving business info');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (
    categoryId: number,
    itemId: string,
    field: keyof ServiceItem,
    value: string,
  ) => {
    setServices((current) =>
      current.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item,
          ),
        };
      }),
    );
  };

  const handleAddServiceItem = (categoryId: number) => {
    setServices((current) =>
      current.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          items: [
            ...category.items,
            { id: `item-${Date.now()}`, name: 'New service', price: '' },
          ],
        };
      }),
    );
  };

  const handleDeleteServiceItem = (categoryId: number, itemId: string) => {
    setServices((current) =>
      current.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          items: category.items.filter((item) => item.id !== itemId),
        };
      }),
    );
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setMessage('Enter a category name first');
      return;
    }
    setServices((current) => [
      ...current,
      {
        id: Date.now(),
        category: newCategoryName.trim(),
        items: [],
      },
    ]);
    setNewCategoryName('');
    setMessage('✅ New service category added');
    setTimeout(() => setMessage(''), 2500);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (!confirm('Delete this category and all its items?')) return;
    setServices((current) => current.filter((category) => category.id !== categoryId));
  };

  const handleSaveServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/services`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(services),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Service pricing saved!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error saving services');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusChange = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((current) =>
          current.map((booking) =>
            booking.id === bookingId ? { ...booking, status: data.data.status } : booking,
          ),
        );
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      setMessage('❌ Could not update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBookings((current) => current.filter((booking) => booking.id !== bookingId));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setMessage('❌ Could not delete booking');
    }
  };

  const handleGalleryChange = (
    itemId: number,
    field: keyof GalleryItem,
    value: string,
  ) => {
    setGalleryItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteGalleryItem = async (itemId: number) => {
    if (!confirm('Delete this gallery image?')) return;
    try {
      const res = await fetch(`${API_URL}/gallery/${itemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setGalleryItems((current) => current.filter((item) => item.id !== itemId));
        setMessage('✅ Gallery item deleted!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      setMessage('❌ Error deleting gallery item');
    }
  };

  const handleSaveGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryItems),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Gallery saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error saving gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndAddGallery = async (file: File) => {
    if (!newGalleryItem.title.trim()) {
      setUploadError('Please enter a title first');
      return;
    }
    setUploadError('');
    try {
      setLoading(true);
      const toDataURL = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const dataUrl = await toDataURL(file);
      
      // Upload image
      const uploadRes = await fetch(`${API_URL}/gallery/upload-base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      });
      const uploadData = await uploadRes.json();
      
      if (uploadData.success) {
        // Automatically add gallery entry
        const newItem = {
          title: newGalleryItem.title,
          category: newGalleryItem.category || 'Bridal',
          image: uploadData.fileUrl,
          id: Date.now(),
        };
        
        const res = await fetch(`${API_URL}/gallery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        const data = await res.json();
        
        if (data.success) {
          setGalleryItems((current) => [...current, data.data]);
          setNewGalleryItem({ title: '', category: 'Bridal', image: '' });
          setMessage('✅ Image uploaded and gallery updated!');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        setUploadError('Upload failed');
      }
    } catch (error) {
      console.error(error);
      setUploadError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStaticImage = async (file: File, targetFilename: string, successMessage: string) => {
    try {
      setLoading(true);
      const toDataURL = (f: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
      const dataUrl = await toDataURL(file);
      const res = await fetch(`${API_URL}/upload-static`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetFilename, data: dataUrl }),
      });
      const data = await res.json();
      if (data.success) {
        const key = targetFilename.replace(/[^a-zA-Z0-9_-]/g, '-');
        setAssetUrls((prev) => ({ ...prev, [key]: data.fileUrl }));
        setMessage(`✅ ${successMessage}`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Upload failed');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black-900 via-black-800 to-black-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-black-800 border border-gold-400/20 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <Settings className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gold-200">Admin Dashboard</h1>
            <p className="text-gold-100/50 text-sm mt-2">Salon by Anju</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gold-200 text-sm font-semibold mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            {message && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg font-semibold text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gold-400 hover:text-gold-200 text-sm font-semibold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
          <p className="text-center text-gold-100/30 text-xs mt-4">
            🔐 Secure admin area.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-900 text-white">
      <div className="bg-black-800 border-b border-gold-400/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gold-400" />
            <h1 className="text-xl font-bold text-gold-200">Salon Admin</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gold-200 border border-gold-400/20 hover:border-gold-400/50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 border-b border-gold-400/10">
          {[
            { id: 'business', label: 'Business Info', icon: Settings },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'services', label: 'Services', icon: Package },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'assets', label: 'Website Assets', icon: Layout },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-gold-100/50 hover:text-gold-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gold-400/10 border border-gold-400/30 rounded-lg text-gold-300"
          >
            {message}
          </motion.div>
        )}

        {activeTab === 'business' && businessInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {!editingBusiness ? (
              <div className="bg-black-800 border border-gold-400/10 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gold-200">Business Information</h2>
                  <button
                    onClick={() => setEditingBusiness(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity"
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gold-100/50 text-sm mb-1">Business Name</p>
                    <p className="text-gold-200 font-semibold">{businessInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gold-100/50 text-sm mb-1">Phone</p>
                    <p className="text-gold-200 font-semibold">{businessInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-gold-100/50 text-sm mb-1">Email</p>
                    <p className="text-gold-200 font-semibold">{businessInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-gold-100/50 text-sm mb-1">Address</p>
                    <p className="text-gold-200 font-semibold">{businessInfo.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black-800 border border-gold-400/20 rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold text-gold-200">Edit Business Information</h2>
                <div>
                  <label className="block text-gold-200 text-sm font-semibold mb-2">Business Name</label>
                  <input
                    type="text"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                    className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="text"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gold-200 text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gold-200 text-sm font-semibold mb-2">Address</label>
                  <input
                    type="text"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                    className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveBusiness}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingBusiness(false)}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-gold-200 border border-gold-400/30 hover:border-gold-400/50 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-black-800 border border-gold-400/20 rounded-xl p-6 space-y-4 mt-6">
              <h2 className="text-xl font-bold text-gold-200">Change Admin Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-gold-200 text-sm font-semibold mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-gold-200 text-sm font-semibold mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
                {passwordMessage && (
                  <p className={`text-sm ${passwordMessage.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save size={18} />
                  Change Password
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gold-200">Bookings ({bookings.length})</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-black-800 border border-gold-400/10 rounded-xl p-8 text-center">
                <Calendar className="w-12 h-12 text-gold-100/30 mx-auto mb-4" />
                <p className="text-gold-100/50">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-x-auto">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-black-800 border border-gold-400/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gold-200">{booking.name}</h3>
                      <p className="text-gold-100/50 text-sm">
                        {booking.service} • {booking.date}
                        {booking.time && ` at ${booking.time}`}
                      </p>
                      <p className="text-gold-100/30 text-xs mt-1">{booking.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                        className={`px-3 py-1 rounded text-sm font-semibold cursor-pointer ${
                          booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-300'
                            : booking.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-gold-400/20 text-gold-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gold-200">Manage Services & Pricing</h2>
                <p className="text-gold-100/50 mt-1">Edit service names, prices, categories, and save instantly.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveServices}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity"
                >
                  <Save size={16} />
                  Save Services
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gold-400/20 text-gold-200 hover:border-gold-400/50 transition-colors"
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid sm:grid-cols-[1fr_260px] gap-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="w-full px-4 py-3 bg-black-800 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddCategory}
                    className="w-full px-4 py-3 rounded-lg text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity"
                  >
                    Create Category
                  </button>
                </div>
              </div>

              {services.map((category) => (
                <div key={category.id} className="bg-black-800 border border-gold-400/10 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gold-200">{category.category}</h3>
                      <p className="text-gold-100/50 text-sm">Category ID: {category.id}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 border border-red-400/10 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete Category
                    </button>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="grid sm:grid-cols-[1.2fr_0.8fr_auto] gap-3 items-center">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleServiceChange(category.id, item.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                        />
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => handleServiceChange(category.id, item.id, 'price', e.target.value)}
                          className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                        />
                        <button
                          onClick={() => handleDeleteServiceItem(category.id, item.id)}
                          className="px-4 py-3 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddServiceItem(category.id)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gold-400/20 text-gold-200 hover:border-gold-400/50 transition-colors"
                  >
                    <Plus size={16} />
                    Add service item
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gold-200">Manage Gallery</h2>
                <p className="text-gold-100/50 mt-1">Filter by category, upload and edit images.</p>
              </div>
              <button
                onClick={handleSaveGallery}
                className="flex items-center gap-2 px-5 py-3 rounded-lg text-black-900 gold-gradient-bg hover:opacity-90 transition-opacity"
              >
                <Save size={16} />
                Save Gallery
              </button>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Bridal', 'Hair', 'Nails', 'Facial', 'Waxing', 'Studio'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    galleryFilter === cat
                      ? 'gold-gradient-bg text-black-900'
                      : 'border border-gold-400/30 text-gold-200 hover:border-gold-400/60'
                  }`}
                >
                  {cat} {cat !== 'All' && `(${galleryItems.filter(i => i.category === cat).length})`}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              <div className="bg-black-800 border border-gold-400/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-gold-200">Add New Gallery Image</h3>
                <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <div>
                    <label className="block text-gold-100/50 text-xs mb-1">Title *</label>
                    <input
                      type="text"
                      value={newGalleryItem.title}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                      placeholder="e.g. Bridal Makeup"
                      className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gold-100/50 text-xs mb-1">Category</label>
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                      className="w-full px-4 py-3 bg-black-700 border border-gold-400/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Bridal">Bridal</option>
                      <option value="Hair">Hair</option>
                      <option value="Nails">Nails</option>
                      <option value="Facial">Facial</option>
                      <option value="Waxing">Waxing</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gold-400 text-black-900 font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                    <Upload size={18} />
                    Upload & Add
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAndAddGallery(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.filter(item => galleryFilter === 'All' || item.category === galleryFilter).map((item) => (
                  <div key={item.id} className="bg-black-800 border border-gold-400/10 rounded-2xl overflow-hidden flex flex-col">
                    <div className="h-48 bg-black-900 relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black-900/80 rounded text-xs text-gold-100/50 truncate max-w-[150px]">
                        {item.image.split('/').pop()}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <label className="block text-gold-100/50 text-xs mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleGalleryChange(item.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gold-100/50 text-xs mb-1">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleGalleryChange(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-black-700 border border-gold-400/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400"
                        >
                          <option value="Bridal">Bridal</option>
                          <option value="Hair">Hair</option>
                          <option value="Nails">Nails</option>
                          <option value="Facial">Facial</option>
                          <option value="Waxing">Waxing</option>
                          <option value="Studio">Studio</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'assets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Main Website Images */}
            <div>
              <h2 className="text-xl font-bold text-gold-200 mb-1">Main Website Images</h2>
              <p className="text-gold-100/50 text-sm mb-6">Upload to replace hero, about, and logo images. Changes go live immediately.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Hero Background', key: 'hero-bg', fallback: 'https://res.cloudinary.com/pvr1nexp/image/upload/v1784575945/salon-assets/hero-bg.jpg', desc: 'Main background on home page.' },
                  { label: 'About Section', key: 'about-image', fallback: 'https://res.cloudinary.com/pvr1nexp/image/upload/salon-assets/about-image.jpg', desc: 'Image in the About Us section.' },
                  { label: 'Contact Section', key: 'contact-image', fallback: 'https://res.cloudinary.com/pvr1nexp/image/upload/salon-assets/contact-image.jpg', desc: 'Image in the Contact section.' },
                ].map((asset) => (
                  <div key={asset.key} className="bg-black-800 border border-gold-400/10 rounded-2xl p-5 flex flex-col">
                    <h3 className="text-base font-semibold text-gold-200 mb-1">{asset.label}</h3>
                    <p className="text-gold-100/50 text-xs mb-3">{asset.desc}</p>
                    <div className="h-40 bg-black-900 rounded-xl mb-4 overflow-hidden border border-gold-400/20">
                      <img
                        src={assetUrls[asset.key] || asset.fallback}
                        className="w-full h-full object-cover"
                        alt={asset.label}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <label className="cursor-pointer mt-auto flex items-center justify-center gap-2 w-full py-3 bg-black-700 border border-gold-400/30 text-gold-200 font-semibold rounded-lg hover:border-gold-400 transition-colors">
                      <Upload size={18} />
                      Replace Image
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadStaticImage(f, asset.key, `${asset.label} updated!`); }} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Section Images */}
            <div>
              <h2 className="text-xl font-bold text-gold-200 mb-1">Service Section Images</h2>
              <p className="text-gold-100/50 text-sm mb-6">Replace images shown on each service card.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Face Treatments', key: 'service-face-treatments', fallback: '/images/facial.jpg' },
                  { label: 'Hair Services', key: 'service-hair-services', fallback: '/images/hair-color.jpg' },
                  { label: 'Hand & Foot Care', key: 'service-hand-foot-care', fallback: '/images/nails.jpg' },
                  { label: 'Waxing Services', key: 'service-waxing-services', fallback: '/images/salon-interior.jpg' },
                  { label: 'Botox Treatment', key: 'service-botox-treatment', fallback: '/images/hair-color.jpg' },
                  { label: 'Keratin Treatment', key: 'service-keratin-treatment', fallback: '/images/hair-color.jpg' },
                  { label: 'Bridal Packages', key: 'service-bridal-packages', fallback: '/images/bridal.jpg' },
                ].map((svc) => (
                  <div key={svc.key} className="bg-black-800 border border-gold-400/10 rounded-2xl p-5 flex flex-col">
                    <h3 className="text-base font-semibold text-gold-200 mb-3">{svc.label}</h3>
                    <div className="h-36 bg-black-900 rounded-xl mb-4 overflow-hidden border border-gold-400/20">
                      <img src={assetUrls[svc.key] || svc.fallback} className="w-full h-full object-cover" alt={svc.label} />
                    </div>
                    <label className="cursor-pointer mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-black-700 border border-gold-400/30 text-gold-200 text-sm font-semibold rounded-lg hover:border-gold-400 transition-colors">
                      <Upload size={16} />
                      Replace Image
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadStaticImage(f, svc.key, `${svc.label} image updated!`); }} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
