import React from 'react';
import { MapPin, Star, Compass } from 'lucide-react';

export default function MockMap({ shops, activeShopId, onSelectShop }) {
  return (
    <div className="relative w-full h-[320px] md:h-[450px] bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between">
      
      {/* Absolute Map Background SVG Grid */}
      <div className="absolute inset-0 bg-grid-glow pointer-events-none" />

      {/* Abstract Street Vector Paths */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 100 Q 200 150 400 100 T 800 200" fill="none" stroke="#6366f1" strokeWidth="2.5" />
        <path d="M 150 0 L 150 600" fill="none" stroke="#6366f1" strokeWidth="1.5" />
        <path d="M 500 0 L 300 600" fill="none" stroke="#6366f1" strokeWidth="1.5" />
        <path d="M 0 350 L 800 300" fill="none" stroke="#6366f1" strokeWidth="2.5" />
        
        {/* Ring nodes decoration */}
        <circle cx="150" cy="115" r="40" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="5,5" />
        <circle cx="500" cy="250" r="60" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="5,5" />
      </svg>

      {/* Futuristic Map Overlay Header */}
      <div className="absolute top-4 left-4 z-10 glass-panel border border-neutral-800 rounded-xl px-3.5 py-1.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neonGreen animate-ping" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">
          HYPERLOCAL DRIP RADAR (3.0KM)
        </span>
      </div>

      {/* Clickable Map Nodes (Shop markers positioned absolutely by percentage) */}
      <div className="absolute inset-0">
        {shops.map((shop) => {
          const isActive = activeShopId === shop.id;
          // Coords map to top/left percent
          const style = {
            left: `${shop.coords.x}%`,
            top: `${shop.coords.y}%`
          };

          return (
            <div 
              key={shop.id}
              style={style}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              onClick={() => onSelectShop(shop.id)}
            >
              {/* Glowing Pulse Ring for active shop */}
              <span className={`absolute -inset-4 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-neonGreen/20 animate-ping border border-neonGreen/30' 
                  : 'bg-transparent group-hover:bg-neutral-800/35 border border-transparent'
              }`} />

              {/* Marker pin */}
              <div className={`relative flex items-center justify-center p-2.5 rounded-full border transition-all duration-300 shadow-lg ${
                isActive 
                  ? 'bg-neonGreen text-black border-neonGreen scale-125 shadow-[0_0_15px_#6366f1]' 
                  : 'bg-black text-neonGreen border-neutral-800 hover:border-neonGreen hover:scale-110'
              }`}>
                <MapPin className="w-4 h-4 fill-current stroke-2" />
              </div>

              {/* Node Title Popover (grows on hover/active) */}
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 whitespace-nowrap glass-panel border border-neutral-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-xl transition-all duration-300 pointer-events-none ${
                isActive 
                  ? 'opacity-100 translate-y-0 scale-100 border-neonGreen/40' 
                  : 'opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
              }`}>
                <span className="text-white font-bold text-[10px] tracking-wide">
                  {shop.name}
                </span>
                <span className="flex items-center gap-0.5 text-neonGreen text-[9px] font-extrabold">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {shop.rating}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Control Grid Bottom bar info */}
      <div className="mt-auto w-full p-4 z-10 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-neonGreen animate-spin" style={{ animationDuration: '10s' }} />
          <span>Interactive Radar Map</span>
        </div>
        <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest">
          Click nodes to filter items
        </span>
      </div>

    </div>
  );
}
