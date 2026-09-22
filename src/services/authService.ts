import { api, setAdminToken, removeAdminToken, getAdminToken } from '../lib/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

class AuthService {
  public async login(email: string, password: string): Promise<AdminUser> {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data && res.data.token) {
      setAdminToken(res.data.token);
      return res.data.admin;
    }
    throw new Error(res.message || 'Login failed');
  }

  public async getMe(): Promise<AdminUser | null> {
    const token = getAdminToken();
    if (!token) return null;

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch {
      removeAdminToken();
      return null;
    }
  }

  public async setupInitialAdmin(data: { name: string; email: string; password: string }): Promise<AdminUser> {
    const res = await api.post('/auth/setup', data);
    if (res.success && res.data && res.data.token) {
      setAdminToken(res.data.token);
      return res.data.admin;
    }
    throw new Error(res.message || 'Initial admin setup failed');
  }

  public logout(): void {
    removeAdminToken();
  }

  public isAuthenticated(): boolean {
    return Boolean(getAdminToken());
  }
}

export const authService = new AuthService();
