import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BURGUNDY = '#8B1A2F';

export default function ProductCard({ outfit }) {
  const { id, title, price, size, shop, image, rating, occasion, status } = outfit;
  const isAvailable = status === "Available";
  const estimatedRetail = price * 15;

  return (
    <div
      style={{
        position:'relative', background:'#ffffff', borderRadius:18,
        overflow:'hidden', border:'1px solid #e8e2dc',
        display:'flex', flexDirection:'column', height:'100%',
        transition:'all 0.3s ease', boxShadow:'0 2px 8px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,26,47,0.3)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(139,26,47,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e2dc'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Size Badge */}
      <div style={{position:'absolute', top:10, left:10, zIndex:10}}>
        <span style={{background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', color:'#ffffff', fontWeight:800, fontSize:'0.6rem', letterSpacing:'0.1em', padding:'4px 10px', borderRadius:8, textTransform:'uppercase', display:'inline-block'}}>
          SIZE {size}
        </span>
      </div>

      {/* Occasion Badge */}
      <span style={{position:'absolute', top:10, right:10, zIndex:10, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', color:'#f0ece8', fontSize:'0.55rem', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', padding:'4px 10px', borderRadius:8}}>
        {occasion}
      </span>

      {/* Image */}
      <div style={{position:'relative', aspectRatio:'3/4', width:'100%', overflow:'hidden', background:'#f5f1ec'}}>
        <img
          src={image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"}
          alt={title}
          style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', transition:'transform 0.5s ease'}}
          loading="lazy"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* subtle gradient overlay at bottom */}
        <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)', pointerEvents:'none'}} />
        
        {/* Availability dot */}
        {!isAvailable && (
          <div style={{position:'absolute', bottom:10, left:10, background:'rgba(220,38,38,0.85)', color:'#fff', fontSize:'0.55rem', fontWeight:800, padding:'3px 8px', borderRadius:6, letterSpacing:'0.08em', textTransform:'uppercase'}}>
            Rented
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{padding:'14px 16px', display:'flex', flexDirection:'column', flexGrow:1, justifyContent:'space-between', textAlign:'left'}}>
        <div>
          <span style={{fontSize:'0.6rem', color:'#8c7e76', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, display:'block', marginBottom:5}}>
            {shop}
          </span>
          <h3 style={{color:'#1a1614', fontWeight:700, fontSize:'0.82rem', lineHeight:1.35, textTransform:'uppercase', letterSpacing:'0.04em', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:38, transition:'color 0.2s'}}>
            {title}
          </h3>
        </div>

        {/* Pricing & CTA */}
        <div style={{marginTop:14, paddingTop:12, borderTop:'1px solid #ede8e2', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', flexDirection:'column'}}>
            <span style={{fontSize:'0.55rem', color:'#8c7e76', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700, marginBottom:2}}>
              Rental
            </span>
            <div style={{display:'flex', alignItems:'baseline', gap:6}}>
              <span style={{color:'#1a1614', fontWeight:800, fontSize:'1rem'}}>₹{price}</span>
              <span style={{color:'#b0a89e', fontSize:'0.6rem', fontWeight:600}}>MRP ₹{estimatedRetail.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link
            to={`/product/${id}`}
            style={{
              display:'flex', alignItems:'center', gap:5,
              background:'#f5f1ec', border:`1px solid #e0d8d0`,
              color:'#1a1614', fontWeight:800,
              fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.1em',
              padding:'8px 14px', borderRadius:10, textDecoration:'none',
              transition:'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = BURGUNDY; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = BURGUNDY; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f5f1ec'; e.currentTarget.style.color = '#1a1614'; e.currentTarget.style.borderColor = '#e0d8d0'; }}
          >
            Rent Fit
            <ArrowRight style={{width:12, height:12}} />
          </Link>
        </div>
      </div>
    </div>
  );
}
