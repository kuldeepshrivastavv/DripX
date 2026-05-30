import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  CheckCircle, 
  PackageOpen, 
  Calendar, 
  MapPin, 
  Star, 
  DollarSign, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  ChevronRight, 
  Trash2, 
  AlertCircle, 
  FileText, 
  Ban,
  Wallet,
  CalendarDays,
  Lock,
  Unlock,
  CheckCircle2,
  Trash
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, outfits, addOutfit, registerShop, updateBookingStatus, uploadOutfitImage, bookings, shops } = useApp();
  const navigate = useNavigate();

  // Redirect renters to home page, since they shouldn't see partner sections
  useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (user.role !== 'Shopkeeper') {
      navigate('/home');
    }
  }, [user, navigate]);

  // Sidebar Section toggle
  const [activeSection, setActiveSection] = useState('dashboard'); 

  // Shop boutique resolving
  const shopkeeperShop = shops.find(s => s.ownerId === user?.uid);
  const myShopName = shopkeeperShop ? shopkeeperShop.name : (user ? `${user.name}'s Boutique` : "The Thread & Tux");

  // Form input states for Add Listing
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDeposit, setNewDeposit] = useState('1000');
  const [newSize, setNewSize] = useState('M');
  const [newOccasion, setNewOccasion] = useState('Lehenga');
  const [newGender, setNewGender] = useState('Women');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAvailable, setNewAvailable] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");
  const [profileAddress, setProfileAddress] = useState('');
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);

  useEffect(() => {
    if (shopkeeperShop) {
      setProfileName(shopkeeperShop.name);
      setProfileAddress(shopkeeperShop.address);
    } else {
      setProfileName(user ? `${user.name}'s Boutique` : "The Thread & Tux");
      setProfileAddress("411 Platinum Plaza, Central Avenue");
    }
  }, [shopkeeperShop, user]);

  // Settings / Bank details states
  const [upiId, setUpiId] = useState("thethreadtux@upi");
  const [bankName, setBankName] = useState("HDFC Bank Ltd");
  const [accNumber, setAccNumber] = useState("50100492109482");
  const [ifscCode, setIfscCode] = useState("HDFC0000123");
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);
  // Onboarding Setup states for first-time Shopkeepers
  const [setupShopName, setSetupShopName] = useState(user ? `${user.name}'s Boutique` : '');
  const [setupDescription, setSetupDescription] = useState('High-end premium ethnic wear & tailored collections.');
  const [setupAddress, setSetupAddress] = useState('Central Plaza, Outer Ring Road, New Delhi');
  const [setupCoords, setSetupCoords] = useState({ x: 50, y: 50 });
  const [setupProgress, setSetupProgress] = useState(false);
  // Synchronize outfits list locally for interactive deletes and status updates
  const [myListings, setMyListings] = useState([]);
  useEffect(() => {
    if (outfits) {
      setMyListings(outfits.filter(o => o.shop === myShopName || o.shopId === shopkeeperShop?.id));
    }
  }, [outfits, myShopName, shopkeeperShop?.id]);

  // Handle local deletion of listing
  const handleDeleteListing = (id) => {
    setMyListings(prev => prev.filter(item => item.id !== id));
  };

  // Handle listing status toggling
  const handleToggleStatus = (id, newStatus) => {
    setMyListings(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Mock Rental Requests State
  const [rentalRequests, setRentalRequests] = useState([]);

  useEffect(() => {
    if (bookings) {
      const filtered = bookings.filter(b => 
        myListings.some(item => String(item.id) === String(b.outfitId)) ||
        (b.shop && String(b.shop).trim().toLowerCase() === String(myShopName).trim().toLowerCase())
      );
      
      const mapped = filtered.map(b => ({
        id: b.id || `DX-${Math.floor(1000 + Math.random() * 9000)}`,
        date: b.bookingDate || "2026-05-30",
        status: b.status || "Pending",
        outfitName: b.outfitTitle || "Garment",
        renterName: "Renter Customer",
        renterEmail: "customer@dripx.com",
        duration: b.type === "Delivery" ? "Delivery Order" : "Self Pickup",
        priceBreakdown: {
          rent: Number(b.price || 0),
          deposit: 1000
        }
      }));
      setRentalRequests(mapped);
    } else {
      setRentalRequests([]);
    }
  }, [bookings, myListings, myShopName]);

  const handleAcceptRequest = async (id) => {
    setRentalRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Accepted" } : req));
    addNotification(`Rental request ${id} has been accepted.`);
    try {
      await updateBookingStatus(id, "Accepted");
    } catch (err) {
      console.error("Error accepting request: ", err);
    }
  };

  const handleRejectRequest = async (id) => {
    setRentalRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Rejected" } : req));
    addNotification(`Rental request ${id} has been rejected.`);
    try {
      await updateBookingStatus(id, "Rejected");
    } catch (err) {
      console.error("Error rejecting request: ", err);
    }
  };

  // Mock Calendar Blocked dates (June 2026)
  // Day numbers that are blocked
  const [blockedDates, setBlockedDates] = useState([]);
  const toggleDateBlock = (day) => {
    if (blockedDates.includes(day)) {
      setBlockedDates(prev => prev.filter(d => d !== day));
    } else {
      setBlockedDates(prev => [...prev, day]);
    }
  };

  // Mock Reviews
  const [reviewsList] = useState([]);

  // Mock Notifications
  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg) => {
    setNotifications(prev => [
      { id: Date.now(), message: msg, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Image presets for the listing form
  const imagePresets = [
    { name: "Techwear Jacket", url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800" },
    { name: "Sherwani Set", url: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800" },
    { name: "Heavy Lehenga", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" },
    { name: "Italian Tuxedo", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800" }
  ];

  // Submit new outfit listing
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (imageUploading) {
      alert("Please wait until the image finishes uploading!");
      return;
    }
    const outfitImg = newImage || imagePresets[0].url;
    
    const newOutfitPayload = {
      title: newTitle,
      price: Number(newPrice),
      size: newSize,
      occasion: newOccasion,
      gender: newGender,
      shopId: shopkeeperShop ? shopkeeperShop.id : 'shop_103',
      shop: myShopName,
      image: outfitImg,
      description: newDesc || "Exquisite garment curated under our boutique label.",
      specs: ["High Quality Handloom Craft", `Security Deposit: ₹${newDeposit}`],
      status: newAvailable ? "Available" : "Maintenance"
    };

    // Add to context
    addOutfit(newOutfitPayload);

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDeposit('1000');
    setNewSize('M');
    setNewDesc('');
    setNewImage('');
    setNewAvailable(true);

    setShowSuccessAlert(true);
    addNotification(`New listing '${newTitle || "Outfit"}' published to boutique closet.`);
    
    setTimeout(() => {
      setShowSuccessAlert(false);
      setActiveSection('listings');
    }, 2000);
  };

  // Upload image to Firebase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const downloadURL = await uploadOutfitImage(file);
      setNewImage(downloadURL);
      addNotification("Garment image uploaded successfully to Cloud Storage!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload garment photo. Make sure Firebase Storage is enabled in Console.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleOnboardShopSubmit = async (e) => {
    e.preventDefault();
    if (!setupShopName.trim() || !setupAddress.trim() || !setupDescription.trim()) {
      alert("Please fill out all boutique details!");
      return;
    }
    setSetupProgress(true);
    try {
      await registerShop({
        name: setupShopName,
        description: setupDescription,
        address: setupAddress,
        coords: setupCoords
      });
    } catch (err) {
      console.error(err);
      alert("Failed to register shop.");
    } finally {
      setSetupProgress(false);
    }
  };

  if (!user || user.role !== 'Shopkeeper') {
    return null; // Don't render anything while redirecting
  }

  // Derived KPI Stats
  const baseEarnings = 0;
  const acceptedRequestsRent = rentalRequests
    .filter(r => r.status === 'Accepted' || r.status === 'Confirmed')
    .reduce((sum, r) => sum + r.priceBreakdown.rent, 0);
  const totalEarnings = baseEarnings + acceptedRequestsRent;

  const pendingRequestsCount = rentalRequests.filter(r => r.status === 'Pending').length;
  const completedOrdersCount = rentalRequests.filter(r => r.status === 'Accepted' || r.status === 'Confirmed').length;
  const activeRentalsCount = myListings.filter(item => item.status === 'Rented').length + rentalRequests.filter(r => r.status === 'Accepted' || r.status === 'Confirmed').length;

  // Group real earnings by month (Jan - Jun)
  const monthlyEarnings = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0
  };

  rentalRequests.forEach(r => {
    if (r.status === 'Accepted' || r.status === 'Confirmed') {
      const dateStr = r.date; // e.g. "2026-06-02"
      if (dateStr) {
        const monthNum = parseInt(dateStr.split('-')[1]);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (monthNum >= 1 && monthNum <= 6) {
          const mName = months[monthNum - 1];
          monthlyEarnings[mName] += r.priceBreakdown.rent;
        }
      }
    }
  });

  const activeMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const maxMonthVal = Math.max(...activeMonths.map(m => monthlyEarnings[m]), 0);
  
  // Map monthly earnings to Y coordinate (Baseline: 170, Peak: 50)
  const getY = (val) => {
    if (maxMonthVal === 0) return 170;
    return 170 - (val / maxMonthVal) * 120;
  };

  const yJan = getY(monthlyEarnings.Jan);
  const yFeb = getY(monthlyEarnings.Feb);
  const yMar = getY(monthlyEarnings.Mar);
  const yApr = getY(monthlyEarnings.Apr);
  const yMay = getY(monthlyEarnings.May);
  const yJun = getY(monthlyEarnings.Jun);

  const getTopPct = (yVal) => `${(yVal / 200) * 100}%`;

  if (!shopkeeperShop) {
    return (
      <div className="min-h-screen bg-black text-white py-8 px-6 max-w-4xl mx-auto w-full flex flex-col justify-center text-left">
        
        {/* Onboarding Header */}
        <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-3">
          <span>DripX &gt; Partner Portal &gt; Store Onboarding</span>
          <span className="flex items-center gap-1.5 text-neonGreen font-bold bg-neonGreen/10 border border-neonGreen/20 px-2 py-0.5 rounded uppercase">
            Setup Required
          </span>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden glass-panel">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neonGreen/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="border-b border-neutral-900 pb-5">
            <span className="text-neonGreen text-xs font-extrabold uppercase tracking-widest block mb-1">
              Store Registration Portal
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight m-0">
              Onboard Your Boutique Storefront
            </h1>
            <p className="text-neutral-500 text-xs mt-2 font-semibold">
              Before publishing your wardrobe listings, register your shop details and locate your boutique on our radar map so customers can discover you hyperlocally.
            </p>
          </div>

          <form onSubmit={handleOnboardShopSubmit} className="flex flex-col gap-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-5">
                
                {/* Shop Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Boutique / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Closet, Elite Drips"
                    value={setupShopName}
                    onChange={(e) => setSetupShopName(e.target.value)}
                    className="neon-input text-xs font-bold"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Boutique Description *
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder="e.g. Premium bridal collection, sherwanis, designer lehengas..."
                    value={setupDescription}
                    onChange={(e) => setSetupDescription(e.target.value)}
                    className="neon-input text-xs resize-none font-bold"
                  />
                </div>

                {/* Physical Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Full Pickup Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop 24, Platinum Market, MG Road, New Delhi"
                    value={setupAddress}
                    onChange={(e) => setSetupAddress(e.target.value)}
                    className="neon-input text-xs font-bold"
                  />
                </div>

              </div>

              {/* Dynamic Coordinate Location Picker Mock Map */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex justify-between">
                  <span>Pin Location on Radar Map *</span>
                  <span className="text-neonGreen font-extrabold">Coordinates: {setupCoords.x}X, {setupCoords.y}Y</span>
                </label>

                <div 
                  className="relative w-full h-[260px] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between cursor-crosshair group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    setSetupCoords({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
                  }}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-grid-glow pointer-events-none opacity-30" />
                  
                  {/* Streets */}
                  <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 80 Q 150 120 300 80 T 600 150" fill="none" stroke="#6366f1" strokeWidth="2" />
                    <path d="M 120 0 L 120 400" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                    <path d="M 0 200 L 600 180" fill="none" stroke="#6366f1" strokeWidth="2" />
                  </svg>

                  <div className="absolute top-3 left-3 z-10 glass-panel border border-neutral-800 rounded-lg px-2 py-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-ping" />
                    <span className="text-[8px] uppercase font-bold tracking-wider text-neutral-300">
                      MAP PIN SELECTION
                    </span>
                  </div>

                  {/* Active Pin marker */}
                  <div 
                    style={{ left: `${setupCoords.x}%`, top: `${setupCoords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className="relative flex items-center justify-center p-2 rounded-full bg-neonGreen text-black border border-neonGreen scale-110 shadow-[0_0_15px_#39ff14] animate-bounce">
                      <MapPin className="w-3.5 h-3.5 fill-current stroke-2" />
                    </div>
                  </div>

                  <div className="mt-auto w-full p-3 z-10 bg-gradient-to-t from-black via-black/85 to-transparent text-[8px] text-neutral-400 font-extrabold uppercase tracking-widest text-center pointer-events-none">
                    ✓ Tap anywhere on radar grid to pin boutique coordinates
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={setupProgress}
              className="w-full bg-neonGreen text-black font-extrabold text-xs py-4 rounded-xl uppercase tracking-widest cursor-pointer shadow-lg hover:shadow-neonGreen/20 transition-all mt-4 flex items-center justify-center gap-2"
            >
              {setupProgress ? '⚡ REGISTERING STOREFRONT...' : 'REGISTER & OPEN MY BOUTIQUE STOREFRONT ⚡'}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full bg-neutral-900 hover:bg-neutral-850 text-neutral-500 font-extrabold text-[10px] uppercase py-3 rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-850"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cancel & Log Out
            </button>

          </form>

        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Add Item', icon: PlusCircle },
    { id: 'listings', label: 'My Listings', icon: ShoppingBag, badge: myListings.length },
    { id: 'requests', label: 'Rental Requests', icon: PackageOpen, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'bookings', label: 'Booking Calendar', icon: CalendarDays },
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || null },
    { id: 'settings', label: 'Settings & UPI', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-8 px-6 max-w-7xl mx-auto w-full flex flex-col">
      
      {/* 1. Header & Quick Breadcrumbs */}
      <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-3 text-left">
        <span>DripX &gt; Partner Portal &gt; {sidebarItems.find(item => item.id === activeSection)?.label}</span>
        <span className="flex items-center gap-1.5 text-neonGreen font-bold bg-neonGreen/10 border border-neonGreen/20 px-2 py-0.5 rounded uppercase">
          Merchant Verified
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-neutral-900 pb-6 text-left">
        <div>
          <span className="text-neonGreen text-xs font-extrabold uppercase tracking-widest block mb-1">
            Boutique Controller Deck
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase m-0 flex items-center gap-2">
            {profileName}
          </h1>
          <p className="text-neutral-500 text-xs mt-1.5 font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-600" />
            {profileAddress}
          </p>
        </div>
      </div>

      {/* 2. Main Dashboard Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow text-left">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 bg-neutral-950/80 border border-neutral-900 rounded-3xl p-4 flex flex-col gap-1 w-full relative z-10 glass-panel">
          <div className="px-3.5 py-2.5 mb-2 border-b border-neutral-900 text-neutral-500 text-[10px] uppercase font-black tracking-wider">
            Menu Navigation
          </div>
          
          {/* Scrollable Tab bar on Mobile, vertical on Desktop */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-1 scrollbar-none pb-2 lg:pb-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive 
                      ? 'bg-neonGreen text-black font-extrabold shadow-[0_0_15px_rgba(57,255,20,0.15)]'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-black text-neonGreen' : 'bg-neonGreen/10 border border-neonGreen/20 text-neonGreen'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-900 hidden lg:block">
            <button
              onClick={logout}
              className="w-full bg-neutral-900 hover:bg-neutral-850 text-red-400 font-extrabold text-[10px] uppercase py-3 rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-850"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out Hub
            </button>
          </div>
        </aside>

        {/* DETAILS PANEL */}
        <main className="lg:col-span-9 bg-neutral-950/20 rounded-3xl min-h-[500px]">
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeSection === 'dashboard' && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-300">
              
              {/* KPI Badges Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-neutral-800 transition-all">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Total Earnings</span>
                  <span className="block text-2xl font-black text-white mt-1.5">₹{totalEarnings.toLocaleString()}</span>
                  <span className="text-[9px] text-neonGreen font-bold mt-1 block">⚡ +12% this month</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-neutral-800 transition-all">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Active Rentals</span>
                  <span className="block text-2xl font-black text-white mt-1.5">{activeRentalsCount} items</span>
                  <span className="text-[9px] text-neutral-400 font-bold mt-1 block">Live out with customers</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-neutral-800 transition-all">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Pending Requests</span>
                  <span className={`block text-2xl font-black mt-1.5 ${pendingRequestsCount > 0 ? 'text-neonGreen animate-pulse' : 'text-white'}`}>
                    {pendingRequestsCount} orders
                  </span>
                  <span className="text-[9px] text-neutral-400 font-bold mt-1 block">Awaiting confirmation</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-neutral-800 transition-all">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Completed Orders</span>
                  <span className="block text-2xl font-black text-white mt-1.5">{completedOrdersCount} leases</span>
                  <span className="text-[9px] text-neutral-400 font-bold mt-1 block">Successful returns</span>
                </div>
              </div>

              {/* Monthly Income graph (simple SVG chart) */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 shadow-xl relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-white font-extrabold text-sm uppercase tracking-wide">Monthly Revenue Flow</h3>
                    <p className="text-neutral-500 text-[10px] uppercase font-bold mt-0.5">Year to date simulation (2026)</p>
                  </div>
                  <span className="text-[10px] text-neonGreen font-black border border-neonGreen/20 bg-neonGreen/5 px-2.5 py-1 rounded-xl">
                    High Yield Closet
                  </span>
                </div>
                
                {/* SVG Graph representation */}
                <div className="w-full h-56 relative mt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39ff14" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#39ff14" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="4,4" />
                    
                    {/* Income Path */}
                    <path
                      d={`M 50 ${yJan} L 150 ${yFeb} L 250 ${yMar} L 350 ${yApr} L 450 ${yMay} L 550 ${yJun}`}
                      fill="none"
                      stroke="#39ff14"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Area fill */}
                    <path
                      d={`M 50 ${yJan} L 150 ${yFeb} L 250 ${yMar} L 350 ${yApr} L 450 ${yMay} L 550 ${yJun} L 550 200 L 50 200 Z`}
                      fill="url(#neonGradient)"
                    />
                    
                    {/* Circles on Nodes */}
                    <circle cx="50" cy={yJan} r="4.5" fill="#000" stroke="#39ff14" strokeWidth="2.5" />
                    <circle cx="150" cy={yFeb} r="4.5" fill="#000" stroke="#39ff14" strokeWidth="2.5" />
                    <circle cx="250" cy={yMar} r="4.5" fill="#000" stroke="#39ff14" strokeWidth="2.5" />
                    <circle cx="350" cy={yApr} r="4.5" fill="#000" stroke="#39ff14" strokeWidth="2.5" />
                    <circle cx="450" cy={yMay} r="4.5" fill="#000" stroke="#39ff14" strokeWidth="2.5" />
                    <circle cx="550" cy={yJun} r="4.5" fill="#000" stroke="#39ff14" strokeWidth="2.5" />
                  </svg>
                  
                  {/* Tooltip indicators */}
                  <div style={{ top: getTopPct(yJan - 25), left: '5%' }} className="absolute transform -translate-y-1/2 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[8px] font-black uppercase text-neutral-400 animate-fade-in">
                    Jan: ₹{monthlyEarnings.Jan >= 1000 ? `${(monthlyEarnings.Jan/1000).toFixed(1)}k` : monthlyEarnings.Jan}
                  </div>
                  <div style={{ top: getTopPct(yFeb - 25), left: '22%' }} className="absolute transform -translate-y-1/2 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[8px] font-black uppercase text-neutral-400 animate-fade-in">
                    Feb: ₹{monthlyEarnings.Feb >= 1000 ? `${(monthlyEarnings.Feb/1000).toFixed(1)}k` : monthlyEarnings.Feb}
                  </div>
                  <div style={{ top: getTopPct(yMar - 25), left: '39%' }} className="absolute transform -translate-y-1/2 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[8px] font-black uppercase text-neutral-400 animate-fade-in">
                    Mar: ₹{monthlyEarnings.Mar >= 1000 ? `${(monthlyEarnings.Mar/1000).toFixed(1)}k` : monthlyEarnings.Mar}
                  </div>
                  <div style={{ top: getTopPct(yApr - 25), left: '55%' }} className="absolute transform -translate-y-1/2 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[8px] font-black uppercase text-neutral-400 animate-fade-in">
                    Apr: ₹{monthlyEarnings.Apr >= 1000 ? `${(monthlyEarnings.Apr/1000).toFixed(1)}k` : monthlyEarnings.Apr}
                  </div>
                  <div style={{ top: getTopPct(yMay - 25), left: '72%' }} className="absolute transform -translate-y-1/2 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[8px] font-black uppercase text-neutral-400 animate-fade-in">
                    May: ₹{monthlyEarnings.May >= 1000 ? `${(monthlyEarnings.May/1000).toFixed(1)}k` : monthlyEarnings.May}
                  </div>
                  <div style={{ top: getTopPct(yJun - 25), left: '89%' }} className="absolute transform -translate-y-1/2 bg-neutral-950 border border-neonGreen px-2 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-lg animate-fade-in">
                    June: ₹{monthlyEarnings.Jun >= 1000 ? `${(monthlyEarnings.Jun/1000).toFixed(1)}k` : monthlyEarnings.Jun}
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-white font-extrabold text-sm uppercase tracking-wide">Manage Active Closets</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed font-semibold">Ready to upload new fashion statements or review incoming requests?</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSection('add')}
                    className="bg-neonGreen text-black font-extrabold text-[10px] uppercase py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-neonGreen/20"
                  >
                    Add Outfit Listing
                  </button>
                  <button
                    onClick={() => setActiveSection('requests')}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-extrabold text-[10px] uppercase py-3 px-5 rounded-xl transition-all cursor-pointer"
                  >
                    View Requests ({pendingRequestsCount})
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ADD ITEM / LISTING */}
          {activeSection === 'add' && (
            <div className="animate-in fade-in duration-300">
              {showSuccessAlert && (
                <div className="mb-4 bg-neonGreen/10 border border-neonGreen/30 p-4 rounded-xl flex items-center gap-3 text-neonGreen font-bold text-xs">
                  <CheckCircle2 className="w-5 h-5 text-neonGreen fill-black" />
                  <div>
                    <span className="uppercase block font-extrabold">Listing published successfully!</span>
                    <span className="text-neutral-400 font-medium">Syncing database caches and redirecting...</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleAddProductSubmit} className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wide mb-1 flex items-center gap-2 border-b border-neutral-900 pb-3">
                  <PlusCircle className="w-4 h-4 text-neonGreen" />
                  List New Wardrobe Outfit
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Item Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Embroidered Sherwani, Modular Techwear Set"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Rent Price (per day) *
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      placeholder="₹ Fee"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Security Deposit (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="₹ Refundable Deposit"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Target Section / Gender *
                    </label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value)}
                      className="neon-input text-xs cursor-pointer bg-neutral-950 text-white font-bold"
                    >
                      <option value="Men">Men's Wear</option>
                      <option value="Women">Women's Wear</option>
                      <option value="Unisex">Unisex Wear</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Fashion Category *
                    </label>
                    <select
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value)}
                      className="neon-input text-xs cursor-pointer bg-neutral-950 text-white font-bold"
                    >
                      <optgroup label="Occasions" className="bg-neutral-900 text-neutral-400 font-bold uppercase text-[9px]">
                        <option value="Party">Party Streetwear</option>
                        <option value="Wedding">Wedding Traditional</option>
                        <option value="Formal">Formal Tux & Corporate</option>
                      </optgroup>
                      <optgroup label="Garments (Women)" className="bg-neutral-900 text-neutral-400 font-bold uppercase text-[9px]">
                        <option value="Lehenga">Lehenga</option>
                        <option value="Saree">Saree</option>
                        <option value="Gown">Gown</option>
                        <option value="Dress">Dress</option>
                        <option value="Suit">Anarkali & Suit</option>
                        <option value="Sharara">Sharara</option>
                      </optgroup>
                      <optgroup label="Jewelry" className="bg-neutral-900 text-neutral-400 font-bold uppercase text-[9px]">
                        <option value="Jewelry">Jewelry Set</option>
                        <option value="Bridal">Bridal Set</option>
                        <option value="Necklace">Necklace</option>
                        <option value="Earring">Earring</option>
                        <option value="Bangle">Bangles & Bracelet</option>
                        <option value="Mathapati">Mathapatti & Maangtika</option>
                        <option value="Ring">Rings & Haathphool</option>
                        <option value="Nose">Nose & Waist Accessory</option>
                      </optgroup>
                      <optgroup label="Accessories" className="bg-neutral-900 text-neutral-400 font-bold uppercase text-[9px]">
                        <option value="Bag">Clutches & Bag</option>
                        <option value="Shoes">Footwear & Shoes</option>
                        <option value="Belt">Belt & Wallet</option>
                        <option value="Stole">Stole & Scarf</option>
                        <option value="Turban">Turban & Sehra</option>
                        <option value="Cufflink">Cufflinks & Pocket Square</option>
                        <option value="Watch">Watch</option>
                        <option value="Glasses">Sunglasses</option>
                      </optgroup>
                      <optgroup label="Menswear" className="bg-neutral-900 text-neutral-400 font-bold uppercase text-[9px]">
                        <option value="Kurta">Kurta Set</option>
                        <option value="Bandh">Bandh Gala</option>
                        <option value="Sherwani">Sherwani</option>
                        <option value="Jodhpuri">Jodhpuri</option>
                        <option value="Tuxedo">Tuxedo</option>
                        <option value="Suit">Suit</option>
                        <option value="Blazer">Blazer</option>
                        <option value="Western">Indo Western</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Sizing Profile *
                    </label>
                    <select
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="neon-input text-xs cursor-pointer bg-neutral-950 text-white font-bold"
                    >
                      <option value="S">SIZE S (Slim fitting)</option>
                      <option value="M">SIZE M (Medium fitting)</option>
                      <option value="L">SIZE L (Large fitting)</option>
                      <option value="XL">SIZE XL (Extra Large fitting)</option>
                    </select>
                  </div>
                </div>

                {/* Photo presets / custom URL */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Photos Upload (Presets or Custom Unsplash URL)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {imagePresets.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewImage(preset.url)}
                        className={`p-2 rounded-xl border text-[9px] uppercase font-bold tracking-wider flex items-center justify-center text-center transition-all cursor-pointer ${
                          newImage === preset.url
                            ? 'border-neonGreen bg-neonGreen/10 text-white'
                            : 'border-neutral-850 bg-neutral-900/30 text-neutral-500 hover:border-neutral-700'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>

                  {/* Real Image File Upload */}
                  <div className="mt-2 p-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/10 flex flex-col items-center justify-center gap-2">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      {imageUploading ? '⚡ UPLOADING PHOTO TO CLOUD...' : '📸 UPLOAD OUTLINE GARMENT PHOTO'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="hidden"
                      id="outfit-file-upload"
                    />
                    <label
                      htmlFor="outfit-file-upload"
                      className={`cursor-pointer px-4 py-2 rounded-xl text-[9px] uppercase tracking-wider font-extrabold transition-all ${
                        imageUploading
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                    >
                      {imageUploading ? 'Uploading...' : 'Choose Local File'}
                    </label>

                    {newImage && !newImage.startsWith('https://images.unsplash.com') && (
                      <span className="text-[8px] text-emerald-400 font-extrabold uppercase tracking-widest mt-1">
                        ✓ Cloud Image Loaded Successfully
                      </span>
                    )}
                  </div>

                  <input
                    type="url"
                    placeholder="Or paste custom image link here..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="neon-input text-xs mt-1"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Product Description Details
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Describe specific details, fabrics, or care directions..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="neon-input text-xs resize-none"
                  />
                </div>

                {/* Availability calendar / Toggle */}
                <div className="flex items-center gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-900">
                  <input
                    type="checkbox"
                    id="markAvailable"
                    checked={newAvailable}
                    onChange={(e) => setNewAvailable(e.target.checked)}
                    className="w-4 h-4 accent-neonGreen cursor-pointer"
                  />
                  <label htmlFor="markAvailable" className="text-xs uppercase font-extrabold tracking-wider text-neutral-300 cursor-pointer">
                    Mark as immediately active & available for rent
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neonGreen text-black font-extrabold text-xs py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest cursor-pointer mt-2"
                >
                  Publish Listing to Closet storefront ⚡
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MY LISTINGS */}
          {activeSection === 'listings' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wide">Listed Wardrobe Directory</h3>
                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-wider">({myListings.length} total items)</span>
              </div>

              {myListings.length === 0 ? (
                <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-12 text-center text-neutral-500">
                  No outfits found in your closet. Click "Add Item" to post your first listing!
                </div>
              ) : (
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-900/60 text-neutral-400 font-extrabold uppercase border-b border-neutral-900">
                          <th className="px-5 py-4">Outfit Item</th>
                          <th className="px-5 py-4 text-center">Size</th>
                          <th className="px-5 py-4">Price / Deposit</th>
                          <th className="px-5 py-4">Category</th>
                          <th className="px-5 py-4">Status & Action</th>
                          <th className="px-5 py-4 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 font-semibold text-neutral-300">
                        {myListings.map((item) => (
                          <tr key={item.id} className="hover:bg-neutral-900/20 transition-colors">
                            
                            {/* Title & image */}
                            <td className="px-5 py-3.5 flex items-center gap-3">
                              <div className="w-9 h-11 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="text-white font-bold block uppercase line-clamp-1 max-w-[180px]">
                                  {item.title}
                                </span>
                                <span className="text-[9px] text-neutral-500 block uppercase font-bold">
                                  ID: #{item.id} • {item.gender}
                                </span>
                              </div>
                            </td>

                            {/* Size */}
                            <td className="px-5 py-3.5 text-center font-extrabold text-white text-[11px]">
                              {item.size}
                            </td>

                            {/* Price / Deposit */}
                            <td className="px-5 py-3.5">
                              <span className="text-white font-extrabold block">₹{item.price}<span className="text-neutral-500 font-normal">/day</span></span>
                              <span className="text-[9px] text-neutral-500 block">Dep: ₹1,000</span>
                            </td>

                            {/* Category */}
                            <td className="px-5 py-3.5 text-neutral-400 text-[10px] uppercase font-bold">
                              {item.occasion}
                            </td>

                            {/* Status dropdown & toggling */}
                            <td className="px-5 py-3.5">
                              <select
                                value={item.status}
                                onChange={(e) => handleToggleStatus(item.id, e.target.value)}
                                className={`text-[9px] uppercase font-black px-2 py-1 rounded border bg-black cursor-pointer ${
                                  item.status === 'Available'
                                    ? 'border-neonGreen/30 text-neonGreen'
                                    : item.status === 'Rented'
                                    ? 'border-blue-500/30 text-blue-400'
                                    : 'border-amber-500/30 text-amber-400'
                                }`}
                              >
                                <option value="Available" className="bg-neutral-950 text-neonGreen">Available</option>
                                <option value="Rented" className="bg-neutral-950 text-blue-400">Rented</option>
                                <option value="Maintenance" className="bg-neutral-950 text-amber-400">Maintenance</option>
                              </select>
                            </td>

                            {/* Delete Action */}
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleDeleteListing(item.id)}
                                className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                                title="Remove Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RENTAL REQUESTS */}
          {activeSection === 'requests' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wide">Incoming Rental Requests</h3>
                <span className="text-[10px] text-neonGreen font-bold bg-neonGreen/10 border border-neonGreen/20 px-2 py-0.5 rounded">
                  {rentalRequests.filter(r => r.status === 'Pending').length} Pending
                </span>
              </div>

              {rentalRequests.length === 0 ? (
                <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-12 text-center text-neutral-500">
                  No active rental requests received.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {rentalRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className={`bg-neutral-950 border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${
                        req.status === 'Accepted'
                          ? 'border-neonGreen/30 bg-neonGreen/5'
                          : req.status === 'Rejected'
                          ? 'border-red-500/20 bg-red-500/5 opacity-60'
                          : 'border-neutral-900 hover:border-neutral-800'
                      }`}
                    >
                      <div className="text-left flex-grow">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-[9px] text-neutral-400 font-extrabold bg-neutral-900 px-2 py-0.5 rounded uppercase border border-neutral-800">
                            {req.id}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-bold uppercase">
                            Logged: {req.date}
                          </span>
                          {req.status !== 'Pending' && (
                            <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded ${
                              req.status === 'Accepted' ? 'bg-neonGreen/15 text-neonGreen border border-neonGreen/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                            }`}>
                              {req.status}
                            </span>
                          )}
                        </div>

                        <h4 className="text-white font-extrabold text-sm uppercase leading-tight">
                          {req.outfitName}
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 mt-3 text-xs text-neutral-400 font-semibold">
                          <div>
                            <span className="text-[9px] text-neutral-500 block uppercase font-bold">Renter User</span>
                            <span className="text-neutral-200">{req.renterName}</span>
                            <span className="text-neutral-500 text-[10px] block font-medium">{req.renterEmail}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-neutral-500 block uppercase font-bold">Duration</span>
                            <span className="text-neutral-200">{req.duration}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-neutral-500 block uppercase font-bold">Payout Value</span>
                            <span className="text-white font-bold">₹{req.priceBreakdown.rent}</span>
                            <span className="text-neutral-500 text-[9px] block font-semibold">(Deposit: ₹{req.priceBreakdown.deposit})</span>
                          </div>
                        </div>
                      </div>

                      {req.status === 'Pending' && (
                        <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="flex-1 bg-neonGreen text-black font-extrabold text-[10px] uppercase py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 hover:shadow-lg"
                          >
                            Accept Leas
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="flex-1 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-bold text-[10px] uppercase py-2.5 px-4 rounded-xl border border-neutral-800 transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EARNINGS SECTION */}
          {activeSection === 'earnings' && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-300">
              
              {/* Earnings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-lg">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Total Earnings</span>
                  <span className="block text-2xl font-black text-white mt-1.5">₹{totalEarnings.toLocaleString()}</span>
                  <span className="text-[9px] text-neutral-500 font-semibold block mt-1">Life-time processed payout</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-lg">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Pending Payout</span>
                  <span className="block text-2xl font-black text-neonGreen mt-1.5">
                    ₹{rentalRequests.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.priceBreakdown.rent, 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-semibold block mt-1">Clearing next Friday cycle</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-lg">
                  <span className="block text-neutral-500 text-[9px] uppercase font-black tracking-widest">Completed Payments</span>
                  <span className="block text-2xl font-black text-white mt-1.5">₹{totalEarnings.toLocaleString()}</span>
                  <span className="text-[9px] text-neutral-500 font-semibold block mt-1">Cleared to {upiId}</span>
                </div>
              </div>

              {/* Transaction History log table */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-5 py-4 border-b border-neutral-900 flex justify-between items-center">
                  <h4 className="text-white font-extrabold text-xs uppercase tracking-wider m-0">Recent Payout Transactions</h4>
                  <span className="text-[9px] text-neutral-500 uppercase font-bold">YTD Ledger</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900/30 text-neutral-400 font-extrabold uppercase border-b border-neutral-900">
                        <th className="px-5 py-3">Payout ID</th>
                        <th className="px-5 py-3">Settled Date</th>
                        <th className="px-5 py-3">Method</th>
                        <th className="px-5 py-3 text-right">Settled Amount</th>
                        <th className="px-5 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 font-semibold text-neutral-400">
                      {rentalRequests.filter(r => r.status === 'Accepted' || r.status === 'Confirmed').length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-5 py-8 text-center text-neutral-500 font-medium">
                            No transactions settled yet.
                          </td>
                        </tr>
                      ) : (
                        rentalRequests
                          .filter(r => r.status === 'Accepted' || r.status === 'Confirmed')
                          .map((r, idx) => (
                            <tr key={r.id} className="hover:bg-neutral-900/10">
                              <td className="px-5 py-3 text-white font-bold">{r.id.startsWith("DX-") ? r.id : `TXN-${r.id.split('_')[1] || `902${idx}`}`}</td>
                              <td className="px-5 py-3">{r.date}</td>
                              <td className="px-5 py-3">UPI ({upiId})</td>
                              <td className="px-5 py-3 text-right text-white font-bold">₹{r.priceBreakdown.rent.toLocaleString()}</td>
                              <td className="px-5 py-3 text-center">
                                <span className="text-[8px] bg-neonGreen/10 text-neonGreen px-1.5 py-0.5 rounded border border-neonGreen/20">
                                  Success
                                </span>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: BOOKING MANAGEMENT */}
          {activeSection === 'bookings' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <div>
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wide">Availability Booking Calendar</h3>
                  <p className="text-neutral-500 text-[10px] font-semibold mt-0.5">June 2026 • Tap dates to block them and avoid double booking</p>
                </div>
                <span className="text-white bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-bold">
                  June 2026
                </span>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-neutral-900 border border-neutral-800 block" />
                  <span className="text-neutral-400">Available Date</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-neonGreen/10 border border-neonGreen/30 text-neonGreen flex items-center justify-center text-[8px] font-black">✓</span>
                  <span className="text-neutral-400">Active Booked (Rented)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center text-[8px] font-black">✖</span>
                  <span className="text-neutral-400">Blocked Date (Maintenance)</span>
                </div>
              </div>

              {/* Calendar Grid (June 2026 starts on Monday) */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5">
                <div className="grid grid-cols-7 gap-2.5 text-center font-extrabold uppercase text-[10px] text-neutral-500 mb-3 tracking-wider">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
                
                <div className="grid grid-cols-7 gap-2.5">
                  {/* Days 1 to 30 */}
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const day = idx + 1;
                    const dayStr = day < 10 ? `0${day}` : `${day}`;
                    const dateToCheck = `2026-06-${dayStr}`;
                    const isBooked = rentalRequests.some(r => 
                      r.date === dateToCheck && (r.status === 'Accepted' || r.status === 'Confirmed')
                    );
                    const isBlocked = blockedDates.includes(day);
                    
                    return (
                      <button
                        key={day}
                        onClick={() => !isBooked && toggleDateBlock(day)}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-between p-2 transition-all cursor-pointer ${
                          isBooked 
                            ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen cursor-not-allowed'
                            : isBlocked
                            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-400/60'
                            : 'bg-neutral-900 border-neutral-850 text-white hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-xs font-bold align-top self-start">{day}</span>
                        {isBooked ? (
                          <span className="text-[8px] uppercase font-black text-neonGreen self-end">Booked</span>
                        ) : isBlocked ? (
                          <span className="text-[8px] uppercase font-black text-red-400 self-end">Blocked</span>
                        ) : (
                          <span className="text-[8px] uppercase font-black text-neutral-500 self-end group-hover:text-white">Free</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE SECTION */}
          {activeSection === 'profile' && (
            <div className="animate-in fade-in duration-300">
              {showProfileSuccess && (
                <div className="mb-4 bg-neonGreen/10 border border-neonGreen/30 p-4 rounded-xl flex items-center gap-3 text-neonGreen font-bold text-xs">
                  <CheckCircle2 className="w-5 h-5 text-neonGreen fill-black" />
                  <span>Store Profile details updated successfully!</span>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowProfileSuccess(true);
                  setTimeout(() => setShowProfileSuccess(false), 2000);
                  addNotification("Storefront profile metadata updated.");
                }} 
                className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 flex flex-col gap-5 shadow-xl"
              >
                <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wide m-0 flex items-center gap-2">
                    <User className="w-4 h-4 text-neonGreen" />
                    Boutique Profile Metadata
                  </h3>
                  <span className="bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] font-bold text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-widest">
                    Gold Verified
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Boutique / Shop Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Boutique Support Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Boutique Registered Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || "boutique@dripx.com"}
                      className="neon-input text-xs opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Boutique Pickup Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>

                <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-900 text-xs text-neutral-400 font-semibold leading-relaxed">
                  🔒 Merchant identity and address location is KYC-verified. Changing boutique street address details requires re-fitting review from coordinates admin within 24 hours.
                </div>

                <button
                  type="submit"
                  className="w-full bg-neonGreen text-black font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-widest cursor-pointer mt-2"
                >
                  Save Store Details
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: REVIEWS & RATINGS */}
          {activeSection === 'reviews' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              {/* Ratings Summary Deck */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="text-center md:text-left">
                  <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest block">Average Score</span>
                  <div className="flex items-baseline gap-2 mt-1 justify-center md:justify-start">
                    <span className="text-4xl font-black text-white">4.8</span>
                    <span className="text-neutral-500 text-sm">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-neonGreen mt-1.5 justify-center md:justify-start">
                    <Star className="w-3.5 h-3.5 fill-neonGreen text-neonGreen" />
                    <Star className="w-3.5 h-3.5 fill-neonGreen text-neonGreen" />
                    <Star className="w-3.5 h-3.5 fill-neonGreen text-neonGreen" />
                    <Star className="w-3.5 h-3.5 fill-neonGreen text-neonGreen" />
                    <Star className="w-3.5 h-3.5 fill-neutral-800 text-neutral-800" />
                    <span className="text-[10px] text-neutral-400 font-bold ml-1">Excellent standing</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[10px] text-neutral-500 font-bold uppercase tracking-wider shrink-0 w-full md:w-auto max-w-[200px]">
                  <div className="flex justify-between items-center">
                    <span>5 Stars</span>
                    <span className="w-24 h-2 bg-neutral-900 rounded-lg overflow-hidden mx-2"><span className="block h-full w-[80%] bg-neonGreen"/></span>
                    <span className="text-white">80%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>4 Stars</span>
                    <span className="w-24 h-2 bg-neutral-900 rounded-lg overflow-hidden mx-2"><span className="block h-full w-[20%] bg-neonGreen"/></span>
                    <span className="text-white">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>3 Stars</span>
                    <span className="w-24 h-2 bg-neutral-900 rounded-lg overflow-hidden mx-2"><span className="block h-full w-0 bg-neonGreen"/></span>
                    <span className="text-white">0%</span>
                  </div>
                </div>
              </div>

              {/* Feed displays */}
              <div className="flex flex-col gap-4">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 text-left">
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-3 mb-3">
                      <div>
                        <span className="text-white font-extrabold text-xs uppercase block">{rev.name}</span>
                        <span className="text-[9px] text-neutral-500 font-bold block">{rev.date}</span>
                      </div>
                      <span className="bg-neonGreen/10 border border-neonGreen/20 text-neonGreen font-black text-[9px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        ★ {rev.rating}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs leading-relaxed font-semibold italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 9: NOTIFICATIONS FEED */}
          {activeSection === 'notifications' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wide">Merchant Notification Center</h3>
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] uppercase font-black tracking-widest text-neonGreen hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-12 text-center text-neutral-500">
                  No notifications logs found.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`bg-neutral-950 border rounded-xl p-4 flex items-center justify-between gap-4 transition-all ${
                        notif.read ? 'border-neutral-900/60 opacity-60' : 'border-neonGreen/20 shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-neutral-800' : 'bg-neonGreen'}`} />
                        <div>
                          <p className={`text-xs ${notif.read ? 'text-neutral-400' : 'text-white'} font-semibold text-left`}>
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-neutral-500 font-bold block text-left mt-0.5">{notif.time}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => clearNotification(notif.id)}
                        className="text-neutral-600 hover:text-neutral-300 p-1"
                        title="Delete log"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: SETTINGS & UPI */}
          {activeSection === 'settings' && (
            <div className="animate-in fade-in duration-300">
              {showSettingsSuccess && (
                <div className="mb-4 bg-neonGreen/10 border border-neonGreen/30 p-4 rounded-xl flex items-center gap-3 text-neonGreen font-bold text-xs">
                  <CheckCircle2 className="w-5 h-5 text-neonGreen fill-black" />
                  <span>Payout financial details updated successfully!</span>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowSettingsSuccess(true);
                  setTimeout(() => setShowSettingsSuccess(false), 2000);
                  addNotification("UPI/Bank details updated for payout distributions.");
                }} 
                className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 flex flex-col gap-5 shadow-xl"
              >
                <div className="border-b border-neutral-900 pb-3">
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wide m-0 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-neonGreen" />
                    Payout & Settlement Details
                  </h3>
                  <p className="text-neutral-500 text-[10px] font-semibold mt-0.5 uppercase tracking-wider">Configure your registered UPI ID and Bank accounts for weekly payout settlement</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    UPI ID (Preferred for Instant Settlements)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. boutique@upi"
                    className="neon-input text-xs"
                  />
                </div>

                <div className="px-2 py-1.5 border-b border-neutral-900 text-[10px] text-neutral-500 font-black uppercase tracking-wider mt-2">
                  Backup Bank Account
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      required
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Account Number
                  </label>
                  <input
                    type="password"
                    required
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neonGreen text-black font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-widest cursor-pointer mt-2"
                >
                  Update Settlement Method
                </button>
              </form>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
