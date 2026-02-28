import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, X, Save, Check, User as UserIcon, Mail, Shield } from 'lucide-react';
import { User } from '../../../types';

interface UsersViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
  setConfirmDialog: (dialog: any) => void;
}

export interface UsersViewRef {
  handleCreateUser: () => void;
}

const initialUsers: User[] = [
  {
    id: '1', fullName: 'Ricardo Montes', email: 'ricardo@rancho.com', username: 'admin_ricardo', isActive: true, createdAt: '2023-01-15'
  },
  {
    id: '2', fullName: 'Ana García', email: 'ana.g@rancho.com', username: 'ana_ventas', isActive: true, createdAt: '2023-05-20'
  },
  {
    id: '3', fullName: 'Juan Pérez', email: 'juan.p@rancho.com', username: 'juan_logistica', isActive: false, createdAt: '2023-08-10'
  }
];

export const UsersView = forwardRef<UsersViewRef, UsersViewProps>(({ showToast, setConfirmDialog }, ref) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', username: '', password: ''
  });

  // CORRECCIÓN: Usamos classList en lugar de style para consistencia con App.tsx
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]);

  useImperativeHandle(ref, () => ({
    handleCreateUser: () => {
      setEditingUser(null);
      setFormData({ fullName: '', email: '', username: '', password: '' });
      setIsModalOpen(true);
    }
  }));

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName, email: user.email, username: user.username, password: ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      title: '¿Eliminar Usuario?',
      message: `¿Estás seguro de eliminar a ${user.fullName}? Esta acción no se puede deshacer.`,
      confirmLabel: 'Sí, Eliminar',
      variant: 'danger',
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        showToast(`Usuario ${user.fullName} eliminado correctamente`, 'success');
        setConfirmDialog({ isOpen: false });
      }
    });
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
    const user = users.find(u => u.id === id);
    if (user) {
      showToast(`Usuario ${user.fullName} ${!user.isActive ? 'activado' : 'desactivado'}`, 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
      showToast('Cambios guardados correctamente');
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [newUser, ...prev]);
      showToast('Usuario creado correctamente');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${user.isActive ? 'bg-stone-50 text-stone-400' : 'bg-stone-100 text-stone-300'}`}>
                <UserIcon size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-stone-800">{user.fullName}</h4>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-black uppercase tracking-widest">@{user.username}</span>
                </div>
                <p className="text-stone-500 text-sm font-medium mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'}`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <button 
                  onClick={() => toggleStatus(user.id)}
                  className={`w-12 h-6 rounded-full transition-all relative ${user.isActive ? 'bg-brand-500' : 'bg-stone-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${user.isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(user)} className="p-3 bg-stone-50 text-stone-400 hover:text-brand-500 hover:bg-brand-50 rounded-2xl transition-all active:scale-90" title="Editar Usuario">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDeleteClick(user)} className="p-3 bg-stone-50 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90" title="Eliminar Usuario">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors active:scale-90"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"><UserIcon size={18} /></span>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Ej. Ricardo Montes" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"><Mail size={18} /></span>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="ejemplo@rancho.com" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Nombre de Usuario</label>
                      <div className="relative">
                        <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 font-bold text-sm pointer-events-none group-focus-within:text-brand-500 transition-colors">@</span>
                        <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="usuario" className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-10 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                      <div className="relative">
                        <span className="absolute left-5 inset-y-0 flex items-center justify-center text-stone-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"><Shield size={18} /></span>
                        <input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={editingUser ? "••••••••" : "Contraseña"} className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-stone-50 text-stone-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all active:scale-[0.98] border border-stone-200/50">Cancelar</button>
                  <button type="submit" disabled={!(formData.fullName.trim() && formData.email.trim() && formData.username.trim() && (editingUser || formData.password.trim()))} className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${!(formData.fullName.trim() && formData.email.trim() && formData.username.trim() && (editingUser || formData.password.trim())) ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600'}`}>
                    {editingUser ? <Save size={16} strokeWidth={3} /> : <Check size={16} strokeWidth={3} />}
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
});