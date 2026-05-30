import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedOccasion,
  setSelectedOccasion,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  resetFilters,
  totalResults,
  selectedGender,
  setSelectedGender
}) {
  const occasions = ["All", "Wedding", "Party", "Formal"];
  const sizes = ["All", "S", "M", "L", "XL"];
  const sections = [
    { value: "All", label: "All Collection" },
    { value: "Men", label: "Men's Wear" },
    { value: "Women", label: "Women's Wear" }
  ];

  const BURGUNDY = '#8B1A2F';
  const label = { fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'#8c7e76', fontWeight:700, display:'block', marginBottom:6 };
  const pill = (active) => ({
    fontSize:'0.7rem', padding:'7px 14px', borderRadius:10,
    border: active ? `1px solid ${BURGUNDY}` : '1px solid #e0d8d0',
    background: active ? BURGUNDY : '#ffffff',
    color: active ? '#ffffff' : '#3d342c',
    fontWeight:700, cursor:'pointer', transition:'all 0.2s'
  });

  return (
    <div style={{background:'#ffffff', border:'1px solid #e8e2dc', borderRadius:16, padding:20, display:'flex', flexDirection:'column', gap:20, position:'sticky', top:96, boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
      
      {/* Sidebar Header */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:14, borderBottom:'1px solid #e8e2dc'}}>
        <div style={{display:'flex', alignItems:'center', gap:7}}>
          <SlidersHorizontal style={{width:15, height:15, color:BURGUNDY}} />
          <h2 style={{color:'#1a1614', fontWeight:800, fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', margin:0}}>
            Filter Closet
          </h2>
        </div>
        <button 
          onClick={resetFilters}
          style={{fontSize:'0.6rem', textTransform:'uppercase', fontWeight:700, letterSpacing:'0.08em', color:'#8c7e76', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'color 0.2s'}}
          onMouseEnter={e => e.currentTarget.style.color = BURGUNDY}
          onMouseLeave={e => e.currentTarget.style.color = '#8c7e76'}
          title="Reset All Filters"
        >
          <RotateCcw style={{width:11, height:11}} />
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        <label style={label}>Search Drip</label>
        <div style={{position:'relative'}}>
          <input 
            type="text"
            placeholder="Sherwani, Techwear, Tux..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{width:'100%', paddingLeft:36, paddingRight:14, paddingTop:10, paddingBottom:10, borderRadius:10, background:'#faf8f5', border:'1px solid #e0d8d0', outline:'none', fontSize:'0.8rem', color:'#1a1614', transition:'border-color 0.2s'}}
            onFocus={e => e.target.style.borderColor = BURGUNDY}
            onBlur={e => e.target.style.borderColor = '#e0d8d0'}
          />
          <Search style={{width:14, height:14, color:'#a89e95', position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}} />
        </div>
      </div>

      {/* Target Section */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        <label style={label}>Target Section</label>
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          {sections.map((sec) => (
            <button
              key={sec.value}
              onClick={() => setSelectedGender(sec.value)}
              style={{...pill(selectedGender === sec.value), textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px'}}
            >
              <span>{sec.label}</span>
              {selectedGender === sec.value && <span style={{width:6, height:6, borderRadius:'50%', background:'#ffffff', display:'inline-block'}} />}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        <label style={label}>Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{width:'100%', padding:'9px 12px', borderRadius:10, background:'#faf8f5', border:'1px solid #e0d8d0', fontSize:'0.8rem', color:'#1a1614', cursor:'pointer', outline:'none'}}
          onFocus={e => e.target.style.borderColor = BURGUNDY}
          onBlur={e => e.target.style.borderColor = '#e0d8d0'}
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Occasion */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        <label style={label}>Occasion</label>
        <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
          {occasions.map((occ) => (
            <button key={occ} onClick={() => setSelectedOccasion(occ)} style={pill(selectedOccasion === occ)}>
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        <label style={label}>Available Size</label>
        <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
          {sizes.map((sz) => (
            <button key={sz} onClick={() => setSelectedSize(sz)} style={pill(selectedSize === sz)}>
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <label style={{...label, marginBottom:0}}>Max Rent Price</label>
          <span style={{color:BURGUNDY, fontWeight:800, fontSize:'0.85rem'}}>₹{priceRange}</span>
        </div>
        <input 
          type="range"
          min="400" max="3000" step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          style={{width:'100%', accentColor: BURGUNDY, cursor:'pointer'}}
        />
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem', color:'#8c7e76', fontWeight:700}}>
          <span>₹400</span>
          <span>₹3,000</span>
        </div>
      </div>

      {/* Results badge */}
      <div style={{marginTop:4, paddingTop:14, borderTop:'1px solid #e8e2dc', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'0.6rem', color:'#8c7e76', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em'}}>Closet Size</span>
        <span style={{color:'#1a1614', background:'#f5f1ec', border:'1px solid #e8e2dc', padding:'3px 10px', borderRadius:6, fontSize:'0.65rem', fontWeight:800}}>
          {totalResults} Items
        </span>
      </div>
    </div>
  );
}
