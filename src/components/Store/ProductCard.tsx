
import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Box, Package, Hash, CircleCheck, Clock, CircleX } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, style }) => {
  // Swipe State
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeSide, setActiveSide] = useState<'none' | 'left' | 'right'>('none');
  
  const touchStart = useRef(0);
  const touchX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const SWIPE_THRESHOLD = 80; // Distance to snap open
  const ACTION_WIDTH = 100; // Width of the revealed action button

  const getStatusConfig = (status: Product['status']) => {
    switch (status) {
      case 'available': 
        return { 
          style: 'bg-green-500/10 text-green-600 border-green-500/20', 
          label: 'Disponible',
          icon: <CircleCheck size={12} strokeWidth={2.5} />
        };
      case 'reserved': 
        return { 
          style: 'bg-amber-500/10 text-amber-600 border-amber-500/20', 
          label: 'Reservado',
          icon: <Clock size={12} strokeWidth={2.5} />
        };
      case 'sold': 
        return { 
          style: 'bg-rose-500/10 text-rose-600 border-rose-500/20', 
          label: 'Vendido',
          icon: <CircleX size={12} strokeWidth={2.5} />
        };
      default: 
        return { 
          style: 'bg-stone-100 text-stone-500 border-stone-200', 
          label: status,
          icon: <CircleCheck size={12} strokeWidth={2.5} />
        };
    }
  };

  const statusConfig = getStatusConfig(product.status);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchX.current = touchStart.current;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStart.current;
    
    // Logic to prevent "sticky" feel if already open
    let finalTranslate = diff;
    if (activeSide === 'left') finalTranslate = ACTION_WIDTH + diff;
    if (activeSide === 'right') finalTranslate = -ACTION_WIDTH + diff;

    setTranslateX(finalTranslate);
    touchX.current = currentX;
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const diff = touchX.current - touchStart.current;
    
    // Snap Logic
    if (diff > SWIPE_THRESHOLD && activeSide !== 'right') {
      setTranslateX(ACTION_WIDTH);
      setActiveSide('left');
    } else if (diff < -SWIPE_THRESHOLD && activeSide !== 'left') {
      setTranslateX(-ACTION_WIDTH);
      setActiveSide('right');
    } else {
      setTranslateX(0);
      setActiveSide('none');
    }
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setActiveSide('none');
  };

  return (
    <div 
      style={style}
      className="group relative bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-white/60 overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
    >
      {/* Background Actions (Revealed on Swipe - Mobile Only) */}
      <div className="absolute inset-0 flex sm:hidden">
        {/* Edit Action (Left) */}
        <button 
          onClick={() => { onEdit(); resetSwipe(); }}
          className={`absolute inset-y-0 left-0 w-[100px] bg-brand-500 text-white flex flex-col items-center justify-center gap-1 transition-opacity ${translateX > 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <Edit2 size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">Editar</span>
        </button>

        {/* Delete Action (Right) */}
        <button 
          onClick={() => { onDelete(); resetSwipe(); }}
          className={`absolute inset-y-0 right-0 w-[100px] bg-rose-500 text-white flex flex-col items-center justify-center gap-1 transition-opacity ${translateX < 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <Trash2 size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">Eliminar</span>
        </button>
      </div>

      {/* Main Content Layer */}
      <div 
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        className="relative z-10 bg-white p-2.5 sm:p-4 flex flex-row items-center gap-3 sm:gap-6 w-full"
      >
        
        {/* Media Section - Fixed Small Thumbnail */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-inner relative">
          <img 
            src={product.imageUrl} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={product.name} 
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          
          {/* Block 1: Main Info & Status Integration */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-stone-50 text-stone-400 rounded-md border border-stone-100">
                  {product.type === 'ave' ? <Box size={9} /> : <Package size={9} />}
                  <span className="text-[7px] font-black uppercase tracking-widest leading-none">
                    {product.type === 'ave' ? 'Ave' : 'Art.'}
                  </span>
                </div>
                {product.type === 'ave' && product.ringNumber && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded-md border border-brand-100/30">
                    <Hash size={9} />
                    <span className="text-[7px] font-black uppercase tracking-widest leading-none">{product.ringNumber}</span>
                  </div>
                )}
              </div>
              
              {/* Integrated Status Badge - Visible on Mobile */}
              <div className={`px-2 py-1 rounded-full border text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm sm:hidden ${statusConfig.style}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </div>
            </div>
            
            <h3 className="text-sm sm:text-base font-black text-stone-800 tracking-tight leading-tight truncate">
              {product.name}
            </h3>
          </div>

          {/* Block 2: Metadata */}
          <div className="flex flex-row items-center gap-4 sm:gap-6 shrink-0 sm:border-l sm:border-stone-100 sm:pl-6">
            {product.type === 'ave' ? (
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase text-stone-400 tracking-widest mb-0.5">Etapa</span>
                  <span className="text-[10px] font-bold text-stone-700 capitalize leading-none">{product.age}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase text-stone-400 tracking-widest mb-0.5">Propósito</span>
                  <span className="text-[10px] font-bold text-stone-700 capitalize leading-none">{product.purpose}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase text-stone-400 tracking-widest mb-0.5">Stock</span>
                <span className="text-[10px] font-bold text-stone-700 leading-none">{product.stock} u.</span>
              </div>
            )}

            {/* Price */}
            <div className="flex flex-col items-end sm:border-l sm:border-stone-100 sm:pl-6 sm:min-w-[90px]">
              <span className="text-[7px] font-black uppercase text-stone-400 tracking-widest mb-0.5">Precio</span>
              <div className="flex items-baseline text-base sm:text-lg font-black text-brand-700 tracking-tighter leading-none">
                <span className="text-[10px] mr-0.5 opacity-50">$</span>
                {product.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Block 3: Desktop Status & Global Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shrink-0 sm:border-l sm:border-stone-100 sm:pl-6">
            {/* Desktop-only status badge */}
            <div className={`hidden sm:flex px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest items-center gap-2 shadow-sm ${statusConfig.style}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>

            {/* Actions - Hidden on mobile (replaced by swipe) */}
            <div className="hidden sm:flex items-center gap-1.5 ml-auto sm:ml-0">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-2 sm:p-2.5 bg-stone-50 text-stone-400 rounded-lg sm:rounded-xl hover:bg-brand-500 hover:text-white transition-all active:scale-90"
                title="Editar"
              >
                <Edit2 size={14} strokeWidth={2.5} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 sm:p-2.5 bg-stone-50 text-stone-400 rounded-lg sm:rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                title="Eliminar"
              >
                <Trash2 size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
