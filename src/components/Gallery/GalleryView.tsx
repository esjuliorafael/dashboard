import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Media } from '../../types';
import { MediaCard } from './MediaCard';
import { NewMediaForm } from './NewMediaForm';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';

interface GalleryViewProps {
  searchQuery: string;
  viewMode?: 'list' | 'create' | 'media_edit' | 'category_create' | 'categories_list' | 'category_edit';
  onSetViewMode?: (mode: 'list' | 'create' | 'media_edit' | 'category_create' | 'categories_list' | 'category_edit') => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  setConfirmDialog: (dialog: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ITEMS_PER_PAGE = 12;

const galleryMedia: Media[] = [
  { id: '1', title: 'Atardecer en el Rancho', description: 'Vista panorámica de las trojes principales bajo un cielo rojizo.', type: 'image', category: 'Paisajes', subcategory: 'Atardeceres', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', likes: 42, isFavorite: true, createdAt: '2023-10-25T14:00:00Z' },
  { id: '2', title: 'Producción de Mezcal', description: 'El proceso ancestral de destilación en nuestra molienda propia.', type: 'video', category: 'Cultura', subcategory: 'Tradiciones', url: 'https://images.unsplash.com/photo-1599839624912-6718879583d2?auto=format&fit=crop&q=80&w=800', likes: 128, isFavorite: false, createdAt: '2023-10-25T13:00:00Z' },
  { id: '3', title: 'Ganado Angus Premium', description: 'Nuestros mejores ejemplares listos para la exhibición nacional.', type: 'image', category: 'Ganado', subcategory: 'Angus', url: 'https://images.unsplash.com/photo-1547491719-2f99696c3329?auto=format&fit=crop&q=80&w=800', likes: 85, isFavorite: false, createdAt: '2023-10-25T12:00:00Z' },
  { id: '4', title: 'Cena de Gala', description: 'Ambiente preparado para eventos corporativos de alto nivel.', type: 'image', category: 'Eventos', subcategory: 'Salones', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', likes: 31, isFavorite: true, createdAt: '2023-10-25T11:00:00Z' },
  { id: '5', title: 'Cabalgata Matutina', description: 'Explorando los senderos vírgenes del sector sur del rancho.', type: 'video', category: 'Actividades', subcategory: 'Caballos', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800', likes: 56, isFavorite: false, createdAt: '2023-10-25T10:00:00Z' },
  { id: '6', title: 'Fachada Principal', description: 'Arquitectura colonial restaurada con materiales locales.', type: 'image', category: 'Instalaciones', subcategory: 'Arquitectura', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800', likes: 19, isFavorite: false, createdAt: '2023-10-25T09:00:00Z' },
  { id: '7', title: 'Cosecha de Agave', description: 'Selección manual de las piñas en su punto óptimo de madurez.', type: 'image', category: 'Campo', subcategory: 'Agave', url: 'https://images.unsplash.com/photo-1611082695277-20056976934c?auto=format&fit=crop&q=80&w=800', likes: 74, isFavorite: true, createdAt: '2023-10-25T08:00:00Z' },
  { id: '8', title: 'Montura Artesanal', description: 'Trabajo detallado en cuero genuino por nuestros talabarteros.', type: 'image', category: 'Tienda', subcategory: 'Artesanías', url: 'https://images.unsplash.com/photo-1621644026330-89196395f87b?auto=format&fit=crop&q=80&w=800', likes: 22, isFavorite: false, createdAt: '2023-10-25T07:00:00Z' },
  { id: '9', title: 'Vista Aérea Drone', description: 'Panorámica completa que muestra la extensión de nuestras tierras.', type: 'video', category: 'Paisajes', subcategory: 'Drone', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800', likes: 210, isFavorite: true, createdAt: '2023-10-25T06:00:00Z' },
  { id: '10', title: 'Caballo Frisón', description: 'Demostración de elegancia y potencia en el picadero principal.', type: 'image', category: 'Actividades', subcategory: 'Caballos', url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=800', likes: 145, isFavorite: true, createdAt: '2023-10-25T05:00:00Z' },
  { id: '11', title: 'Viñedos', description: 'Las primeras uvas de la temporada bajo el sol de la mañana.', type: 'image', category: 'Campo', subcategory: 'Uva', url: 'https://images.unsplash.com/photo-1530224416911-8f19e289f027?auto=format&fit=crop&q=80&w=800', likes: 89, isFavorite: false, createdAt: '2023-10-25T04:00:00Z' },
  { id: '12', title: 'Barricas en Cava', description: 'El tiempo se detiene en nuestra bodega subterránea.', type: 'image', category: 'Cultura', subcategory: 'Vino', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800', likes: 67, isFavorite: false, createdAt: '2023-10-25T03:00:00Z' },
  { id: '13', title: 'Fiesta de Vendimia', description: 'Celebración anual con música, danza y tradición local.', type: 'video', category: 'Cultura', subcategory: 'Tradiciones', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800', likes: 302, isFavorite: true, createdAt: '2023-10-25T02:00:00Z' },
  { id: '14', title: 'Taller de Barro', description: 'Donde la tierra se transforma en piezas únicas de arte.', type: 'image', category: 'Tienda', subcategory: 'Artesanías', url: 'https://images.unsplash.com/photo-1565193998248-d51f3c7183ef?auto=format&fit=crop&q=80&w=800', likes: 45, isFavorite: false, createdAt: '2023-10-25T01:00:00Z' },
  { id: '15', title: 'Jardines Interiores', description: 'Un oasis de paz rodeado de muros históricos.', type: 'image', category: 'Instalaciones', subcategory: 'Arquitectura', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800', likes: 58, isFavorite: true, createdAt: '2023-10-25T00:00:00Z' },
];

export const GalleryView: React.FC<GalleryViewProps> = ({ searchQuery, viewMode = 'list', onSetViewMode, showToast, setConfirmDialog, onValidationChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const galleryTopRef = useRef<HTMLDivElement>(null);

  const filteredMedia = useMemo(() => {
    return [...galleryMedia]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query)
        );
      });
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
  const paginatedMedia = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMedia, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    galleryTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEditMedia = (media: Media) => {
    setEditingMedia(media);
    onSetViewMode?.('media_edit');
  };

  const handleDeleteMedia = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Eliminar este medio?',
      message: 'Esta acción es irreversible. El archivo se borrará permanentemente de la galería.',
      confirmLabel: 'Sí, Eliminar',
      variant: 'danger',
      onConfirm: () => {
        console.log('Delete media:', id);
        showToast('Medio eliminado correctamente');
        setConfirmDialog({ isOpen: false });
      }
    });
  };

  if (viewMode === 'create' || viewMode === 'media_edit') {
    return (
      <NewMediaForm 
        initialData={editingMedia || undefined}
        onCancel={() => onSetViewMode?.('list')} 
        onSave={() => {
          showToast(editingMedia ? 'Medio actualizado con éxito' : 'Medio subido con éxito');
          onSetViewMode?.('list');
        }} 
      />
    );
  }

  if (viewMode === 'category_create') {
    return (
      <CategoryForm 
        onCancel={() => onSetViewMode?.('list')} 
        onSave={() => {
          showToast('Categoría creada correctamente');
          onSetViewMode?.('list');
        }} 
        onValidationChange={onValidationChange}
      />
    );
  }

  if (viewMode === 'category_edit') {
    return (
      <CategoryForm 
        initialData={editingCategory || undefined}
        onCancel={() => onSetViewMode?.('categories_list')} 
        onSave={() => {
          showToast('Categoría actualizada con éxito');
          onSetViewMode?.('categories_list');
        }} 
        onValidationChange={onValidationChange}
      />
    );
  }

  if (viewMode === 'categories_list') {
    return (
      <CategoryList 
        searchQuery={searchQuery}
        showToast={showToast}
        setConfirmDialog={setConfirmDialog}
        onEdit={(cat) => {
          setEditingCategory(cat);
          onSetViewMode?.('category_edit');
        }}
        onDelete={(id) => {
          setConfirmDialog({
            isOpen: true,
            title: '¿Eliminar categoría?',
            message: 'Los medios asociados a esta categoría quedarán sin clasificar, pero no se borrarán.',
            confirmLabel: 'Eliminar',
            variant: 'danger',
            onConfirm: () => {
              console.log('Delete category:', id);
              showToast('Categoría eliminada');
              setConfirmDialog({ isOpen: false });
            }
          });
        }}
      />
    );
  }

  const renderMediaItem = (item: Media, indexInPage: number) => {
    const isTall = indexInPage % 2 === 1;
    return (
      <div 
        key={item.id} 
        className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
        style={{ animationDelay: `${(indexInPage % ITEMS_PER_PAGE) * 40}ms` }}
      >
        <MediaCard 
          media={item} 
          isTall={isTall} 
          onEdit={() => handleEditMedia(item)}
          onDelete={() => handleDeleteMedia(item.id)}
        />
      </div>
    );
  };

  const columns3 = useMemo(() => {
    const cols: Media[][] = [[], [], []];
    paginatedMedia.forEach((item, i) => {
      cols[i % 3].push(item);
    });
    return cols;
  }, [paginatedMedia]);

  const columns2 = useMemo(() => {
    const cols: Media[][] = [[], []];
    paginatedMedia.forEach((item, i) => {
      cols[i % 2].push(item);
    });
    return cols;
  }, [paginatedMedia]);

  return (
    <div className="w-full flex flex-col gap-10" ref={galleryTopRef}>
      <div className="hidden lg:grid grid-cols-3 gap-6 min-h-[500px]">
        {columns3.map((colItems, colIdx) => (
          <div key={`col-3-${colIdx}`} className="flex flex-col gap-6">
            {colItems.map((item) => {
              const originalIndex = paginatedMedia.indexOf(item);
              return renderMediaItem(item, originalIndex);
            })}
          </div>
        ))}
      </div>

      <div className="grid lg:hidden grid-cols-2 gap-4 sm:gap-6 min-h-[500px]">
        {columns2.map((colItems, colIdx) => (
          <div key={`col-2-${colIdx}`} className="flex flex-col gap-4 sm:gap-6">
            {colItems.map((item) => {
              const originalIndex = paginatedMedia.indexOf(item);
              return renderMediaItem(item, originalIndex);
            })}
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-stone-200 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 mb-6 border border-stone-200 shadow-inner">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-800">No hay coincidencias</h3>
          <p className="text-stone-500 mt-2 max-w-xs text-center">Intenta ajustar tus términos de búsqueda o filtros de categoría.</p>
          <button 
            className="mt-6 px-6 py-2.5 bg-brand-500 text-white rounded-full font-bold text-sm hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95" 
            onClick={() => setCurrentPage(1)}
          >
            Ver todos los medios
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
  );
};