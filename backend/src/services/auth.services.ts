import bcrypt from 'bcryptjs'; // ALTERADO: Importação padrão para evitar erro de ESM
import { query, queryOne } from '../lib/db';
import type { Organization, User, UserRole, OrganizationType } from '../types/domain';

// Auth Service: sign-up, login, etc.
export class AuthService {
  static async signup(
    email: string,
    password: string,
    role: UserRole = 'operator',
    organizationId?: string
  ): Promise<User> {
    // ALTERADO: Agora usamos bcrypt.hash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await queryOne<User>(
      `INSERT INTO users (email, password_hash, role, organization_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role, organization_id, created_at`,
      [email, hashedPassword, role, organizationId || null]
    );

    if (!result) throw new Error('Signup failed');
    return result;
  }

  static async login(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await queryOne<any>(
      `SELECT id, email, password_hash, role, organization_id, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (!user) return null;

    // ALTERADO: Agora usamos bcrypt.compare
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    delete user.password_hash;
    return user;
  }

  static async getUserById(id: string): Promise<User | null> {
    return queryOne<User>(
      `SELECT id, email, role, organization_id, created_at
       FROM users WHERE id = $1`,
      [id]
    );
  }

  static async getUsersByOrganization(
    organizationId: string
  ): Promise<User[]> {
    return query<User>(
      `SELECT id, email, role, organization_id, created_at
       FROM users WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [organizationId]
    );
  }
}

// Organization Service
export class OrganizationService {
  static async createOrganization(
    type: OrganizationType,
    cnpj: string,
    fantasyName: string,
    whatsapp: string,
    cep: string
  ): Promise<Organization> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    const result = await queryOne<Organization>(
      `INSERT INTO organizations (type, cnpj, fantasy_name, whatsapp, cep, subscription_status, trial_ends_at)
       VALUES ($1, $2, $3, $4, $5, 'trial', $6)
       RETURNING *`,
      [type, cnpj, fantasyName, whatsapp, cep, trialEndsAt.toISOString()]
    );

    if (!result) throw new Error('Organization creation failed');
    return result;
  }

  static async getOrganizationById(
    id: string
  ): Promise<Organization | null> {
    return queryOne<Organization>(
      `SELECT * FROM organizations WHERE id = $1`,
      [id]
    );
  }

  static async getOrganizationByCNPJ(
    cnpj: string
  ): Promise<Organization | null> {
    return queryOne<Organization>(
      `SELECT * FROM organizations WHERE cnpj = $1`,
      [cnpj]
    );
  }

  static async activateOrganization(id: string): Promise<Organization | null> {
    return queryOne<Organization>(
      `UPDATE organizations SET is_active = true WHERE id = $1 RETURNING *`,
      [id]
    );
  }

  static async updateSubscription(
    id: string,
    status: 'trial' | 'active' | 'expired'
  ): Promise<Organization | null> {
    return queryOne<Organization>(
      `UPDATE organizations SET subscription_status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
  }

  static async getAllOrganizations(): Promise<Organization[]> {
    return query<Organization>(
      `SELECT * FROM organizations ORDER BY created_at DESC`
    );
  }

  static async getPendingVerifications(): Promise<Organization[]> {
    return query<Organization>(
      `SELECT * FROM organizations WHERE is_active = false ORDER BY created_at ASC`
    );
  }
}
