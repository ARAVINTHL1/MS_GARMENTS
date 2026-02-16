export type UserRole = 'admin' | 'buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  fabric: string;
  price: number;
  stock: number;
  minOrder: number;
  image: string;
  description: string;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  products: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface DemandForecast {
  month: string;
  actual: number;
  predicted: number;
}

export interface SalesTrend {
  month: string;
  revenue: number;
  orders: number;
}
