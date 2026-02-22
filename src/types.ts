
import React from 'react';

export interface OrderItem {
  id: string;
  name: string;
  type: 'ave' | 'articulo';
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  customerPhone: string;
  customerState: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
  imageUrl: string;
  type: 'ave' | 'articulo';
  ringNumber?: string;
  age?: 'gallina' | 'gallo' | 'polla' | 'pollo';
  purpose?: 'combate' | 'cria';
  stock?: number;
  description: string;
  gallery: string[];
}

export interface Media {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  category: string;
  subcategory: string;
  url: string;
  likes: number;
  isFavorite: boolean;
  createdAt: string; // ISO format for sorting
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export type QuickActionGroup = 'Galería' | 'Tienda' | 'Órdenes' | 'Diseño' | 'Sistema';

export interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  group: QuickActionGroup;
}

export type ShippingZone = 'normal' | 'extendida';

export interface StateZone {
  id: string;
  name: string;
  zone: ShippingZone;
}

export interface ShippingConfig {
  baseCostArticles: number;
  freeShippingArticles: boolean;
  costNormalZone: number;
  costExtendedZone: number;
  freeShippingBirds: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password?: string;
  isActive: boolean;
  createdAt: string;
}
