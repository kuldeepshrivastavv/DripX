import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import MockMap from '../components/MockMap';
import ProductCard from '../components/ProductCard';
import { Star, MapPin, Compass, Store, Navigation } from 'lucide-react';

export default function MapPage() {
  const { shops, outfits, userLocation, userLocationLoading, detectUserLocation } = useApp();
  
  // Set default active shop to the first one in mockData
  const [activeShopId, setActiveShopId] = useState(shops[0]?.id || 101);

  // Grab active shop details
  const activeShop = shops.find(s => s.id === activeShopId);

  // Filter outfits belonging to this shop
  const shopOutfits = outfits.filter(o => o.shopId === activeShopId);

  // Auto-align active shop to the closest store when geolocation sorting occurs
  useEffect(() => {
    if (shops && shops.length > 0) {
      if (!shops.some(s => s.id === activeShopId)) {
        setActiveShopId(shops[0].id);
      }
    }
  }, [shops]);

  return (
    <div className="min-h-screen bg-black py-8 px-6 max-w-7xl mx-auto w-full relative">
      
      {/* Page Title */}
      <div className="mb-8 pb-6 border-b border-neutral-900">
        <span className="text-neonGreen text-xs font-extrabold uppercase tracking-widest block mb-1">
          Hyperlocal Wardrobe Delivery
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase m-0">
          Shops Nearby
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Grid Section: Shop Selection Sidebar (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4 max-h-[320px] md:max-h-[450px] overflow-y-auto pr-2">
          
          <div className="glass-panel border-neutral-900 rounded-2xl p-4 sticky top-0 bg-neutral-950/95 z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-wider text-neutral-400">
                Curated Fulfillment Partners
              </span>
              <span className="bg-neonGreen/10 border border-neonGreen/30 text-neonGreen text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                {shops.length} Active hubs
              </span>
            </div>

            {/* Geolocation trigger */}
            <button
              onClick={detectUserLocation}
              disabled={userLocationLoading}
              className="w-full bg-neonGreen/10 hover:bg-neonGreen/20 border border-neonGreen/30 text-neonGreen text-[10px] font-black uppercase tracking-widest py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${userLocationLoading ? 'animate-spin' : ''}`} />
              {userLocationLoading 
                ? 'Detecting Location...' 
                : userLocation 
                ? `Nearby: ${userLocation.name}` 
                : 'Suggest Nearby Stores'}
            </button>
          </div>

          {shops.map((shop) => {
            const isActive = activeShopId === shop.id;
            return (
              <div
                key={shop.id}
                onClick={() => setActiveShopId(shop.id)}
                className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isActive 
                    ? 'border-neonGreen/60 bg-neonGreen/[0.02] shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'border-neutral-900 hover:border-neutral-700/60'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className={`font-bold text-base transition-colors uppercase tracking-wide ${isActive ? 'text-neonGreen' : 'text-white'}`}>
                    {shop.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 text-[10px] font-extrabold text-white px-2 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-neonGreen text-neonGreen" />
                    {shop.rating}
                  </div>
                </div>
                
                <p className="text-neutral-400 text-xs leading-normal mb-3 line-clamp-1">
                  {shop.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold uppercase tracking-wider pt-2 border-t border-neutral-900/60">
                  <span className="flex items-center gap-1 text-white/80">
                    <MapPin className="w-3.5 h-3.5 text-neonGreen" />
                    {shop.distance}
                  </span>
                  <span>
                    📍 View on map
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Grid Section: Interactive SVGMockMap Dashboard (7 columns) */}
        <div className="lg:col-span-7">
          <MockMap 
            shops={shops} 
            activeShopId={activeShopId} 
            onSelectShop={setActiveShopId} 
          />
        </div>

      </div>

      {/* Boutique Inventory Section (Displays below map) */}
      {activeShop && (
        <section className="pt-8 border-t border-neutral-900">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-neonGreen text-xs font-extrabold uppercase tracking-widest block mb-1">
                Active Vault Inventory
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide m-0">
                Fit closet inside {activeShop.name}
              </h2>
            </div>
            <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
              <Store className="w-4 h-4 text-neonGreen" />
              {shopOutfits.length} Exclusive rentals available
            </span>
          </div>

          {shopOutfits.length === 0 ? (
            <div className="glass-panel border-dashed border border-neutral-800 rounded-3xl p-10 text-center text-neutral-500">
              No active listings registered for this hub. Check other stores!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shopOutfits.map((outfit) => (
                <ProductCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          )}

        </section>
      )}

    </div>
  );
}
