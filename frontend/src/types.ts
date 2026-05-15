export type UserRole = 'admin' | 'operator' | 'superadmin';
export type OrganizationType = 'STORE' | 'SHOP';
export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organization_id: string | null;
  created_at?: string;
}

export interface Organization {
  id: string;
  type: OrganizationType;
  cnpj: string;
  fantasy_name: string;
  whatsapp: string;
  cep: string;
  is_active: boolean;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
}

export interface InventoryItem {
  id: string;
  organization_id: string;
  product_id: string;
  price: string;
  quantity: number;
  product?: Product;
}

export interface SearchResult {
  id: string;
  organization_id: string;
  product_id: string;
  sku: string;
  name: string;
  price: string;
  quantity: number;
  fantasy_name: string;
  whatsapp: string;
  cep: string;
  updated_at: string;
}
