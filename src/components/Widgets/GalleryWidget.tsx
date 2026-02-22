
import React from 'react';
// Corrected import: Image is the standard name in lucide-react, aliased here to ImageIcon
import { Image as ImageIcon, ChevronRight } from 'lucide-react';

interface GalleryWidgetProps {
  onViewGallery?: () => void;
}

export const GalleryWidget: React.FC<GalleryWidgetProps> = ({ onViewGallery }) => {
  return (
    <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-white/60 flex flex-col justify-center hover:shadow-md transition-shadow duration-200 flex-1 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl shrink-0">
            <ImageIcon size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-stone-400 text-[9px] font-bold uppercase tracking-widest leading-none">Galería</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h3 className="text-lg font-black text-stone-800 leading-none">856</h3>
              <span className="text-stone-400 text-[9px] font-medium uppercase leading-none">Archivos</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onViewGallery}
          className="text-stone-300 hover:text-blue-600 transition-colors group p-1 shrink-0"
        >
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
