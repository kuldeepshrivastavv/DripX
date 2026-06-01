import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, MapPin, ArrowLeft, ShieldCheck, Sparkles, Truck, Store, CalendarRange, MessageSquare } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { outfits, shops, user } = useApp();

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsColRef = collection(db, 'reviews');
        const q = query(
          reviewsColRef,
          where('outfitId', '==', String(id))
        );
        const querySnap = await getDocs(q);
        
        const fetchedReviews = [];
        querySnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedReviews.push({
            id: docSnap.id,
            ...data
          });
        });
        
        // Sort by date descending
        fetchedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error loading reviews: ", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Find target outfit
  const outfit = outfits.find(o => String(o.id) === String(id));

  if (!outfit) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-white text-2xl font-extrabold uppercase mb-2">Fits Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6">The clothing item you requested doesn't exist or was de-listed.</p>
        <Link to="/home" className="bg-neonGreen text-black font-extrabold px-6 py-3 rounded-xl">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Find target shop details
  const shopDetails = shops.find(s => String(s.id) === String(outfit.shopId));

  const isAvailable = outfit.status === "Available";

  const handleBookingRedirect = (preselectedType) => {
    // Navigate passing the selected delivery choice in React Router state
    navigate(`/booking/${outfit.id}`, { state: { preselectedType } });
  };

  return (
    <div className="min-h-screen bg-black py-8 px-6 max-w-7xl mx-auto w-full relative">
      
      {/* Back link */}
      <Link 
        to="/home" 
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 text-sm font-semibold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 text-neonGreen" />
        Back to closet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery (5 columns) */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-900 shadow-2xl">
            <img 
              src={outfit.image} 
              alt={outfit.title}
              className="w-full h-full object-cover"
            />
            {/* Sizing Float badge */}
            <span className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-neutral-800">
              SIZE {outfit.size}
            </span>
          </div>

          {/* Drip Guarantees below image */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neonGreen shrink-0" />
              <div className="text-[10px]">
                <span className="font-extrabold text-white block uppercase">Stain Insured</span>
                <span className="text-neutral-500">₹0 stain deductible</span>
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neonGreen shrink-0" />
              <div className="text-[10px]">
                <span className="font-extrabold text-white block uppercase">Surgically Cleansed</span>
                <span className="text-neutral-500">100% dry-cleaned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Spec and Checkout Deck (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          <div>
            {/* Title, rating and availability */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
                isAvailable 
                  ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                ● {outfit.status}
              </span>
              
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Star className="w-4 h-4 fill-neonGreen text-neonGreen" />
                <span>{outfit.rating}</span>
                <span className="text-neutral-500 font-medium">({outfit.reviewsCount} local reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-4 leading-none">
              {outfit.title}
            </h1>

            {/* Price Box */}
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border-neutral-800 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-bold">Rental Charge</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-3xl font-extrabold">₹{outfit.price}</span>
                  <span className="text-neutral-400 text-sm">/ 24 Hours</span>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-right bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 max-w-[140px] font-semibold">
                ♻️ Save 80% vs retail buy price
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-extrabold mb-2">Description</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{outfit.description}</p>
            </div>

            {/* Clothes Specifications list */}
            {outfit.specs && (
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-extrabold mb-2">Outfit Specs</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {outfit.specs.map((spec, i) => (
                    <li key={i} className="text-xs text-neutral-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-neonGreen rounded-full" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shop Details Profile card */}
            {shopDetails && (
              <div className="glass-panel border-neutral-900 rounded-2xl p-4 mb-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-neonGreen block">Fulfillment Center</span>
                    <h4 className="text-white font-extrabold text-base m-0 uppercase tracking-wide">
                      {shopDetails.name}
                    </h4>
                  </div>
                  <span className="bg-neutral-900 border border-neutral-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neonGreen" />
                    {shopDetails.distance} away
                  </span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed mb-2.5">
                  {shopDetails.description}
                </p>
                <div className="text-[10px] text-neutral-500 font-semibold border-t border-neutral-900/60 pt-2 flex items-center gap-1">
                  📍 {shopDetails.address}
                </div>
              </div>
            )}
          </div>

          {/* Core simulated booking portals */}
          <div className="mt-auto border-t border-neutral-900 pt-6">
            {user?.role === 'Shopkeeper' ? (
              <div className="glass-panel border-amber-500/25 bg-amber-500/5 p-5 rounded-2xl text-center">
                <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider block mb-1.5">
                  Boutique Partner Account
                </span>
                <p className="text-neutral-400 text-[11px] leading-relaxed font-semibold">
                  Renting/checkout features are restricted to Renter accounts. Log in with a Renter profile to simulate bookings.
                </p>
              </div>
            ) : isAvailable ? (
              <div className="flex flex-col gap-3">
                {/* Standard Book Now button */}
                <button
                  onClick={() => handleBookingRedirect('none')}
                  className="w-full bg-neonGreen text-black font-extrabold text-sm py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.55)] transition-all hover:scale-[1.01] uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <CalendarRange className="w-4 h-4 stroke-[3]" />
                  Simulate Booking Flow
                </button>

                {/* Pickup and Delivery buttons row */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBookingRedirect('pickup')}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Store className="w-4 h-4 text-neonGreen" />
                    Try P2P Pickup
                  </button>
                  <button
                    onClick={() => handleBookingRedirect('delivery')}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Truck className="w-4 h-4 text-neonGreen animate-bounce" style={{ animationDuration: '3s' }} />
                    Try Door Delivery
                  </button>
                </div>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-500 font-extrabold text-sm py-4 rounded-xl cursor-not-allowed uppercase tracking-wider"
              >
                Fit Already Booked (Rented)
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 border-t border-neutral-900 pt-12 text-left">
        <h3 className="text-xl font-extrabold text-white uppercase tracking-wider mb-8 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-neonGreen" />
          Customer Reviews ({reviews.length})
        </h3>

        {reviewsLoading ? (
          <div className="text-center py-8 text-neutral-500 text-sm font-semibold uppercase tracking-widest">
            Loading Reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-panel border-neutral-900 rounded-2xl p-8 text-center text-neutral-500 text-sm font-semibold">
            No reviews yet for this outfit. Be the first to rent and leave a review!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="glass-panel border-neutral-900 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase font-extrabold text-white block">
                        {review.renterName}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-semibold block mt-0.5">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent Rent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isGold = starVal <= review.rating;
                        return (
                          <Star 
                            key={starVal} 
                            className={`w-3.5 h-3.5 ${
                              isGold ? 'fill-neonGreen text-neonGreen' : 'text-neutral-800'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-neutral-300 text-xs leading-relaxed font-medium">
                    "{review.comment}"
                  </p>
                </div>

                <div className="border-t border-neutral-900/60 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-600 font-extrabold">
                    Verified Rental
                  </span>
                  <span className="text-[10px] text-neonGreen font-extrabold uppercase">
                    ✓ Verified Outfit
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
