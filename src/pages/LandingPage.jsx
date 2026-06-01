import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  User, 
  KeyRound,
  Zap,
  BadgePercent,
  Clock,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building,
  CheckCircle2,
  ArrowRightLeft,
  LogIn,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../firebase';

export default function LandingPage() {
  const { login, signup, loginWithGoogle, authError, setAuthError } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Renter'); // 'Renter' | 'Shopkeeper'

  // Testimonial carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [authSubmitting, setAuthSubmitting]       = useState(false);

  // Trigger login modal if query params specify it (e.g. from navbar link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authParam = params.get('auth');
    if (authParam === 'login' || authParam === 'signup') {
      setIsAuthModalOpen(true);
      setAuthMode(authParam);
    }
  }, [location]);

  // Autoplay testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const openAuthWithRole = (selectedRole, mode = 'signup') => {
    setRole(selectedRole);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const finalName = name.trim() || email.split('@')[0];
        await signup(finalName, email, password, role);
        setIsAuthModalOpen(false);
        navigate(role === 'Shopkeeper' ? '/dashboard' : '/home');
      } else {
        const resolvedRole = await login(email, password, role);
        setIsAuthModalOpen(false);
        navigate(resolvedRole === 'Shopkeeper' ? '/dashboard' : '/home');
      }
    } catch (err) {
      // Map Firebase error codes to readable messages
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use')      setAuthError('This email is already registered. Try logging in.');
      else if (code === 'auth/invalid-email')        setAuthError('Please enter a valid email address.');
      else if (code === 'auth/weak-password')        setAuthError('Password must be at least 6 characters.');
      else if (code === 'auth/user-not-found')       setAuthError('No account found for this email.');
      else if (code === 'auth/wrong-password')       setAuthError('Incorrect password. Please try again.');
      else if (code === 'auth/invalid-credential')   setAuthError('Invalid email or password.');
      else                                           setAuthError(err.message || 'Something went wrong. Try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthSubmitting(true);
    setAuthError('');
    try {
      const resolvedRole = await loginWithGoogle(role);
      setIsAuthModalOpen(false);
      navigate(resolvedRole === 'Shopkeeper' ? '/dashboard' : '/home');
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed. Please try again.');
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError('Google Sign-In is not enabled in Firebase Console.');
      } else {
        setAuthError(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const stats = [
    { value: '10,000+', label: 'Style Lovers', description: 'Active renters & listing partners' },
    { value: '5,000+', label: 'Designer Fits', description: 'Premium outfits listed for rent' },
    { value: '50+', label: 'Fashion Hubs', description: 'Hyperlocal boutique clusters' },
    { value: 'Insured', label: 'Fit Guarantee', description: 'Dry-cleaned outfits & damage coverage' }
  ];

  const steps = [
    {
      num: "01",
      title: "Sign up as Renter or Partner",
      desc: "Create your account in seconds and choose your default style role.",
      icon: UserCheck
    },
    {
      num: "02",
      title: "List Wardrobe or Request Fits",
      desc: "Boutiques/owners upload designer outfits; renters search for the perfect size & look.",
      icon: Compass
    },
    {
      num: "03",
      title: "Connect & Align Details",
      desc: "Coordinate sizes, fitting parameters, and rental duration securely on our platform.",
      icon: ArrowRightLeft
    },
    {
      num: "04",
      title: "Rent with Dry-Cleaning Included",
      desc: "Receive freshly dry-cleaned outfits, rock your event, and return them easily.",
      icon: ShieldCheck
    }
  ];

  const whyChooseUs = [
    {
      title: "Verified Closets & Boutiques",
      desc: "Every listing partner and rental boutique is identity-checked to ensure high-quality, authentic outfits."
    },
    {
      title: "Dry-Cleaning & Fit Insurance",
      desc: "All garments are professionally dry-cleaned before delivery. Fit protection covers accidental minor stains."
    },
    {
      title: "Tailored Fashion Dashboards",
      desc: "Custom views for Renters to track booking dates, and Partners/Shopkeepers to audit closet earnings."
    },
    {
      title: "Monetize Unused Wardrobes",
      desc: "List luxury wedding gowns, designer suits, or rare streetwear that are otherwise sitting idle."
    },
    {
      title: "Instant Fitting Coordination",
      desc: "Chat securely to double-check shoulder widths, waist sizes, and coordinate local boutique pickups."
    }
  ];

  const testimonials = [
    {
      text: "Super smooth experience renting a wedding sherwani instantly! It came freshly dry-cleaned and fit perfectly.",
      name: "Rahul Sharma",
      role: "Renter",
      rating: 5,
      avatar: "RS"
    },
    {
      text: "Great platform to earn passive income from my boutique's tuxedos. Listed them and they are rented out every weekend.",
      name: "Priyesh Mehta",
      role: "Shopkeeper",
      rating: 5,
      avatar: "PM"
    },
    {
      text: "Rented a rare streetwear jacket for a video shoot. Saved tons of money instead of buying a hype grail!",
      name: "Tanya Kapoor",
      role: "Renter",
      rating: 5,
      avatar: "TK"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-between gradient-mesh font-sans">
      
      {/* ── Navbar — matches post-login two-bar style ── */}
      <header className="w-full sticky top-0 z-40 hidden md:flex md:flex-col" style={{boxShadow:'0 1px 6px rgba(0,0,0,0.10)'}}>

        {/* Layer 1: Dark top utility bar */}
        <div style={{backgroundColor:'#111111', borderBottom:'1px solid #2a2a2a'}}>
          <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between">
            <div className="flex items-center gap-2 px-2 py-1">
              <span style={{color:'#8B1A2F', fontWeight:900, fontSize:'0.85rem', letterSpacing:'0.15em'}}>
                DRIP<span style={{color:'#ffffff'}}>X</span>
              </span>
              <span style={{width:1, height:14, background:'#444', display:'inline-block', margin:'0 6px'}} />
              <span style={{color:'#aaaaaa', fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase'}}>
                RENTAL CO.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="mailto:abcddtherate@gmail.com" style={{color:'#aaaaaa', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:5, textDecoration:'none'}} title="Support: Kuldeep Shrivastava (abcddtherate@gmail.com)">
                <Mail style={{width:13, height:13, color:'#10b981'}} />
                Need Help? Kuldeep Shrivastava
              </a>
              <span style={{color:'#aaaaaa', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:5}}>
                ◎ Select Location
              </span>
            </div>
          </div>
        </div>

        {/* Layer 2: White bottom navigation bar */}
        <div style={{backgroundColor:'#ffffff', borderBottom:'1px solid #e8e3dd'}}>
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">

            {/* Nav links */}
            <nav className="flex items-center h-full">
              {[
                { label: 'HOME' },
                { label: 'GARMENTS' },
                { label: 'JEWELRY' },
                { label: 'ACCESSORIES' },
                { label: 'MENSWEAR' },
                { label: 'DESIGNERS' },
                { label: 'PRIME' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  style={{
                    height:'100%', display:'flex', alignItems:'center', padding:'0 14px',
                    fontSize:'0.625rem', fontWeight:800, letterSpacing:'0.12em',
                    textTransform:'uppercase', cursor:'pointer', border:'none',
                    background:'transparent', color:'#222222', transition:'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#8B1A2F'}
                  onMouseLeave={e => e.currentTarget.style.color = '#222222'}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Login / Signup CTA */}
            <button
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              style={{
                display:'flex', alignItems:'center', gap:6,
                background:'#8B1A2F', color:'#ffffff',
                fontWeight:800, padding:'6px 18px', borderRadius:8,
                fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.12em',
                border:'none', cursor:'pointer', transition:'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#6b0820'}
              onMouseLeave={e => e.currentTarget.style.background = '#8B1A2F'}
            >
              <LogIn style={{width:13, height:13}} />
              Login / Signup
            </button>
          </div>
        </div>
      </header>

      {/* Mobile landing header */}
      <div className="md:hidden flex justify-between items-center" style={{backgroundColor:'#111111', borderBottom:'1px solid #2a2a2a', padding:'12px 20px', position:'sticky', top:0, zIndex:40}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <span style={{color:'#8B1A2F', fontWeight:900, fontSize:'1.1rem', letterSpacing:'0.15em'}}>DRIP<span style={{color:'#fff'}}>X</span></span>
          <span style={{color:'#888', fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase'}}>RENTAL CO.</span>
        </div>
        <button
          onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
          style={{display:'flex', alignItems:'center', gap:6, background:'#8B1A2F', color:'#ffffff', fontWeight:800, padding:'7px 14px', borderRadius:8, fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', border:'none', cursor:'pointer'}}
        >
          <LogIn style={{width:13, height:13}} />
          Login
        </button>
      </div>

      {/* Background Blurs */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[15%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pt-24 md:pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-1.5 mb-8 animate-float shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-neonGreen fill-neonGreen" />
          <span className="text-[10px] md:text-xs uppercase tracking-widest font-extrabold text-neutral-200">
            DripX Fashion Rental Network
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-none uppercase max-w-6xl">
          Elevate Every Occasion <br />
          with <span className="text-gradient-premium">Premium Fashion Rentals.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-400 text-base md:text-xl max-w-3xl mb-12 font-medium leading-relaxed">
          Welcome to <span className="text-white font-extrabold tracking-widest text-gradient-premium">DRIPX</span> — a hyperlocal, premium fashion rental ecosystem. Discover designer outfits, wedding wear, and elite streetwear near you, or list your closet to monetize your style statement.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mb-12 px-4">
          <button 
            onClick={() => openAuthWithRole('Renter')}
            className="flex-1 bg-neonGreen hover:bg-emerald-400 text-black font-extrabold text-sm tracking-wider uppercase px-8 py-4.5 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Rent Your Style
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => openAuthWithRole('Shopkeeper')}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-extrabold text-sm tracking-wider uppercase px-8 py-4.5 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Become Partner
          </button>
        </div>

        {/* Trust Line */}
        <div className="flex flex-col items-center gap-2 text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </span>
            <span className="text-white">Trusted by thousands of users</span>
          </div>
          <span>Trusted by thousands for safe and dry-cleaned fashion rentals</span>
        </div>

      </section>

      {/* ==================== 2. STATS SECTION ==================== */}
      <section className="relative py-16 px-6 bg-neutral-950/60 border-y border-neutral-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl p-6 text-center border border-neutral-900 hover:border-neutral-800 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="block text-white font-black text-4xl md:text-5xl tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </span>
                <span className="block text-xs font-black uppercase text-neonGreen tracking-widest mb-1">
                  {stat.label}
                </span>
                <span className="block text-[11px] text-neutral-500 font-semibold leading-relaxed">
                  {stat.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. ABOUT SECTION ==================== */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 text-left">
            <span className="text-xs uppercase tracking-widest text-neonGreen font-black block mb-3">
              About The Ecosystem
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
              Connecting Wardrobes, <br />Not Just Products
            </h2>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8">
              DripX is a next-gen fashion rental ecosystem where users can rent premium clothing they need and shopkeepers or wardrobe owners can monetize unused apparel effortlessly. Rather than buying luxury wear or streetwear for one-off occasions, we connect local boutiques and style lovers to share fits sustainably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => openAuthWithRole('Renter')}
                className="bg-neonGreen text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
              >
                Join the Platform
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Speed Card */}
            <div className="glass-panel border-neutral-900 rounded-3xl p-6 text-left hover:border-blue-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-white font-extrabold text-sm uppercase mb-2 tracking-wide">Instant Fitting</h4>
              <p className="text-neutral-400 text-xs leading-relaxed font-semibold">
                Get fits delivered dry-cleaned and ready-to-wear quickly, with local boutique pickups.
              </p>
            </div>

            {/* Trust Card */}
            <div className="glass-panel border-neutral-900 rounded-3xl p-6 text-left hover:border-purple-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-white font-extrabold text-sm uppercase mb-2 tracking-wide">Insured Fits</h4>
              <p className="text-neutral-400 text-xs leading-relaxed font-semibold">
                KYC-verified style lovers, minor damage fit assurance, and dry-cleaning guarantees.
              </p>
            </div>

            {/* Affordability Card */}
            <div className="glass-panel border-neutral-900 rounded-3xl p-6 text-left hover:border-amber-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                <BadgePercent className="w-5 h-5" />
              </div>
              <h4 className="text-white font-extrabold text-sm uppercase mb-2 tracking-wide">Zero Ownership Waste</h4>
              <p className="text-neutral-400 text-xs leading-relaxed font-semibold">
                Wear the future, return the present. Reduce garment wastes by renting instead of buying for single events.
              </p>
            </div>

            {/* Convenience Card */}
            <div className="glass-panel border-neutral-900 rounded-3xl p-6 text-left hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-white font-extrabold text-sm uppercase mb-2 tracking-wide">Boutique Payouts</h4>
              <p className="text-neutral-400 text-xs leading-relaxed font-semibold">
                Turn wedding sherwanis, luxury suits, or hype streetwear into recurring wardrobe revenue.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== 4. ROLE BASED SECTION (CORE) ==================== */}
      <section className="py-24 px-6 bg-neutral-950/60 border-y border-neutral-900 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-neonGreen font-black block mb-3">
              Core Platform Roles
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              One Marketplace, Custom Experiences
            </h2>
            <p className="text-neutral-500 text-sm max-w-xl mx-auto mt-4 font-semibold uppercase tracking-wider">
              Choose your profile state to unlock specific dashboard features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Renter Card */}
            <div 
              onClick={() => openAuthWithRole('Renter')}
              className="group cursor-pointer glass-panel border border-neutral-900 rounded-3xl p-8 hover:border-blue-500/40 border-gradient-premium-hover transition-all duration-300 text-left flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-white text-2xl font-black uppercase mb-3 tracking-wide">
                  I am a Renter
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                  Find designer outfits, wedding wear, or rare streetwear for short-term use. Access luxury wardrobes and boutique collections near you.
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl mt-8 flex items-center gap-2 w-fit transition-all cursor-pointer">
                Rent Your Style
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Shopkeeper Card */}
            <div 
              onClick={() => openAuthWithRole('Shopkeeper')}
              className="group cursor-pointer glass-panel border border-neutral-900 rounded-3xl p-8 hover:border-emerald-500/40 border-gradient-premium-hover transition-all duration-300 text-left flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-white text-2xl font-black uppercase mb-3 tracking-wide">
                  I am a Partner
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                  Monetize your boutique inventory or personal wardrobe. Track bookings, coordinate sizes, audit fit tickets, and handle payouts securely.
                </p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl mt-8 flex items-center gap-2 w-fit transition-all cursor-pointer">
                Become Partner
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== 5. HOW IT WORKS ==================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-neonGreen font-black block mb-3">
            Workflow Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            How It Works
          </h2>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto mt-4 font-semibold uppercase tracking-wider">
            Our step-by-step framework connects boutiques and renters safely.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Visual Timeline Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-start text-left group">
                {/* Step Indicator and Icon */}
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neonGreen group-hover:bg-neonGreen group-hover:text-black transition-all duration-300 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-neutral-800 group-hover:text-neutral-700 transition-colors">
                    {step.num}
                  </span>
                </div>
                
                {/* Step Text details */}
                <h4 className="text-white font-extrabold text-base uppercase mb-2 tracking-wide">
                  {step.title}
                </h4>
                <p className="text-neutral-400 text-xs leading-relaxed max-w-xs font-semibold">
                  {step.desc}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* ==================== 6. WHY CHOOSE US ==================== */}
      <section className="py-24 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 text-left">
            <span className="text-xs uppercase tracking-widest text-neonGreen font-black block mb-3">
              Platform Security
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              Platform Focus
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              We focus on building secure bonds between style lovers. No inventory overheads, just a pure trust-based ecosystem designed to make garment sharing safe.
            </p>
            <div className="hidden lg:block w-36 h-36 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-emerald-500/20 rounded-full blur-2xl" />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4 text-left">
            {whyChooseUs.map((item, idx) => (
              <div 
                key={idx}
                className="glass-panel border-neutral-900 hover:border-neutral-800 p-5 rounded-2xl flex items-start gap-4 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-neonGreen/10 border border-neonGreen/20 flex items-center justify-center shrink-0 text-neonGreen mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase mb-1 tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-neutral-400 text-xs leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================== 7. TESTIMONIALS ==================== */}
      <section className="py-24 px-6 bg-neutral-950/40 border-t border-neutral-900/60 backdrop-blur-md relative">
        <div className="max-w-4xl mx-auto text-center">
          
          <span className="text-xs uppercase tracking-widest text-neonGreen font-black block mb-3">
            Ecosystem Feedback
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-16">
            Style Community Reviews
          </h2>

          {/* Testimonial Panel Slider */}
          <div className="relative glass-panel border-neutral-900 rounded-3xl p-8 md:p-12 text-center min-h-[220px] flex flex-col justify-between max-w-2xl mx-auto overflow-hidden">
            
            <div className="absolute top-6 left-6 text-neutral-800 pointer-events-none">
              <Quote className="w-12 h-12 rotate-180 opacity-40 fill-current" />
            </div>

            {/* Active Testimonial Content */}
            <div className="flex flex-col items-center">
              
              {/* Rating stars */}
              <div className="flex items-center gap-1 text-yellow-400 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-white text-base md:text-lg italic font-medium leading-relaxed max-w-xl mb-8 relative z-10">
                "{testimonials[activeTestimonial].text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-xs">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <h4 className="text-white text-xs uppercase font-extrabold tracking-wide">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-neonGreen">
                    {testimonials[activeTestimonial].role}
                  </span>
                </div>
              </div>

            </div>

            {/* Slider Nav Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={handlePrevTestimonial}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neonGreen hover:text-neonGreen text-neutral-400 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextTestimonial}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neonGreen hover:text-neonGreen text-neutral-400 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeTestimonial === idx ? 'bg-neonGreen w-6' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ==================== 8. FINAL CTA SECTION ==================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="glass-panel border-neutral-900 rounded-3xl p-10 md:p-16 text-center max-w-5xl mx-auto relative overflow-hidden bg-gradient-premium border-gradient-premium">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 leading-none">
            Ready to Upgrade Your Style Sustainably?
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
            Join the fashion rental ecosystem today. Rent premium fits nearby, or become a partner and monetize your closet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button 
              onClick={() => openAuthWithRole('Renter')}
              className="bg-neonGreen hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider py-4 px-8 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
            >
              Rent Your Style
            </button>
            <button 
              onClick={() => openAuthWithRole('Shopkeeper')}
              className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all cursor-pointer"
            >
              Become Partner
            </button>
          </div>
        </div>
      </section>

      {/* Modern Authentication Modal (Glassmorphism + Neon Styling) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-2xl z-10 glass-panel">
            
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-500 hover:text-white font-black text-lg p-1 cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Heading & Tab Toggles */}
            <div className="flex flex-col items-center mb-6">
              {/* Logo & Name on Auth Dialog */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-neonGreen to-emerald-400 text-black font-extrabold px-2.5 py-0.5 rounded-lg text-xs tracking-wider shadow-[0_0_8px_rgba(99,102,241,0.2)]">
                  DRIP X
                </span>
                <span className="text-white font-bold text-[9px] tracking-widest uppercase opacity-75">
                  AUTHENTICATION
                </span>
              </div>
              <span className="bg-neonGreen/10 border border-neonGreen/20 text-neonGreen font-bold px-3 py-1 rounded text-[10px] uppercase mb-4 tracking-widest">
                Authentication Required
              </span>
              <div className="flex bg-neutral-900 p-1 rounded-xl w-full border border-neutral-850">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-neonGreen text-black shadow-md font-extrabold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-neonGreen text-black shadow-md font-extrabold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              
              {authMode === 'signup' && (
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-neonGreen" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kuldeep Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kuldeep@dripx.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neon-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-neonGreen" />
                  Secure Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neon-input text-xs"
                />
              </div>

              {/* Role Switcher */}
              <div className="flex flex-col gap-1.5 mt-2 text-left">
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Select Profile Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Renter')}
                    className={`py-2.5 rounded-xl border text-[10px] uppercase font-extrabold tracking-widest transition-all cursor-pointer ${
                      role === 'Renter'
                        ? 'border-neonGreen bg-neonGreen/10 text-white'
                        : 'border-neutral-850 bg-neutral-900/40 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Renter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Shopkeeper')}
                    className={`py-2.5 rounded-xl border text-[10px] uppercase font-extrabold tracking-widest transition-all cursor-pointer ${
                      role === 'Shopkeeper'
                        ? 'border-neonGreen bg-neonGreen/10 text-white'
                        : 'border-neutral-850 bg-neutral-900/40 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Shopkeeper
                  </button>
                </div>
              </div>

              {/* Error message */}
              {authError && (
                <div style={{background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:10, padding:'10px 14px', fontSize:'0.75rem', color:'#dc2626', fontWeight:600, lineHeight:1.4}}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full bg-neonGreen text-black font-extrabold text-xs py-3.5 rounded-xl mt-4 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.55)] transition-all uppercase tracking-widest cursor-pointer"
                style={authSubmitting ? {opacity:0.7, cursor:'not-allowed'} : {}}
              >
                {authSubmitting
                  ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...')
                  : (authMode === 'login' ? 'Confirm Login ⚡' : 'Register Account ⚡')}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-[1px] bg-neutral-850" />
                <span className="text-[9px] text-neutral-500 font-extrabold tracking-widest uppercase">OR CONTINUE WITH</span>
                <div className="flex-1 h-[1px] bg-neutral-850" />
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={authSubmitting}
                className="w-full bg-white hover:bg-neutral-100 text-black font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-3 border border-neutral-200 transition-all uppercase tracking-widest cursor-pointer"
                style={authSubmitting ? {opacity:0.7, cursor:'not-allowed'} : {}}
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.84c2.25-2.07 3.615-5.12 3.615-8.44z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.84-3c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-5.01H1.32v3.1c2 3.97 6.1 6.66 10.68 6.66z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.24a7.12 7.12 0 0 1 0-4.48V6.66H1.32a11.96 11.96 0 0 0 0 10.68l3.92-3.1z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.42 0 3.32 2.69 1.32 6.66l3.92 3.1c.95-2.88 3.61-5.01 6.76-5.01z"
                  />
                </svg>
                Google
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
