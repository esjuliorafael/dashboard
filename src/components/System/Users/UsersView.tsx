
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Pencil, Trash2, X, Save, Check, User as UserIcon, Mail, Shield, AlertTriangle } from 'lucide-react';
import { User } from '../../../types';

interface UsersViewProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export interface UsersViewRef {
  handleCreateUser: () => void;
}

const initialUsers: User[] = [
  {
    id: '1',
    fullName: 'Ricardo Montes',
    email: 'ricardo@rancho.com',
    username: 'admin_ricardo',
    isActive: true,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    fullName: 'Ana García',
    email: 'ana.g@rancho.com',
    username: 'ana_ventas',
    isActive: true,
    createdAt: '2023-05-20'
  },
  {
    id: '3',
    fullName: 'Juan Pérez',
    email: 'juan.p@rancho.com',
    username: 'juan_logistica',
    isActive: false,
    createdAt: '2023-08-10'
  }
];

export const UsersView = forwardRef<UsersViewRef, UsersViewProps>(({ showToast }, ref) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });

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
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      password: '' // Keep password empty for editing unless changed
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      showToast(`Usuario ${userToDelete.fullName} eliminado correctamente`, 'success');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
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
      {/* User List */}
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div 
            key={user.id}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${user.isActive ? 'bg-stone-50 text-stone-400' : 'bg-stone-100 text-stone-300'}`}>
                <UserIcon size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-stone-800">{user.fullName}</h4>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    @{user.username}
                  </span>
                </div>
                <p className="text-stone-500 text-sm font-medium mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'
                }`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <button 
                  onClick={() => toggleStatus(user.id)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    user.isActive ? 'bg-brand-500' : 'bg-stone-200'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    user.isActive ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(user)}
                  className="p-3 bg-stone-50 text-stone-400 hover:text-brand-500 hover:bg-brand-50 rounded-2xl transition-all active:scale-90"
                  title="Editar Usuario"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(user)}
                  className="p-3 bg-stone-50 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                  title="Eliminar Usuario"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
                        <UserIcon size={18} />
                      </span>
                      <input 
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Ej. Ricardo Montes"
                        className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
                        <Mail size={18} />
                      </span>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ejemplo@rancho.com"
                        className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Nombre de Usuario</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">@</span>
                        <input 
                          type="text"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="usuario"
                          className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-10 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
                          <Shield size={18} />
                        </span>
                        <input 
                          type="password"
                          required={!editingUser}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={editingUser ? "••••••••" : "Contraseña"}
                          className="w-full bg-stone-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-stone-700 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center gap-2 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-all active:scale-95"
                  >
                    <X size={18} className="text-stone-400" />
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center gap-2 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-all active:scale-95"
                  >
                    {editingUser ? <Save size={18} className="text-stone-400" /> : <Check size={18} className="text-stone-400" />}
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-stone-800 tracking-tight mb-3">¿Eliminar Usuario?</h3>
              <p className="text-stone-500 text-sm font-medium leading-relaxed">
                ¿Estás seguro de eliminar a <span className="font-bold text-stone-700">{userToDelete.fullName}</span>? Esta acción no se puede deshacer.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-10">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center gap-2 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-all active:scale-95"
                >
                  <X size={18} className="text-stone-400" />
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center gap-2 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-all active:scale-95"
                >
                  <Trash2 size={18} className="text-stone-400" />
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
});
