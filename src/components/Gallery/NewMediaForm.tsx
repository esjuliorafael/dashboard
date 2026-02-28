import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, X, MapPin, ImageIcon, Film, FileType, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Media } from '../../types';

interface NewMediaFormProps {
  initialData?: Media;
  onCancel: () => void;
  onSave: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

const CATEGORY_MAP: Record<string, string[]> = {
  'Paisajes': ['Atardeceres', 'Amaneceres', 'Panorámicas', 'Drone'],
  'Cultura': ['Tradiciones', 'Gastronomía', 'Procesos', 'Mezcal', 'Vino'],
  'Ganado': ['Angus', 'Equinos', 'Cuidado Animal', 'Exhibición'],
  'Eventos': ['Sociales', 'Corporativos', 'Salones', 'Cenas'],
  'Actividades': ['Cabalgatas', 'Camping', 'Senderismo', 'Deportes'],
  'Instalaciones': ['Arquitectura', 'Interiores', 'Jardines', 'Capilla'],
  'Campo': ['Agave', 'Viñedos', 'Cosecha', 'Mantenimiento'],
  'Tienda': ['Artesanías', 'Orgánico', 'Accesorios', 'Cuero']
};

const CATEGORIES = Object.keys(CATEGORY_MAP);

export const NewMediaForm: React.FC<NewMediaFormProps> = ({ initialData, onCancel, onSave, onValidationChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.url || null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(initialData?.type || null);
  const [uploadProgress, setUploadProgress] = useState(initialData ? 100 : 0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(!!initialData);
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [subCategory, setSubCategory] = useState(initialData?.subcategory || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subCategories = useMemo(() => {
    return category ? CATEGORY_MAP[category] || [] : [];
  }, [category]);

  const isFormValid = !!previewUrl && !!title && !!category && isUploadComplete;

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  useEffect(() => {
    return () => onValidationChange?.(false);
  }, [onValidationChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setIsUploadComplete(false);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const processFile = (file: File) => {
    if (previewUrl && !initialData) URL.revokeObjectURL(previewUrl);
    
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (file.type.startsWith('image/')) setMediaType('image');
    else if (file.type.startsWith('video/')) setMediaType('video');
    else setMediaType(null);

    simulateUpload();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl && !initialData) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMediaType(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsUploadComplete(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onSave();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && !initialData) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, initialData]);

  return (
    <form id="media-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex-1">
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !file && !initialData && fileInputRef.current?.click()}
          className={`relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/5] rounded-[3rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden bg-white/50 cursor-pointer
            ${!previewUrl ? 'border-stone-200 hover:border-brand-400 hover:bg-brand-50/20' : 'border-transparent shadow-2xl shadow-stone-200'}
          `}
        >
          {!previewUrl ? (
            <div className="flex flex-col items-center p-10 text-center group">
              <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-black text-stone-800 tracking-tight">Carga tu contenido</h3>
              <p className="text-stone-500 text-sm mt-2 max-w-[200px]">
                Arrastra y suelta o haz clic para seleccionar fotos o videos.
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 group cursor-default">
              {mediaType === 'image' ? (
                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <video src={previewUrl} className="w-full h-full object-cover" controls={!isUploading} />
              )}
              
              <div className={`absolute inset-0 bg-black/40 transition-opacity flex flex-col items-end justify-end ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isUploading ? (
                  <div className="w-full p-8 space-y-3">
                    <div className="flex justify-between items-center text-white text-[10px] font-black uppercase tracking-widest px-1">
                      <span>Procesando archivo</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      className="bg-white/20 backdrop-blur-xl p-4 rounded-full text-white border border-white/30 hover:bg-rose-500/40 transition-all active:scale-90 shadow-2xl"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}
              </div>

              {!isUploading && (
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-2">
                    {mediaType === 'image' ? <ImageIcon size={14} /> : <Film size={14} />}
                    {mediaType === 'image' ? 'Fotografía' : 'Video'}
                  </div>
                  {isUploadComplete && (
                    <div className="px-4 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full text-green-100 text-[10px] font-black uppercase tracking-widest border border-green-500/30 flex items-center gap-2 animate-in zoom-in duration-300">
                      <CheckCircle2 size={14} />
                      {initialData ? 'Almacenado' : 'Listo'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>
      </div>

      <div className="w-full lg:w-[420px] flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/60 space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Título del Medio *</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Cabalgata al atardecer..."
              value={title}
              maxLength={150}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Categoría Principal *</label>
            <div className="relative">
              <select 
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="" disabled>Selecciona categoría</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {category && subCategories.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Subcategoría (Opcional)</label>
              <div className="relative">
                <select 
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                >
                  <option value="">Selecciona subcategoría</option>
                  {subCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                  <FileType size={18} />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Ubicación (Opcional)</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ej. Sector Sur, Rancho Las Trojes"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 pl-12 rounded-2xl text-stone-800 font-bold placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-400">
                <MapPin size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Descripción</label>
            <textarea 
              rows={4}
              placeholder="Cuéntanos más sobre este medio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-800 font-medium placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
            />
          </div>

          <button type="submit" className="hidden" disabled={!isFormValid || isUploading} />
        </div>
      </div>
    </form>
  );
};