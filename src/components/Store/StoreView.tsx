import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShoppingBag, Search, PlusCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';

interface StoreViewProps {
  searchQuery: string;
  viewMode?: 'list' | 'create' | 'edit';
  onSetViewMode?: (mode: 'list' | 'create' | 'edit') => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  setConfirmDialog: (dialog: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ITEMS_PER_PAGE = 8;

const mockProducts: Product[] = [
  // ... (Data mock intacta)
  { id: 'p1', name: 'Semental Kelso Fino', price: 15000, status: 'available', type: 'ave', ringNumber: 'KL-001', age: 'gallo', purpose: 'combate', description: 'Ejemplar con excelente genética y temperamento, ideal para semental de primera línea en cualquier criadero de alto nivel.', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-25T14:00:00Z' },
  { id: 'p2', name: 'Montura de Gala Bordada', price: 8500, status: 'available', type: 'articulo', stock: 2, description: 'Trabajo artesanal en cuero con bordados de pita realizados a mano por maestros talabarteros de la región.', imageUrl: 'https://images.unsplash.com/photo-1621644026330-89196395f87b?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-25T13:00:00Z' },
  { id: 'p3', name: 'Gallina Hatch Reproductora', price: 12000, status: 'reserved', type: 'ave', ringNumber: 'HT-054', age: 'gallina', purpose: 'cria', description: 'Madre probada para cría de alta calidad con descendencia ganadora en múltiples derbys nacionales.', imageUrl: 'https://images.unsplash.com/photo-1612170153139-6f881ff06700?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-25T12:00:00Z' },
  { id: 'p4', name: 'Gallo Radio Giro', price: 9500, status: 'available', type: 'ave', ringNumber: 'RD-088', age: 'gallo', purpose: 'combate', description: 'Giro de gran velocidad y corte.', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-24T10:00:00Z' },
  { id: 'p5', name: 'Pollo Sweater Fino', price: 4500, status: 'available', type: 'ave', ringNumber: 'SW-991', age: 'pollo', purpose: 'cria', description: 'Pollo de 8 meses con excelente estampa.', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-23T11:00:00Z' },
  { id: 'p6', name: 'Botas Vaqueras Exóticas', price: 3200, status: 'available', type: 'articulo', stock: 5, description: 'Botas de piel genuina con acabados premium.', imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-22T09:00:00Z' },
  { id: 'p7', name: 'Gallo Hatch Leiper', price: 11000, status: 'sold', type: 'ave', ringNumber: 'LP-332', age: 'gallo', purpose: 'combate', description: 'Ejemplar ganador de derby regional.', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-21T15:00:00Z' },
  { id: 'p8', name: 'Espuelas de Acero', price: 1800, status: 'available', type: 'articulo', stock: 10, description: 'Espuelas forjadas a mano de alta resistencia.', imageUrl: 'https://images.unsplash.com/photo-1621644026330-89196395f87b?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-20T08:00:00Z' },
  { id: 'p9', name: 'Gallina Kelso Pura', price: 8000, status: 'available', type: 'ave', ringNumber: 'KL-002', age: 'gallina', purpose: 'cria', description: 'Madre de campeones.', imageUrl: 'https://images.unsplash.com/photo-1612170153139-6f881ff06700?auto=format&fit=crop&q=80&w=800', gallery: [], createdAt: '2023-10-19T14:00:00Z' }
];

export const StoreView: React.FC<StoreViewProps> = ({ searchQuery, viewMode = 'list', onSetViewMode, showToast, setConfirmDialog, onValidationChange }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const storeTopRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ringNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    storeTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    onSetViewMode?.('edit');
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Eliminar producto?',
      message: 'Esta acción borrará el producto permanentemente del inventario.',
      confirmLabel: 'Sí, Eliminar',
      variant: 'danger',
      onConfirm: () => {
        showToast('Producto eliminado');
        setConfirmDialog({ isOpen: false });
      }
    });
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <ProductForm 
        initialData={editingProduct || undefined}
        onCancel={() => onSetViewMode?.('list')}
        onSave={() => {
          showToast(editingProduct ? 'Producto actualizado' : 'Producto creado con éxito');
          onSetViewMode?.('list');
        }}
        onValidationChange={onValidationChange}
      />
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700" ref={storeTopRef}>
      
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
          {paginatedProducts.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
              style={{ animationDelay: `${idx * 50}ms` }}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-8 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl p-2.5 rounded-full border border-white/80 shadow-xl shadow-stone-200/50">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-full transition-all ${
                    currentPage === 1 
                      ? 'text-stone-300 cursor-not-allowed opacity-50' 
                      : 'text-stone-600 hover:bg-stone-100 active:scale-90 hover:text-brand-600'
                  }`}
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-black transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110 z-10'
                          : 'text-stone-400 hover:bg-stone-50 hover:text-stone-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-full transition-all ${
                    currentPage === totalPages 
                      ? 'text-stone-300 cursor-not-allowed opacity-50' 
                      : 'text-stone-600 hover:bg-stone-100 active:scale-90 hover:text-brand-600'
                  }`}
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-stone-200 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 mb-6 border border-stone-200 shadow-inner">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-800">Sin resultados</h3>
          <p className="text-stone-500 mt-2 max-w-xs text-center">No encontramos productos con ese nombre o número de anillo.</p>
        </div>
      )}
    </div>
  );
};