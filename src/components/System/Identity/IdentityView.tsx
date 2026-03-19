import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { apiSystem, ASSET_BASE_URL } from '../../../api';

export interface IdentityViewRef {
  handleSave: () => void;
  handleCancel: () => void;
}

interface IdentityViewProps {
  status: 'empty' | 'preview' | 'editing';
  setStatus: (status: 'empty' | 'preview' | 'editing') => void;
  onTempLogoChange: (hasLogo: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const IdentityView = forwardRef<IdentityViewRef, IdentityViewProps>(
  ({ status, setStatus, onTempLogoChange, showToast }, ref) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    
    const [currentLogoPath, setCurrentLogoPath] = useState<string | null>(null);
    const [tempFile, setTempFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar la configuración actual al montar
    const loadCurrentLogo = async () => {
      setIsLoading(true);
      try {
        const config = await apiSystem.getConfig();
        if (config['sistema_logo']) {
          setCurrentLogoPath(config['sistema_logo']);
          setStatus('preview');
        } else {
          setStatus('empty');
        }
      } catch (error) {
        console.error("Error al cargar logo:", error);
        showToast('No se pudo cargar la configuración del logo', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadCurrentLogo();
    }, []);

    // Limpiar URLs creadas en memoria para evitar fugas de memoria
    useEffect(() => {
      return () => {
        if (previewUrl && tempFile) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl, tempFile]);

    useImperativeHandle(ref, () => ({
      handleSave: async () => {
        if (!tempFile) return;
        
        setIsUploading(true);
        try {
          const response = await apiSystem.updateLogo(tempFile);
          showToast('Logo del sistema actualizado correctamente', 'success');
          
          // Limpiamos los temporales y establecemos el nuevo logo oficial
          setTempFile(null);
          setPreviewUrl(null);
          onTempLogoChange(false);
          
          setCurrentLogoPath(response.path); // path que devuelve el backend
          setStatus('preview');
        } catch (error) {
          showToast('Ocurrió un error al subir el logo', 'error');
        } finally {
          setIsUploading(false);
        }
      },
      handleCancel: () => {
        setTempFile(null);
        setPreviewUrl(null);
        onTempLogoChange(false);
        setStatus(currentLogoPath ? 'preview' : 'empty');
      }
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validar tamaño (ej. max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          showToast('La imagen es muy pesada. El límite es 2MB', 'error');
          return;
        }
        
        setTempFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        onTempLogoChange(true);
      }
    };

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
           <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
           <p className="text-stone-500 font-medium">Cargando identidad visual...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 relative">
        
        {/* Capa de Bloqueo Visual (Solo para cuando está subiendo la imagen, que sí toma tiempo) */}
        {isUploading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-[2.5rem] mt-[-2rem] mb-[-2rem]">
                 <div className="flex flex-col items-center gap-2">
                     <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                     <span className="text-sm font-bold text-brand-700">Subiendo y procesando logo...</span>
                 </div>
             </div>
        )}

        {/* Banner Info */}
        <div className="bg-brand-50 border border-brand-100 p-6 rounded-[2rem] flex gap-4 items-start shadow-sm">
          <div className="text-brand-500 mt-1 shrink-0"><Info size={24} /></div>
          <div>
            <h4 className="font-bold text-brand-900">Marca y Sistema</h4>
            <p className="text-sm text-brand-800 mt-1 leading-relaxed">
              El logo que subas aquí será la cara de Rancho Las Trojes. Se actualizará automáticamente en el encabezado de este panel de administración, en la tienda en línea y en los documentos o recibos generados.
            </p>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-sm">
          
          <div className="flex flex-col items-center text-center max-w-xl mx-auto py-10">
            
            <div className="w-24 h-24 bg-stone-50 border border-stone-100 rounded-3xl flex items-center justify-center text-stone-400 mb-6 shadow-inner">
              <ImageIcon size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-black text-stone-800 tracking-tight">Logo Principal</h3>
            <p className="text-stone-500 font-medium mt-2">
              Se recomienda usar formato PNG con fondo transparente o SVG para mejor adaptabilidad en modo oscuro.
            </p>

            <div className="mt-10 w-full">
              {status === 'preview' && currentLogoPath ? (
                <div className="relative group mx-auto w-64 h-64 bg-stone-50 rounded-[2rem] border-2 border-stone-200 flex items-center justify-center p-8 transition-all hover:border-brand-200">
                  {/* Construimos la URL completa para previsualizar el logo guardado */}
                  <img 
                    src={`${ASSET_BASE_URL}${currentLogoPath}?t=${new Date().getTime()}`} // El query param ?t fuerza a refrescar caché si se sube uno nuevo con el mismo nombre, aunque en PHP ya lo arreglamos
                    alt="Logo del Sistema" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-xl shadow-lg">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
              ) : (
                <div 
                  className={`w-full max-w-md mx-auto border-2 border-dashed rounded-[2.5rem] p-10 transition-all text-center group cursor-pointer
                    ${tempFile 
                      ? 'border-brand-500 bg-brand-50' 
                      : 'border-stone-200 hover:border-brand-400 hover:bg-stone-50'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleFileChange}
                  />
                  
                  {previewUrl ? (
                    <div className="relative w-48 h-48 mx-auto">
                      <img src={previewUrl} alt="Vista previa" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold text-sm">Cambiar archivo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={28} />
                      </div>
                      <p className="font-bold text-stone-800">Haz clic para subir un archivo</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-2">PNG, JPG o SVG (Max. 2MB)</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    );
  }
);