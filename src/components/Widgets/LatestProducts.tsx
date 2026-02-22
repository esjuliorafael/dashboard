import React from 'react';
import { ShoppingBag, MoreHorizontal, Tag } from 'lucide-react';
import { Product } from '../../types';

export const LatestProducts: React.FC = () => {
  const products: Product[] = [
    { 
      id: 'p1', 
      name: 'Montura Cuero Premium', 
      price: 4500, 
      status: 'available', 
      createdAt: 'Hace 1 hora', 
      imageUrl: 'https://picsum.photos/100/100?random=10',
      // Added missing mandatory properties
      type: 'articulo',
      description: 'Montura de cuero de alta calidad para uso premium.',
      gallery: []
    },
    { 
      id: 'p2', 
      name: 'Sombrero Charro Galón', 
      price: 1200, 
      status: 'reserved', 
      createdAt: 'Hace 4 horas', 
      imageUrl: 'https://picsum.photos/100/100?random=11',
      // Added missing mandatory properties
      type: 'articulo',
      description: 'Sombrero tradicional con detalles de galón.',
      gallery: []
    },
    { 
      id: 'p3', 
      name: 'Cinturón Piteado Fino', 
      price: 2800, 
      status: 'sold', 
      createdAt: 'Ayer', 
      imageUrl: 'https://picsum.photos/100/100?random=12',
      // Added missing mandatory properties
      type: 'articulo',
      description: 'Cinturón piteado a mano con hilos de plata.',
      gallery: []
    },
  ];

  const getStatusStyle = (status: Product['status']) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-100';
      case 'reserved': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'sold': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-stone-500 bg-stone-50';
    }
  };

  const getStatusLabel = (status: Product['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Reservado';
      case 'sold': return 'Vendido';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-white/60 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-stone-800 text-base font-bold">Últimos Productos</h3>
          <p className="text-stone-400 text-[10px] font-medium uppercase tracking-wider">Añadidos a la tienda</p>
        </div>
        <button className="text-stone-400 hover:text-brand-600 transition-colors p-2 hover:bg-stone-50 rounded-full">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="flex flex-col gap-1.5 flex-grow">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-2xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-stone-100">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-100">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-stone-700 truncate">{product.name}</h4>
                <span className="text-xs font-black text-stone-800 ml-2">${product.price}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-stone-400 font-medium">{product.createdAt}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${getStatusStyle(product.status)}`}>
                  {getStatusLabel(product.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2.5 text-[10px] font-bold text-brand-600 bg-brand-50/50 rounded-xl hover:bg-brand-50 transition-colors border border-brand-100/50 uppercase tracking-widest flex items-center justify-center gap-2">
        <Tag size={12} />
        Ver Catálogo
      </button>
    </div>
  );
};