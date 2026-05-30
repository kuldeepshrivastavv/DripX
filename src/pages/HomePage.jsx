import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { SlidersHorizontal, Trash2, User, Mail, Shield, Calendar, MapPin, Plus, ArrowRight, LayoutDashboard, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const { user, bookings, outfits } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Redirect shopkeepers to their dashboard
  useEffect(() => {
    if (user && user.role === 'Shopkeeper') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Tab state: 'browse' (Collection) or 'overview' (My Bookings)
  // Renters default to browse; shopkeepers default to overview
  const [activeTab, setActiveTab] = useState(user?.role === 'Renter' ? 'browse' : 'overview');

  // Filter and Sorting states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [priceRange, setPriceRange] = useState(3000);
  const [sortBy, setSortBy] = useState("default");
  const [selectedGender, setSelectedGender] = useState("All");
  
  // Mobile drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync filters with URL Search Parameters (e.g. from Megamenu items)
  useEffect(() => {
    const gender = searchParams.get('gender');
    const search = searchParams.get('search');
    const occasion = searchParams.get('occasion');
    
    setSelectedGender(gender || "All");
    setSearchQuery(search || "");
    setSelectedOccasion(occasion || "All");
    
    if (gender || search || occasion) {
      setActiveTab('browse');
    }
  }, [searchParams]);

  // Calculate dynamic counts
  const totalMenCount = outfits.filter(o => o.gender === "Men" || o.gender === "Unisex").length;
  const totalWomenCount = outfits.filter(o => o.gender === "Women" || o.gender === "Unisex").length;
  const totalAllCount = outfits.length;

  // Filter closet items
  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = 
      outfit.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      outfit.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (outfit.occasion && outfit.occasion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      outfit.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesOccasion = selectedOccasion === "All" || outfit.occasion === selectedOccasion;
    const matchesSize = selectedSize === "All" || outfit.size === selectedSize;
    const matchesPrice = outfit.price <= priceRange;
    const matchesGender = 
      selectedGender === "All" || 
      (selectedGender === "Men" && (outfit.gender === "Men" || outfit.gender === "Unisex")) ||
      (selectedGender === "Women" && (outfit.gender === "Women" || outfit.gender === "Unisex"));

    return matchesSearch && matchesOccasion && matchesSize && matchesPrice && matchesGender;
  });

  // Sort closet items
  const sortedOutfits = [...filteredOutfits].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default featured sequence
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedOccasion("All");
    setSelectedSize("All");
    setPriceRange(3000);
    setSortBy("default");
    setSelectedGender("All");
  };

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#faf8f5', padding:'2rem 1.5rem', maxWidth:'80rem', margin:'0 auto', width:'100%', position:'relative'}}>
      
      {/* 1. Breadcrumbs Row */}
      <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-3 text-left">
        <span>DripX &gt; Closets &gt; {activeTab === 'browse' ? 'Collection' : 'Dashboard'}</span>
      </div>

      {/* 2. COLLECTION Header and Tab Toggles */}
      <div style={{display:'flex', flexDirection:'column', gap:16, marginBottom:32, borderBottom:'1px solid #e8e2dc', paddingBottom:24, textAlign:'left'}} className="md:flex-row md:items-end md:justify-between">
        <div>
          <h1 style={{fontSize:'clamp(1.75rem,4vw,3.5rem)', fontWeight:900, color:'#1a1614', letterSpacing:'-0.02em', textTransform:'uppercase', margin:0, lineHeight:1}}>
            {activeTab === 'browse' ? 'COLLECTION' : 'MY BOOKINGS'}
          </h1>
        </div>

        {/* View Toggler Tabs */}
        <div style={{display:'flex', background:'#ffffff', border:'1px solid #e8e2dc', padding:4, borderRadius:12, alignSelf:'flex-start', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding:'8px 20px', borderRadius:8, fontSize:'0.625rem', fontWeight:800,
              letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', border:'none',
              transition:'all 0.2s',
              background: activeTab === 'browse' ? '#8B1A2F' : 'transparent',
              color:       activeTab === 'browse' ? '#ffffff' : '#6b5e55',
            }}
          >
            Collection
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding:'8px 20px', borderRadius:8, fontSize:'0.625rem', fontWeight:800,
              letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', border:'none',
              transition:'all 0.2s',
              background: activeTab === 'overview' ? '#8B1A2F' : 'transparent',
              color:       activeTab === 'overview' ? '#ffffff' : '#6b5e55',
            }}
          >
            My Bookings
          </button>
        </div>
      </div>

      {/* VIEW A: COLLECTION (BROWSE CLOSES) */}
      {activeTab === 'browse' && (
        <div className="w-full">
          {sortedOutfits.length === 0 ? (
            /* Empty state */
            <div style={{background:'#ffffff', border:'2px dashed #d8d0c8', borderRadius:24, padding:48, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400}}>
              <div style={{width:64, height:64, borderRadius:16, background:'#f5f1ec', border:'1px solid #e8e2dc', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24}}>
                <Trash2 style={{width:28, height:28, color:'#a89e95'}} />
              </div>
              <h3 style={{color:'#1a1614', fontWeight:800, fontSize:'1.1rem', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                No Outfits Found
              </h3>
              <p style={{color:'#8c7e76', fontSize:'0.85rem', maxWidth:320, marginBottom:32, lineHeight:1.6}}>
                We couldn't find any rentals matching your criteria. Try adjusting filters or select another category from the top menu.
              </p>
              <button
                onClick={resetFilters}
                style={{background:'#8B1A2F', color:'#ffffff', fontWeight:800, fontSize:'0.7rem', padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', letterSpacing:'0.1em', textTransform:'uppercase'}}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Card grid - 4 columns on large screens for full width photo grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedOutfits.map((outfit) => (
                <ProductCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW B: ACCOUNT & BOOKINGS LEDGER */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: Minimal User Details card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div style={{background:'#ffffff', border:'1px solid #e8e2dc', borderRadius:24, padding:24, position:'relative', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
              
              <h3 style={{color:'#1a1614', fontWeight:800, fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:16, borderBottom:'1px solid #e8e2dc', paddingBottom:12, display:'flex', alignItems:'center', gap:8}}>
                <User style={{width:14, height:14, color:'#8B1A2F'}} />
                Member Profile
              </h3>

              <div style={{display:'flex', flexDirection:'column', gap:12, fontSize:'0.75rem', marginBottom:24}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#8c7e76', fontWeight:600}}>Name</span>
                  <span style={{color:'#1a1614', fontWeight:700}}>{user?.name || 'Member Account'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#8c7e76', fontWeight:600}}>Email</span>
                  <span style={{color:'#1a1614', fontWeight:700}}>{user?.email || 'user@dripx.com'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#8c7e76', fontWeight:600}}>Role</span>
                  <span style={{color:'#8B1A2F', fontWeight:800, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em'}}>{user?.role}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#8c7e76', fontWeight:600}}>Status</span>
                  <span style={{color:'#16a34a', fontWeight:700, fontSize:'0.7rem'}}>✓ Verified</span>
                </div>
              </div>

              {user?.role === 'Shopkeeper' ? (
                <Link
                  to="/dashboard"
                  style={{display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'#8B1A2F', color:'#ffffff', fontWeight:800, padding:'12px 16px', borderRadius:10, fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em', textDecoration:'none', width:'100%'}}
                >
                  <LayoutDashboard style={{width:14, height:14}} />
                  Partner Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => setActiveTab('browse')}
                  style={{display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'#8B1A2F', color:'#ffffff', fontWeight:800, padding:'12px 16px', borderRadius:10, fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em', border:'none', cursor:'pointer', width:'100%'}}
                >
                  <ShoppingBag style={{width:14, height:14}} />
                  Browse Closets
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Bookings Ledger cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{color:'#1a1614', fontWeight:800, fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', margin:0}}>
                Active Bookings Ledger
              </h3>
              <span style={{color:'#8c7e76', fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em'}}>
                Total bookings ({bookings.length})
              </span>
            </div>

            {bookings.length === 0 ? (
              <div style={{background:'#ffffff', border:'2px dashed #d8d0c8', borderRadius:24, padding:48, textAlign:'center', color:'#8c7e76', minHeight:220, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem'}}>
                No active bookings. Go explore the wardrobe directory!
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:16}}>
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    style={{background:'#ffffff', border:'1px solid #e8e2dc', borderRadius:16, padding:20, display:'flex', flexDirection:'column', gap:16, textAlign:'left', transition:'border-color 0.2s, box-shadow 0.2s', boxShadow:'0 1px 6px rgba(0,0,0,0.04)'}}
                    className="sm:flex-row sm:items-center sm:justify-between"
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(139,26,47,0.3)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(139,26,47,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e2dc'; e.currentTarget.style.boxShadow='0 1px 6px rgba(0,0,0,0.04)'; }}
                  >
                    <div style={{display:'flex', alignItems:'center', gap:16}}>
                      <div style={{width:48, height:64, borderRadius:10, overflow:'hidden', background:'#f5f1ec', border:'1px solid #e8e2dc', flexShrink:0}}>
                        <img src={booking.outfitImage} alt={booking.outfitTitle} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      </div>
                      <div>
                        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:3}}>
                          <span style={{fontSize:'0.55rem', color:'#8B1A2F', fontWeight:800, background:'rgba(139,26,47,0.08)', border:'1px solid rgba(139,26,47,0.25)', padding:'2px 6px', borderRadius:4, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                            {booking.id}
                          </span>
                          <span style={{fontSize:'0.6rem', color:'#6b5e55', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                            {booking.shop}
                          </span>
                        </div>
                        <h4 style={{color:'#1a1614', fontWeight:800, fontSize:'0.85rem', textTransform:'uppercase', lineHeight:1.2, maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4}}>
                          {booking.outfitTitle}
                        </h4>
                        <div style={{display:'flex', flexDirection:'column', gap:4, marginTop:4}}>
                          <div style={{display:'flex', gap:12, fontSize:'0.6rem', color:'#8c7e76', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                            <span style={{display:'flex', alignItems:'center', gap:3}}><Calendar style={{width:11,height:11}} /> {booking.bookingDate}</span>
                            <span style={{display:'flex', alignItems:'center', gap:3}}><MapPin style={{width:11,height:11}} /> {booking.type}</span>
                          </div>
                          {booking.address && (
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display:'inline-flex', 
                                alignItems:'center', 
                                gap:4, 
                                fontSize:'0.55rem', 
                                color:'#8B1A2F', 
                                fontWeight:900, 
                                textTransform:'uppercase', 
                                letterSpacing:'0.04em', 
                                textDecoration:'underline', 
                                cursor:'pointer', 
                                marginTop:3
                              }}
                              title="Click to view pickup / delivery location on Google Maps"
                            >
                              📍 Address: {booking.address}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f0ebe4', paddingTop:12}} className="sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <span style={{color:'#8B1A2F', fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em'}}>
                        ● {booking.status}
                      </span>
                      <span style={{color:'#1a1614', fontWeight:800, fontSize:'0.9rem', marginTop:2}}>₹{booking.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
