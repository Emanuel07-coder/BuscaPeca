export type OrganizationType = 'STORE' | 'SHOP';
export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export type UserRole = 'admin' | 'operator' | 'superadmin';

export interface Organization {
  id: string;
  type: OrganizationType;
  cnpj: string;
  fantasy_name: string;
  whatsapp: string; // E.164
  cep: string;
  is_active: boolean;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null; // ISO
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  organization_id: string | null;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

