import { UserRole } from '../types/domain';

export interface JWTPayload {
  sub: string; // userId
  role: UserRole;
  organization_id: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  organization_id: string | null;
  email: string;
}

