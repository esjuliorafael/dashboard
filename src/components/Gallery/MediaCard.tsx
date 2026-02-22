
import React from 'react';
import { Heart, Edit2, Trash2, Film, Image as ImageIcon } from 'lucide-react';
import { Media } from '../../types';

interface MediaCardProps {
  media: Media;
  isTall: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, isTall, onEdit, onDelete }) => {
  return (
    <div className={`group relative w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-stone-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${isTall ? 'h-[340px] sm:h-[460px]' : 'h-[260px] sm:h-[340px]'}`}>
      
      {/* Root Media Element */}
      <img 
        src={media.url} 
        alt={media.title} 
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
      />
      
      {/* Dynamic Overlays */}
      {/* 1. Deep Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
      
      {/* 2. Top-right Media Type Badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 sm:p-3 bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-4 group-hover:translate-y-0 shadow-lg">
        {media.type === 'video' ? <Film size={14} className="sm:w-[18px] sm:h-[18px]" /> : <ImageIcon size={14} className="sm:w-[18px] sm:h-[18px]" />}
      </div>

      {/* 3. Integrated Content & Actions */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
        
        {/* Metadata section */}
        <div className="mb-4 sm:mb-6 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out delay-0">
          <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 bg-brand-500/20 text-brand-200 text-[9px] font-bold rounded-md uppercase tracking-wider backdrop-blur-sm border border-brand-500/30">
               {media.category}
             </span>
          </div>
          <h4 className="font-black text-white text-lg sm:text-2xl tracking-tight leading-none mb-2 drop-shadow-xl">
            {media.title}
          </h4>
          <p className="text-white/80 text-[11px] sm:text-sm font-medium line-clamp-2 leading-relaxed drop-shadow-md max-w-[90%]">
            {media.description}
          </p>
        </div>

        {/* Action Bar section */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out delay-100">
          
          {/* Social Interaction */}
          <button className={`flex items-center gap-2 bg-white/15 backdrop-blur-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-[1.25rem] border border-white/20 transition-all active:scale-90 hover:bg-white/25 ${media.isFavorite ? 'text-rose-400' : 'text-white hover:text-rose-400'}`}>
            <Heart size={16} className="sm:w-[20px] sm:h-[20px]" fill={media.isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
            <span className="text-xs sm:text-sm font-black text-white">{media.likes}</span>
          </button>

          {/* Management Suite */}
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="p-2.5 sm:p-3.5 bg-white/15 backdrop-blur-2xl rounded-xl sm:rounded-[1.25rem] text-white hover:bg-brand-500/40 border border-white/20 transition-all active:scale-90 shadow-lg" 
              title="Editar"
            >
              <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="p-2.5 sm:p-3.5 bg-white/15 backdrop-blur-2xl rounded-xl sm:rounded-[1.25rem] text-white hover:bg-rose-500/50 border border-white/20 transition-all active:scale-90 shadow-lg" 
              title="Eliminar"
            >
              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
