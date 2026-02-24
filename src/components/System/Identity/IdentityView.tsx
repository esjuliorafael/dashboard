
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';

export interface IdentityViewRef {
  handleSave: () => void;
  handleCancel: () => void;
}

interface IdentityViewProps {
  status: 'empty' | 'preview' | 'editing';
  setStatus: (status: 'empty' | 'preview' | 'editing') => void;
  onTempLogoChange: (hasTemp: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const IdentityView = forwardRef<IdentityViewRef, IdentityViewProps>(
  ({ status, setStatus, onTempLogoChange, showToast }, ref) => {
    const [currentLogo, setCurrentLogo] = useState<string | null>('https://rancholastrojes.com.mx/assets/uploads/logo/logo_698abd3f7c34d.png');
    const [tempLogo, setTempLogo] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Notificamos a App.tsx si hay una imagen temporal para habilitar/deshabilitar el botón "Guardar"
    useEffect(() => {
      onTempLogoChange(!!tempLogo);
    }, [tempLogo, onTempLogoChange]);

    useImperativeHandle(ref, () => ({
      handleSave: () => {
        if (tempLogo) {
          setCurrentLogo(tempLogo);
          setStatus('preview');
          setTempLogo(null);
          showToast('Logo actualizado correctamente', 'success');
        }
      },
      handleCancel: () => {
        setStatus(currentLogo ? 'preview' : 'empty');
        setTempLogo(null);
      }
    }));

    const handleFileSelect = (file: File) => {
      if (file && (file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTempLogo(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        showToast('Por favor, selecciona un formato válido (PNG, JPG, SVG).', 'error');
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    };

    return (
      <div className="w-full bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-12 transition-all duration-300 min-h-[420px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4">
        
        {status === 'empty' && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-300 text-center">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6">
              <ImageIcon size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">No hay ningún logo cargado.</h3>
            <p className="text-stone-500">Haz clic en 'Subir logo' arriba para comenzar.</p>
          </div>
        )}

        {status === 'preview' && (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 w-full">
            <div className="bg-stone-50 py-16 px-8 rounded-2xl w-full flex items-center justify-center mb-8 border border-stone-100/50">
              <img 
                src={currentLogo!} 
                alt="Logo actual del sistema" 
                className="max-h-[180px] sm:max-h-[220px] w-auto object-contain drop-shadow-sm transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-stone-400 font-medium">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-stone-300"/> Formato: PNG</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-stone-300"/> Tamaño: Optimizado</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/> Activo en Sistema</span>
            </div>
          </div>
        )}

        {status === 'editing' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col justify-center w-full">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-stone-300 rounded-2xl p-10 sm:p-16 text-center cursor-pointer hover:bg-stone-50 hover:border-stone-400 transition-colors w-full flex flex-col items-center justify-center min-h-[320px] group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/svg+xml, image/jpeg" 
                onChange={(e) => {
                  if(e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              
              {tempLogo ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-6 relative group-hover:shadow-md transition-all">
                    <img src={tempLogo} alt="Vista previa del nuevo logo" className="max-h-[180px] object-contain" />
                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[1px]">
                      <span className="bg-stone-800 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl">
                        <RefreshCw size={14} /> Cambiar imagen
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-stone-500">Vista previa generada. Recuerda guardar los cambios.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-white shadow-sm border border-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-6 group-hover:scale-105 group-hover:text-stone-600 transition-all">
                    <Upload size={32} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-bold text-stone-700 mb-2">Haz clic o arrastra una imagen aquí</h4>
                  <p className="text-sm font-medium text-stone-400 mt-2 bg-white px-4 py-1.5 rounded-full border border-stone-100 shadow-sm">
                    Recomendado: PNG o SVG con fondo transparente.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);