import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, ShieldAlert, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { outfits, addBooking, shops, user } = useApp();

  // Find target outfit
  const outfit = outfits.find(o => String(o.id) === String(id));

  // Find shop details for pickup address lookup
  const shopObj = shops?.find(s => String(s.id) === String(outfit?.shopId) || s.name === outfit?.shop);
  const shopAddress = shopObj ? shopObj.address : (outfit ? outfit.shop : 'Store Hub');

  // Preselected fulfillment mode check (passed via detail buttons router state)
  const preselectedType = location.state?.preselectedType || 'none';

  // Booking states
  const [fulfillmentType, setFulfillmentType] = useState('Pickup'); // 'Pickup' | 'Delivery'
  const [timingType, setTimingType] = useState('ASAP'); // 'ASAP' | 'Scheduled'
  
  // Date/Time values
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('12:00 PM');
  
  // Address parameters
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Booking success flag
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState('');

  useEffect(() => {
    if (preselectedType === 'pickup') {
      setFulfillmentType('Pickup');
    } else if (preselectedType === 'delivery') {
      setFulfillmentType('Delivery');
    }
  }, [preselectedType]);

  // Redirect shopkeepers since they shouldn't book items
  useEffect(() => {
    if (user && user.role !== 'Renter') {
      navigate('/home');
    }
  }, [user, navigate]);

  if (!outfit) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-white text-2xl font-extrabold uppercase mb-2">Fits Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6">The item you want to book is missing.</p>
        <Link to="/home" className="bg-neonGreen text-black font-extrabold px-6 py-3 rounded-xl">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Cost configurations
  const baseRent = outfit.price;
  const insuranceFee = 99; // Standard stain coverage
  const deliveryFee = fulfillmentType === 'Delivery' ? 150 : 0;
  const totalCharge = baseRent + insuranceFee + deliveryFee;

  const handleCheckout = (e) => {
    e.preventDefault();

    // Setup checkout log object
    const finalAddress = fulfillmentType === 'Delivery' 
      ? `${deliveryAddress}, PIN: ${postalCode}` 
      : `${shopAddress} (${outfit.shop} Self-Pickup)`;

    const bookingPayload = {
      outfitId: outfit.id,
      outfitTitle: outfit.title,
      outfitImage: outfit.image,
      price: outfit.price,
      shop: outfit.shop,
      bookingDate: selectedDate,
      bookingTime: timingType === 'ASAP' ? 'ASAP (within 45 mins)' : selectedTime,
      type: fulfillmentType,
      deliveryFee: deliveryFee,
      address: finalAddress,
    };

    // Run simulated context insertion
    addBooking(bookingPayload);
    
    // Trigger success overlay screen
    const mockId = `DX-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedBookingId(mockId);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-black py-8 px-6 max-w-7xl mx-auto w-full relative">
      
      {/* Success Modal Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border-neonGreen/30 rounded-3xl p-8 max-w-md w-full text-center neon-glow-strong animate-float">
            
            <div className="w-16 h-16 rounded-2xl bg-neonGreen/10 border border-neonGreen/30 flex items-center justify-center mx-auto mb-6 text-neonGreen">
              <CheckCircle2 className="w-10 h-10 fill-current text-black stroke-neonGreen stroke-2" />
            </div>

            <span className="text-neonGreen text-xs font-extrabold uppercase tracking-widest block mb-1">
              Booking Complete
            </span>
            <h2 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-2">
              Drip Locked In!
            </h2>
            <p className="text-neutral-400 text-xs mb-6">
              Your rental ticket has been logged locally under ID <strong className="text-white">{generatedBookingId}</strong>. The boutique is preparing your outfit.
            </p>

            {/* Receipt Box */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 mb-8 text-left text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-bold uppercase">Outfit</span>
                <span className="text-white font-semibold line-clamp-1">{outfit.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-bold uppercase">Mode</span>
                <span className="text-neonGreen font-semibold">{fulfillmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-bold uppercase">Estimated Timing</span>
                <span className="text-white font-semibold">
                  {timingType === 'ASAP' ? 'ASAP (Next 45 Mins)' : `${selectedDate} @ ${selectedTime}`}
                </span>
              </div>
              <div className="border-t border-neutral-900 pt-2 flex justify-between font-bold text-sm">
                <span className="text-neutral-400 uppercase">Paid amount</span>
                <span className="text-white">₹{totalCharge}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(user?.role === 'Shopkeeper' ? '/dashboard' : '/home')}
              className="w-full bg-neonGreen text-black font-extrabold text-sm py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            >
              {user?.role === 'Shopkeeper' ? 'Go to Dashboard' : 'View Bookings'}
            </button>

          </div>
        </div>
      )}

      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 text-sm font-semibold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 text-neonGreen" />
        Cancel Checkout
      </button>

      <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-8 pb-4 border-b border-neutral-900">
        Simulate Checkout
      </h1>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form details (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Fulfillment Selection Block */}
          <div className="glass-panel border-neutral-900 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neonGreen" />
              1. Choose Fulfillment Mode
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFulfillmentType('Pickup')}
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${
                  fulfillmentType === 'Pickup'
                    ? 'border-neonGreen bg-neonGreen/5 text-white'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase text-xs">P2P Hub Pickup</span>
                  <input 
                    type="radio" 
                    checked={fulfillmentType === 'Pickup'} 
                    readOnly
                    className="accent-neonGreen"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 leading-normal">
                  Pickup yourself from <strong className="text-neutral-300">{outfit.shop}</strong> (0.8km away). Instant fulfillment, ₹0 fee.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('Delivery')}
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${
                  fulfillmentType === 'Delivery'
                    ? 'border-neonGreen bg-neonGreen/5 text-white'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase text-xs">Doorstep Delivery</span>
                  <input 
                    type="radio" 
                    checked={fulfillmentType === 'Delivery'} 
                    readOnly
                    className="accent-neonGreen"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 leading-normal">
                  Fast hyper-courier delivery to your house coordinate inside 45 mins. ₹150 delivery fee.
                </span>
              </button>
            </div>

            {/* Delivery address details (Conditional) */}
            {fulfillmentType === 'Delivery' && (
              <div className="mt-6 pt-6 border-t border-neutral-900 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Delivery Address *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="House No, Street name, Landmark, City"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      PIN Code *
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength="6"
                      placeholder="110001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Mobile Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 99999 88888"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="neon-input text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time Picker Block */}
          <div className="glass-panel border-neutral-900 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neonGreen" />
              2. Select Schedule Timing
            </h3>

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setTimingType('ASAP')}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  timingType === 'ASAP'
                    ? 'bg-neonGreen border-neonGreen text-black shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                ASAP (Within 45 Mins)
              </button>
              <button
                type="button"
                onClick={() => setTimingType('Scheduled')}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  timingType === 'Scheduled'
                    ? 'bg-neonGreen border-neonGreen text-black shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Schedule For Later
              </button>
            </div>

            {timingType === 'Scheduled' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Rental Date *
                  </label>
                  <input 
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="neon-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Fulfillment Time *
                  </label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="neon-input text-xs"
                  >
                    <option value="10:00 AM">10:00 AM (Morning slots)</option>
                    <option value="12:00 PM">12:00 PM (Noon slots)</option>
                    <option value="03:00 PM">03:00 PM (Afternoon slots)</option>
                    <option value="06:30 PM">06:30 PM (Evening slots)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Receipt Summary Card (5 columns) */}
        <div className="lg:col-span-5">
          <div className="glass-panel border-neutral-900 rounded-3xl p-6 sticky top-24 shadow-2xl flex flex-col gap-6">
            
            {/* Header Product description */}
            <div className="flex gap-4 pb-4 border-b border-neutral-900">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{outfit.shop}</span>
                <h4 className="text-white font-extrabold text-sm uppercase leading-tight line-clamp-1 mb-1">{outfit.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-white font-bold px-2 py-0.5 rounded">
                    SIZE {outfit.size}
                  </span>
                  <span className="text-xs text-neonGreen font-extrabold">₹{outfit.price}/day</span>
                </div>
              </div>
            </div>

            {/* Receipt breakdowns */}
            <div className="flex flex-col gap-3.5 text-xs text-neutral-400 border-b border-neutral-900 pb-5">
              <div className="flex justify-between items-center">
                <span>Daily Rental Cost</span>
                <span className="text-white font-bold">₹{baseRent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Drip insurance (Stain insurance)
                  <span className="text-neutral-500 text-[10px]" title="Covers dry-cleaning fits stains and accidental small tears">ⓘ</span>
                </span>
                <span className="text-white font-bold">₹{insuranceFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Fulfillment Fee ({fulfillmentType})</span>
                <span className="text-white font-bold">
                  {deliveryFee > 0 ? `₹${deliveryFee}` : '₹0 (Free Pickup)'}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline font-bold">
              <span className="text-white text-base uppercase tracking-wider">Total Bill</span>
              <div className="text-right">
                <div className="text-2xl md:text-3xl text-neonGreen font-extrabold drop-shadow-[0_0_8px_rgba(99,102,241,0.2)]">
                  ₹{totalCharge}
                </div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-extrabold block mt-0.5">
                  Secure local hold
                </span>
              </div>
            </div>

            {/* Simulated Payment details info */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 text-[10px] text-neutral-400 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-white uppercase text-[9px] tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-neonGreen" />
                Simulated Mock Payment
              </div>
              <p className="leading-relaxed">
                Clicking checkout below bypasses standard gateway validation. All ledger histories are cached inside React local environment state.
              </p>
            </div>

            {/* Confirmation CTA button */}
            <button
              type="submit"
              className="w-full bg-neonGreen text-black font-extrabold text-sm py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-[1.01] transition-all uppercase tracking-wider"
            >
              Confirm Checkout & Rent ⚡
            </button>

          </div>
        </div>

      </form>

    </div>
  );
}
