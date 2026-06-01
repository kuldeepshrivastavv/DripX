import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MapPin, LayoutDashboard, ShoppingBag, LogOut, LogIn, ChevronDown, Menu, X, ChevronRight, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

// High-end unsplash fashion image directory mapped to sections
const MEGAMENU_DATA = {
  garments: {
    title: 'GARMENTS',
    goldItem: { name: 'ALL GARMENTS', path: '/home?gender=Women' },
    items: [
      { name: 'LEHENGAS', path: '/home?gender=Women&search=Lehenga' },
      { name: 'SAREES', path: '/home?gender=Women&search=Saree', hasSub: true },
      { name: 'GOWNS', path: '/home?gender=Women&search=Gown' },
      { name: 'DRESSES', path: '/home?gender=Women&search=Dress', hasSub: true },
      { name: 'ANARKALIS & SUITS', path: '/home?gender=Women&search=Suit' },
      { name: 'TOP-BOTTOM', path: '/home?gender=Women' },
      { name: 'SHARARAS', path: '/home?gender=Women&search=Sharara' },
      { name: 'OTHERS', path: '/home?gender=Women' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
        caption: 'Royal Emerald Lehenga'
      },
      {
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
        caption: 'Designer Evening Gowns'
      }
    ]
  },
  jewelry: {
    title: 'JEWELRY',
    goldItem: { name: 'ALL JEWELRY', path: '/home?search=Jewelry' },
    items: [
      { name: 'JEWELRY SETS', path: '/home?search=Jewelry' },
      { name: 'BRIDAL SETS', path: '/home?search=Bridal' },
      { name: 'NECKLACES', path: '/home?search=Necklace' },
      { name: 'EARRINGS', path: '/home?search=Earring' },
      { name: 'BANGLES-BRACELETS', path: '/home?search=Bangle' },
      { name: 'MATHAPATI-MANGTIKA', path: '/home?search=Mathapati' },
      { name: 'RINGS-HAATHPHOOL', path: '/home?search=Ring' },
      { name: 'NOSE-WAIST ETC', path: '/home?search=Nose' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
        caption: 'Gold & Diamond Choker'
      },
      {
        url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80',
        caption: 'Bridal Mathapatti & Maangtika'
      },
      {
        url: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80',
        caption: 'Designer Gold Jhumkas'
      }
    ]
  },
  accessories: {
    title: 'ACCESSORIES',
    goldItem: { name: 'ALL ACCESSORIES', path: '/home?search=Accessory' },
    items: [
      { name: 'CLUTCHES & BAGS', path: '/home?search=Bag' },
      { name: 'FOOTWEAR', path: '/home?search=Shoes' },
      { name: 'BELTS & WALLETS', path: '/home?search=Belt' },
      { name: 'STOLES & SCARVES', path: '/home?search=Stole' },
      { name: 'TURBANS & SEHRAS', path: '/home?search=Turban' },
      { name: 'CUFFLINKS & POCKET SQUARES', path: '/home?search=Cufflink' },
      { name: 'WATCHES', path: '/home?search=Watch' },
      { name: 'SUNGLASSES', path: '/home?search=Glasses' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&auto=format&fit=crop&q=80',
        caption: 'Luxury Designer Clutches'
      },
      {
        url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&auto=format&fit=crop&q=80',
        caption: 'Bridal Juttis & Footwear'
      },
      {
        url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
        caption: 'Traditional Turbans & Sherwanis'
      }
    ]
  },
  menswear: {
    title: 'MENSWEAR',
    goldItem: { name: 'ALL MENSWEAR', path: '/home?gender=Men' },
    items: [
      { name: 'KURTA SET', path: '/home?gender=Men&search=Kurta' },
      { name: 'BANDH GALA', path: '/home?gender=Men&search=Bandh' },
      { name: 'SHERWANI', path: '/home?gender=Men&search=Sherwani' },
      { name: 'JODHPURI', path: '/home?gender=Men&search=Jodhpuri' },
      { name: 'TUXEDO', path: '/home?gender=Men&search=Tuxedo' },
      { name: 'SUIT', path: '/home?gender=Men&search=Suit' },
      { name: 'BLAZER', path: '/home?gender=Men&search=Blazer' },
      { name: 'INDO WESTERN', path: '/home?gender=Men&search=Western' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80',
        caption: 'Royal White Sherwani'
      },
      {
        url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80',
        caption: 'Double-Breasted Premium Suit'
      },
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        caption: 'Sleek Bespoke Blazer'
      }
    ]
  }
};

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const { user, logout, userLocation, userLocationLoading, detectUserLocation } = useApp();

  // Desktop Hover Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mobile Drawer states
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState(null);

  // Hide the navbar entirely on the Landing Page
  if (path === '/') {
    return null;
  }

  const toggleAccordion = (section) => {
    setMobileActiveAccordion(prev => prev === section ? null : section);
  };

  return (
    <>
      {/* Desktop Double-Layered Luxury Header */}
      <header className="sticky top-0 z-50 w-full hidden md:flex flex-col" style={{boxShadow:'0 1px 6px rgba(0,0,0,0.08)'}}>
        
        {/* Layer 1: Top Bar (Help & Location) — intentionally dark */}
        <div style={{backgroundColor:'#111111', borderBottom:'1px solid #2a2a2a'}}>
          <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between">
            {/* Logo */}
            <Link to={user ? (user.role === 'Shopkeeper' ? "/dashboard" : "/home") : "/"} className="flex items-center gap-2 px-2 py-1">
              <span style={{color:'#8B0A28', fontWeight:900, fontSize:'0.85rem', letterSpacing:'0.15em'}}>
                DRIP<span style={{color:'#ffffff'}}>X</span>
              </span>
              <span style={{width:1, height:14, background:'#444', display:'inline-block', margin:'0 6px'}} />
              <span style={{color:'#aaaaaa', fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase'}}>
                RENTAL CO.
              </span>
            </Link>

            {/* Support info */}
            <div className="flex items-center gap-6">
              <a href="mailto:abcddtherate@gmail.com" style={{color:'#aaaaaa', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:5, textDecoration:'none'}} className="hover:text-white transition-colors" title="Support: Kuldeep Shrivastava (abcddtherate@gmail.com)">
                <Mail className="w-3.5 h-3.5 text-neonGreen" />
                Need Help? Kuldeep Shrivastava
              </a>
              <button 
                onClick={detectUserLocation}
                style={{color:'#aaaaaa', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:5, cursor:'pointer', background:'none', border:'none'}}
                className="hover:text-white transition-colors"
              >
                <MapPin className={`w-3.5 h-3.5 ${userLocationLoading ? 'animate-bounce' : ''}`} style={{color: userLocationLoading ? '#8B0A28' : '#777'}} />
                {userLocationLoading ? 'Detecting...' : userLocation ? userLocation.name : 'Select Location'}
              </button>
            </div>
          </div>
        </div>

        {/* Layer 2: Main Bottom Navigation Bar — white */}
        <div style={{backgroundColor:'#ffffff', borderBottom:'1px solid #e8e3dd'}}>
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between relative">
            
            {/* Navigation links wrapper */}
            <nav 
              className="flex items-center h-full"
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {/* HOME Link */}
              <Link 
                to={user ? (user.role === 'Shopkeeper' ? "/dashboard" : "/home") : "/"}
                style={{color:'#222222', fontSize:'0.625rem', fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', padding:'0 16px', height:'100%', display:'flex', alignItems:'center', textDecoration:'none', transition:'color 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.color='#8B0A28'}
                onMouseLeave={e => e.currentTarget.style.color='#222222'}
              >
                HOME
              </Link>

              {/* Hover Dropdowns */}
              {Object.entries(MEGAMENU_DATA).map(([key, data]) => {
                const isOpen = activeDropdown === key;
                return (
                  <div 
                    key={key}
                    className="h-full flex items-center"
                    onMouseEnter={() => setActiveDropdown(key)}
                  >
                    <button
                      style={{
                        height:'100%', display:'flex', alignItems:'center', gap:4, padding:'0 16px',
                        fontSize:'0.625rem', fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase',
                        cursor:'pointer', border:'none', transition:'all 0.2s',
                        background: isOpen ? '#8B0A28' : 'transparent',
                        color: isOpen ? '#ffffff' : '#222222',
                        borderBottom: isOpen ? '2px solid #8B0A28' : '2px solid transparent',
                      }}
                    >
                      {data.title}
                      <ChevronDown style={{width:12, height:12, transition:'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none'}} />
                    </button>
                  </div>
                );
              })}

              {/* DESIGNERS Link */}
              {(!user || user.role !== 'Shopkeeper') && (
                <Link 
                  to={user ? "/home?search=Designer" : "/?auth=login"}
                  style={{color:'#222222', fontSize:'0.625rem', fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', padding:'0 16px', height:'100%', display:'flex', alignItems:'center', textDecoration:'none', transition:'color 0.2s'}}
                  onMouseEnter={e => e.currentTarget.style.color='#8B0A28'}
                  onMouseLeave={e => e.currentTarget.style.color='#222222'}
                >
                  DESIGNERS
                </Link>
              )}

              {/* SELL WITH US Link */}
              {!user && (
                <Link 
                  to="/?auth=login"
                  style={{color:'#8B0A28', fontSize:'0.625rem', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', padding:'0 16px', height:'100%', display:'flex', alignItems:'center', textDecoration:'none'}}
                >
                  SELL WITH US
                </Link>
              )}

              {/* PRIME Link */}
              {(!user || user.role !== 'Shopkeeper') && (
                <Link 
                  to={user ? "/home?search=Premium" : "/?auth=login"}
                  style={{color:'#222222', fontSize:'0.625rem', fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', padding:'0 16px', height:'100%', display:'flex', alignItems:'center', textDecoration:'none', transition:'color 0.2s'}}
                  onMouseEnter={e => e.currentTarget.style.color='#8B0A28'}
                  onMouseLeave={e => e.currentTarget.style.color='#222222'}
                >
                  PRIME
                </Link>
              )}

              {/* Megamenu dropdown menu panel */}
              {activeDropdown && MEGAMENU_DATA[activeDropdown] && (
                <div 
                  className="absolute top-12 left-0 right-0 w-full bg-white text-neutral-900 border-b border-neutral-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                  onMouseEnter={() => setActiveDropdown(activeDropdown)}
                >
                  <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8 text-left">
                    
                    {/* Left link lists */}
                    <div className="col-span-3 border-r border-neutral-150 pr-8">
                      <ul className="space-y-3.5">
                        <li>
                          <Link
                            to={user ? MEGAMENU_DATA[activeDropdown].goldItem.path : "/?auth=login"}
                            onClick={() => setActiveDropdown(null)}
                            className="text-[#c5a880] hover:text-[#b4956c] font-black tracking-widest text-xs uppercase block transition-all"
                          >
                            {MEGAMENU_DATA[activeDropdown].goldItem.name}
                          </Link>
                        </li>
                        {MEGAMENU_DATA[activeDropdown].items.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={user ? item.path : "/?auth=login"}
                              onClick={() => setActiveDropdown(null)}
                              className="text-neutral-700 hover:text-black font-extrabold tracking-wider text-[10px] uppercase flex items-center justify-between group transition-all"
                            >
                              <span>{item.name}</span>
                              {item.hasSub && (
                                <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-black transition-all" />
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Unsplash luxury images */}
                    <div className="col-span-9">
                      <div className={`grid gap-4 h-full ${
                        MEGAMENU_DATA[activeDropdown].images.length === 1 
                          ? 'grid-cols-1' 
                          : MEGAMENU_DATA[activeDropdown].images.length === 2 
                          ? 'grid-cols-2' 
                          : 'grid-cols-3'
                      }`}>
                        {MEGAMENU_DATA[activeDropdown].images.map((img, idx) => (
                          <div key={idx} className="relative rounded-2xl overflow-hidden group shadow-md h-60 border border-neutral-150 bg-neutral-50">
                            <img 
                              src={img.url} 
                              alt={img.caption} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                              <span className="text-white text-[9px] font-black tracking-widest uppercase">
                                {img.caption}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </nav>

            {/* Right Authentication Controls */}
            <div className="flex items-center gap-4 pl-4 shrink-0">
              {user ? (
                <div className="flex items-center gap-3">
                  <span style={{fontSize:'0.6rem', color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em'}}>{user.name}</span>
                  <button
                    onClick={logout}
                    style={{display:'flex', alignItems:'center', gap:5, background:'#fff0f2', border:'1px solid #f0c0c8', color:'#8B0A28', fontWeight:700, padding:'5px 12px', borderRadius:8, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', transition:'all 0.2s'}}
                    onMouseEnter={e => { e.currentTarget.style.background='#8B0A28'; e.currentTarget.style.color='#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#fff0f2'; e.currentTarget.style.color='#8B0A28'; }}
                  >
                    <LogOut style={{width:13, height:13}} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/?auth=login"
                  style={{display:'flex', alignItems:'center', gap:6, background:'#8B0A28', color:'#ffffff', fontWeight:800, padding:'6px 18px', borderRadius:8, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.12em', textDecoration:'none', transition:'background 0.2s'}}
                  onMouseEnter={e => e.currentTarget.style.background='#6b0820'}
                  onMouseLeave={e => e.currentTarget.style.background='#8B0A28'}
                >
                  <LogIn style={{width:13, height:13}} />
                  Login / Signup
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Luxury Header — hidden on md+ via className (no inline display to override) */}
      <div className="md:hidden flex justify-between items-center" style={{backgroundColor:'#111111', borderBottom:'1px solid #2a2a2a', padding:'12px 20px', position:'sticky', top:0, zIndex:40}}>
        <Link to={user ? (user.role === 'Shopkeeper' ? "/dashboard" : "/home") : "/"} style={{textDecoration:'none', display:'flex', alignItems:'center', gap:8}}>
          <span style={{color:'#8B0A28', fontWeight:900, fontSize:'1.1rem', letterSpacing:'0.15em'}}>DRIP<span style={{color:'#fff'}}>X</span></span>
          <span style={{color:'#888', fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase'}}>RENTAL CO.</span>
        </Link>
        
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          {user ? (
            <span style={{fontSize:'0.55rem', color:'#aaa', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', background:'rgba(139,10,40,0.15)', border:'1px solid rgba(139,10,40,0.3)', padding:'2px 8px', borderRadius:4, color:'#e08090'}}>
              {user.role}
            </span>
          ) : null}

          {/* Hamburger Drawer */}
          <button 
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            style={{color:'#ffffff', background:'#2a2a2a', border:'1px solid #3a3a3a', padding:6, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}
          >
            {isMobileDrawerOpen ? <X style={{width:18, height:18}} /> : <Menu style={{width:18, height:18}} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)'}}
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer container */}
          <div style={{position:'relative', width:'100%', maxWidth:320, background:'#ffffff', borderLeft:'1px solid #e8e3dd', height:'100%', overflowY:'auto', padding:24, display:'flex', flexDirection:'column', justifyContent:'space-between', boxShadow:'-8px 0 40px rgba(0,0,0,0.12)'}} className="animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:16, marginBottom:20, borderBottom:'1px solid #e8e3dd'}}>
                <span style={{color:'#111', fontWeight:900, letterSpacing:'0.12em', fontSize:'0.65rem', textTransform:'uppercase'}}>NAVIGATE COLLECTION</span>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{color:'#777', background:'none', border:'none', cursor:'pointer', padding:4}}
                >
                  <X style={{width:18, height:18}} />
                </button>
              </div>

              {/* Navigation Items Accordion */}
              <nav style={{display:'flex', flexDirection:'column', gap:4, textAlign:'left'}}>
                {/* HOME */}
                <Link
                  to={user ? (user.role === 'Shopkeeper' ? "/dashboard" : "/home") : "/"}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{color:'#111', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 0', borderBottom:'1px solid #eee', textDecoration:'none', display:'block', transition:'color 0.2s'}}
                  onMouseEnter={e => e.currentTarget.style.color='#8B0A28'}
                  onMouseLeave={e => e.currentTarget.style.color='#111'}
                >
                  HOME
                </Link>

                {/* Categories */}
                {Object.entries(MEGAMENU_DATA).map(([key, data]) => {
                  const isAccordionOpen = mobileActiveAccordion === key;
                  return (
                    <div key={key} style={{borderBottom:'1px solid #eee', paddingBottom:6}}>
                      <button
                        onClick={() => toggleAccordion(key)}
                        style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', background:'none', border:'none', cursor:'pointer', color: isAccordionOpen ? '#8B0A28' : '#111', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em'}}
                      >
                        <span>{data.title}</span>
                        <ChevronDown style={{width:14, height:14, transition:'transform 0.2s', transform: isAccordionOpen ? 'rotate(180deg)' : 'none', color: isAccordionOpen ? '#8B0A28' : '#999'}} />
                      </button>

                      {isAccordionOpen && (
                        <div style={{paddingLeft:12, paddingBottom:8, display:'flex', flexDirection:'column', gap:8}}>
                          <Link
                            to={user ? data.goldItem.path : "/?auth=login"}
                            onClick={() => setIsMobileDrawerOpen(false)}
                            style={{color:'#8B0A28', fontWeight:900, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.08em', textDecoration:'none'}}
                          >
                            {data.goldItem.name}
                          </Link>
                          {data.items.map((item) => (
                            <Link
                              key={item.name}
                              to={user ? item.path : "/?auth=login"}
                              onClick={() => setIsMobileDrawerOpen(false)}
                              style={{color:'#555', fontWeight:700, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.08em', textDecoration:'none', transition:'color 0.2s'}}
                              onMouseEnter={e => e.currentTarget.style.color='#111'}
                              onMouseLeave={e => e.currentTarget.style.color='#555'}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* DESIGNERS */}
                {(!user || user.role !== 'Shopkeeper') && (
                  <Link
                    to={user ? "/home?search=Designer" : "/?auth=login"}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    style={{color:'#111', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 0', borderBottom:'1px solid #eee', textDecoration:'none', display:'block'}}
                  >
                    DESIGNERS
                  </Link>
                )}

                {/* SELL WITH US */}
                {!user && (
                  <Link
                    to="/?auth=login"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    style={{color:'#8B0A28', fontWeight:900, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 0', borderBottom:'1px solid #eee', textDecoration:'none', display:'block'}}
                  >
                    SELL WITH US
                  </Link>
                )}

                {/* PRIME */}
                {(!user || user.role !== 'Shopkeeper') && (
                  <Link
                    to={user ? "/home?search=Premium" : "/?auth=login"}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    style={{color:'#111', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 0', borderBottom:'1px solid #eee', textDecoration:'none', display:'block'}}
                  >
                    PRIME
                  </Link>
                )}
              </nav>
            </div>

            {/* Footer Profile/Controls */}
            <div style={{marginTop:24, paddingTop:16, borderTop:'1px solid #e8e3dd'}}>
              {user ? (
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  <div style={{background:'#faf8f6', border:'1px solid #e8e3dd', padding:'12px 14px', borderRadius:12}}>
                    <div style={{fontSize:'0.55rem', color:'#999', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em'}}>Active Member</div>
                    <div style={{color:'#111', fontWeight:800, fontSize:'0.75rem', textTransform:'uppercase', marginTop:2}}>{user.name}</div>
                    <div style={{color:'#8B0A28', fontWeight:800, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4}}>{user.role} Account</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileDrawerOpen(false);
                    }}
                    style={{width:'100%', background:'#fff0f2', border:'1px solid #f0c0c8', color:'#8B0A28', fontWeight:800, padding:'10px 0', borderRadius:10, fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6}}
                  >
                    <LogOut style={{width:14, height:14}} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/?auth=login"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#8B0A28', color:'#ffffff', fontWeight:900, padding:'12px 0', borderRadius:10, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.12em', textDecoration:'none', width:'100%'}}
                >
                  <LogIn style={{width:15, height:15}} />
                  Login / Signup
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
