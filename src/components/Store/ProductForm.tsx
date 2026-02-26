import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Tag, DollarSign, Info, ChevronDown, CheckCircle2, Image as ImageIcon, Trash2, Package, Search, Box } from 'lucide-react';
import { Product } from '../../types';

interface ProductFormProps {
  initialData?: Product;
  onCancel: () => void;
  onSave: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onCancel, onSave, onValidationChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [productType, setProductType] = useState<'ave' | 'articulo'>(initialData?.type || 'ave');
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price.toString() || '');
  const [status, setStatus] = useState(initialData?.status || 'available');
  const [description, setDescription] = useState(initialData?.description || '');
  
  const [ringNumber, setRingNumber] = useState(initialData?.ringNumber || '');
  const [age, setAge] = useState(initialData?.age || 'pollo');
  const [purpose, setPurpose] = useState(initialData?.purpose || 'combate');
  
  const [stock, setStock] = useState(initialData?.stock?.toString() || '');

  const [coverUrl, setCoverUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialData?.gallery || []);
  const [isUploading, setIsUploading] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = !!coverUrl && !!name && !!price && (productType === 'ave' ? !!ringNumber : !!stock);

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  useEffect(() => {
    return () => onValidationChange?.(false);
  }, [onValidationChange]);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverUrl(url);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setGalleryUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSave();
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <form id="product-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      
      {/* Left Column: Cover & Gallery */}
      <div className="flex-1 space-y-6">
        <div 
          onClick={() => !coverUrl && coverInputRef.current?.click()}
          className={`relative w-full aspect-square sm:aspect-video lg:aspect-square rounded-[3rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden bg-white/50
            ${!coverUrl ? 'border-stone-200 hover:border-brand-400 hover:bg-brand-50/20 cursor-pointer' : 'border-transparent shadow-2xl shadow-stone-200'}
          `}
        >
          {!coverUrl ? (
            // Agregamos la clase 'group' aquí
            <div className="flex flex-col items-center p-10 text-center group">
              {/* Agregamos las clases de animación (group-hover:scale-110 transition-transform duration-300) aquí */}
              <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-xl font-black text-stone-800 tracking-tight">Foto de Portada</h3>
              <p className="text-stone-500 text-sm mt-2 max-w-[200px]">Imagen principal que se verá en el catálogo.</p>
            </div>
          ) : (
            <div className="absolute inset-0 group">
              <img src={coverUrl} className="w-full h-full object-cover" alt="Portada" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCoverUrl(null); }}
                  className="bg-white/20 backdrop-blur-xl p-4 rounded-full text-white border border-white/30 hover:bg-rose-500/40 transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
        </div>

        {/* Multi-Gallery */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/60">
          <div className="flex items-center justify-between mb-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Multimedia</span>
                <h4 className="text-lg font-black text-stone-800 tracking-tight">Galería Adicional</h4>
             </div>
             <button 
               type="button"
               onClick={() => galleryInputRef.current?.click()}
               className="p-3 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-2xl transition-all active:scale-90"
             >
                <Upload size={20} />
             </button>
             <input type="file" ref={galleryInputRef} className="hidden" multiple accept="image/*" onChange={handleGalleryUpload} />
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {galleryUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-stone-100 shadow-sm">
                <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                <button 
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-1 right-1 p-1.5 bg-rose-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90 backdrop-blur-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {galleryUrls.length === 0 && (
              <div className="col-span-full py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">No hay imágenes adicionales</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Details Form */}
      <div className="w-full lg:w-[480px] flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/60 space-y-8">
          
          {/* Product Type Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Tipo de Producto</label>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 type="button"
                 onClick={() => setProductType('ave')}
                 className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest
                    ${productType === 'ave' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200'}
                 `}
               >
                 <Box size={18} />
                 Ave
               </button>
               <button 
                 type="button"
                 onClick={() => setProductType('articulo')}
                 className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest
                    ${productType === 'articulo' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200'}
                 `}
               >
                 <Package size={18} />
                 Artículo
               </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Nombre del Producto *</label>
              <input 
                type="text" 
                required
                placeholder={productType === 'ave' ? "Ej. Semental Colorado..." : "Ej. Sombrero de Gala..."}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Precio *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 p-4 pl-12 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-500">
                    <DollarSign size={18} />
                  </div>
                </div>
              </div>

              {productType === 'ave' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">No. Anillo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. AB-123"
                    value={ringNumber}
                    onChange={(e) => setRingNumber(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Stock *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Cantidad"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              )}
            </div>

            {productType === 'ave' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Edad / Etapa</label>
                  <div className="relative">
                    <select 
                      value={age}
                      onChange={(e) => setAge(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    >
                      <option value="gallina">Gallina</option>
                      <option value="gallo">Gallo</option>
                      <option value="polla">Polla</option>
                      <option value="pollo">Pollo</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Propósito</label>
                  <div className="relative">
                    <select 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    >
                      <option value="combate">Combate</option>
                      <option value="cria">Cría</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Estado de Venta</label>
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="available">Disponible</option>
                  <option value="reserved">Reservado</option>
                  <option value="sold">Vendido</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Descripción</label>
              <textarea 
                rows={4}
                placeholder="Detalles adicionales, genética, materiales..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
              />
            </div>

            <button type="submit" className="hidden" disabled={!isFormValid || isSubmitting} />

          </div>
        </div>
      </div>
    </form>
  );
};