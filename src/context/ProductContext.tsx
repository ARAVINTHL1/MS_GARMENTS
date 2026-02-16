import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order } from '@/types';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  deleteProduct: (id: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Cotton Leggins', category: 'Leggins', fabric: '4-Way Stretch Cotton', price: 120, stock: 3000, minOrder: 50, image: '/Cotton leggings.jpg', description: 'Premium quality cotton leggings with 4-way stretch. Available in 15+ colors. Sizes S to 3XL.', createdAt: '2025-12-01' },
  { id: '2', name: 'Pattiyala 4way', category: 'Pattiyala', fabric: '4-Way Lycra', price: 150, stock: 2200, minOrder: 50, image: '/p.jpg', description: 'Comfortable pattiyala pants with 4-way stretch fabric. Perfect for daily wear. All sizes available.', createdAt: '2025-12-05' },
  { id: '3', name: 'Laicra Churidar', category: 'Laicra', fabric: 'Premium Lycra', price: 135, stock: 1800, minOrder: 50, image: '/layagara.jpg', description: 'Stretchable laicra churidar leggings. Soft finish, vibrant colors. Free size and plus size available.', createdAt: '2025-12-10' },
  { id: '4', name: 'Ankle Fit Leggins', category: 'Ankle Fit', fabric: 'Cotton Lycra', price: 110, stock: 2800, minOrder: 50, image: '/ankle.jpg', description: 'Ankle length leggings with perfect fit. Cotton-lycra blend for comfort. 20+ color options.', createdAt: '2025-12-15' },
  { id: '5', name: 'Shimmer Leggins', category: 'Shimmer', fabric: 'Shimmer Lycra', price: 180, stock: 1200, minOrder: 50, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', description: 'Party wear shimmer leggings with metallic finish. Available in gold, silver, copper and more.', createdAt: '2026-01-02' },
  { id: '6', name: 'Woolen Leggins', category: 'Woolen', fabric: 'Wool Blend', price: 200, stock: 900, minOrder: 50, image: '/wollen.jpg', description: 'Winter special woolen leggings. Warm and comfortable for cold weather. Multiple dark shades.', createdAt: '2026-01-10' },
];

const INITIAL_ORDERS: Order[] = [];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const placeOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [newOrder, ...prev]);
    // Reduce stock
    order.products.forEach(item => {
      setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: p.stock - item.quantity } : p));
    });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <ProductContext.Provider value={{ products, orders, addProduct, deleteProduct, placeOrder, updateOrderStatus }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
