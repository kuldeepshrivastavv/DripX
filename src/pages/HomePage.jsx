import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { SlidersHorizontal, Trash2, User, Mail, Shield, Calendar, MapPin, Plus, ArrowRight, LayoutDashboard, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const { user, bookings, outfits, addReview } = useApp();
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

  // Review Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewRating(5);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    setReviewSubmitting(true);
    try {
      await addReview({
        bookingId: selectedBookingForReview.id,
        outfitId: selectedBookingForReview.outfitId,
        outfitTitle: selectedBookingForReview.outfitTitle,
        rating: reviewRating,
        comment: reviewComment,
        shopId: selectedBookingForReview.shopId
      });
      setIsReviewModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

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

                    <div style={{display:'flex', flexDirection:'column', gap:12, borderTop:'1px solid #f0ebe4', paddingTop:12, width:'100%'} } className="sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:gap-3 sm:w-auto">
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'} } className="sm:flex-col sm:items-end sm:justify-start">
                        <span style={{color:'#8B1A2F', fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em'}}>
                          ● {booking.status}
                        </span>
                        <span style={{color:'#1a1614', fontWeight:800, fontSize:'0.9rem', marginTop:2}}>₹{booking.price}</span>
                      </div>

                      {/* Leave Review or ✓ Reviewed Button */}
                      {['accepted', 'confirmed', 'completed'].includes(booking.status?.toLowerCase()) && (
                        <div style={{display:'flex', justifyContent:'flex-end', width:'100%'} }>
                          {booking.reviewed ? (
                            <span style={{
                              color: '#16a34a',
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              background: 'rgba(22,163,74,0.08)',
                              border: '1px solid rgba(22,163,74,0.25)',
                              padding: '4px 8px',
                              borderRadius: 6,
                              display: 'inline-block'
                            }}>
                              ✓ Reviewed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenReviewModal(booking)}
                              style={{
                                background: '#8B1A2F',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                padding: '6px 12px',
                                borderRadius: 8,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = '#721324'; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#8B1A2F'; }}
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. Star-Rating glassmorphic overlay modal */}
      {isReviewModalOpen && selectedBookingForReview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(26, 22, 20, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e8e2dc',
            borderRadius: 24,
            padding: 32,
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <h3 style={{
              color: '#1a1614',
              fontWeight: 900,
              fontSize: '1.15rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 4,
              marginTop: 0
            }}>
              Share Your Drip
            </h3>
            <p style={{
              color: '#8c7e76',
              fontSize: '0.75rem',
              margin: '0 0 24px 0',
              fontWeight: 500
            }}>
              How was your experience renting <span style={{ color: '#8B1A2F', fontWeight: 800 }}>{selectedBookingForReview.outfitTitle}</span>?
            </p>

            <form onSubmit={handleReviewSubmit}>
              {/* Interactive Stars Selector */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 24
              }}>
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isGold = starValue <= reviewRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setReviewRating(starValue)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        fill={isGold ? '#fbbf24' : 'none'}
                        stroke={isGold ? '#fbbf24' : '#b0a89e'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* Textarea review comment */}
              <div style={{ textAlign: 'left', marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  color: '#6b5e55',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8
                }}>
                  Review Details
                </label>
                <textarea
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the fit, quality, or service. Did you get compliments?"
                  rows="4"
                  style={{
                    width: '100%',
                    background: '#faf8f5',
                    border: '1px solid #e8e2dc',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: '0.8rem',
                    color: '#1a1614',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#8B1A2F'; }}
                  onBlur={e => { e.target.style.borderColor = '#e8e2dc'; }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  disabled={reviewSubmitting}
                  onClick={() => setIsReviewModalOpen(false)}
                  style={{
                    flex: 1,
                    background: '#f5f1ec',
                    color: '#6b5e55',
                    border: '1px solid #e8e2dc',
                    borderRadius: 12,
                    padding: '12px 16px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e8e2dc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f5f1ec'; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{
                    flex: 1,
                    background: '#8B1A2F',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 16px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#721324'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#8B1A2F'; }}
                >
                  {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
