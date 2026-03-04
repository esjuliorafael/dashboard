import React from 'react';
import { Image, Film, MoreHorizontal } from 'lucide-react';

interface LatestMediaProps {
  onViewGallery?: () => void;
}

export const LatestMedia: React.FC<LatestMediaProps> = ({ onViewGallery }) => {
  const mediaItems = [
    { id: 1, title: 'Campaña Verano.jpg', type: 'image', date: 'Hace 2 horas', url: 'https://picsum.photos/200/200?random=1' },
    { id: 2, title: 'Reel Promocional.mp4', type: 'video', date: 'Hace 5 horas', url: 'https://picsum.photos/200/200?random=2' },
    { id: 3, title: 'Producto Nuevo 01.png', type: 'image', date: 'Ayer', url: 'https://picsum.photos/200/200?random=3' },
  ];

  return (
    // ESTÁNDAR: rounded-[2.5rem], border-stone-200
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-stone-800 text-base font-black tracking-tight">Últimos Medios</h3>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Añadidos recientemente</p>
        </div>
        <button 
          onClick={onViewGallery}
          className="text-stone-300 hover:text-brand-600 transition-colors p-2 hover:bg-stone-50 rounded-2xl"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 flex-grow">
        {mediaItems.map((item) => (
          // Items: rounded-2xl, border-stone-200 on hover
          <div key={item.id} className="flex items-center gap-4 p-2.5 hover:bg-stone-50 rounded-2xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-stone-200">
            {/* Thumbnail: rounded-2xl */}
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200 shadow-sm">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-1 right-1 p-1 bg-black/40 backdrop-blur-sm rounded-lg text-white">
                {item.type === 'video' ? <Film size={10} /> : <Image size={10} />}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-stone-700 truncate group-hover:text-brand-600 transition-colors">{item.title}</h4>
              <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onViewGallery}
        // ESTÁNDAR: rounded-2xl, border-brand-100/50
        className="w-full mt-6 py-3 text-[10px] font-black text-brand-600 bg-brand-50/50 rounded-2xl hover:bg-brand-50 transition-colors border border-brand-100/50 uppercase tracking-widest"
      >
        Ver Galería
      </button>
    </div>
  );
};