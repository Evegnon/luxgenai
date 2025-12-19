export interface Mannequin {
  id: string;
  name: string;
  image: string;
  ethnicity: string;
  style: string;
  details: string;
}

export type ProductType = 'bag' | 'shoe' | 'dress' | 'jewelry' | 'watch' | 'glasses' | 'accessory';

export interface Product {
  id: string;
  image: string; // Base64
  type: ProductType;
  description?: string;
}

export interface Scene {
  id: number;
  title: string;
  prompt_image: string;
  prompt_video: string;
  isPackshot: boolean;
}

export interface Campaign {
  id: string;
  status: 'draft' | 'generating' | 'completed';
  mannequinId: string;
  product: Product;
  scenes: Scene[];
  generatedImages: string[]; // URLs
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  status: 'active' | 'suspended';
  lastLogin: string;
}

export interface ApiConfig {
  provider: string;
  key: string;
  modelName: string;
  status: 'active' | 'error' | 'inactive';
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO',
  GALLERY = 'GALLERY',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN'
}