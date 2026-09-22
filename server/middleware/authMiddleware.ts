import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin, IAdmin } from '../models/Admin';

export interface AuthenticatedRequest extends Request {
  admin?: IAdmin;
}

const JWT_SECRET = process.env.JWT_SECRET || 'toyora_jwt_secure_secret_key_2026';

export async function authenticateAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as an administrator.',
      });
      return;
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing.',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
      return;
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Admin account not found.',
      });
      return;
    }

    if (!admin.active) {
      res.status(403).json({
        success: false,
        message: 'Admin account has been deactivated.',
      });
      return;
    }

    req.admin = admin;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Invalid or corrupted authentication token.',
    });
  }
}

export function requireAdminRole(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'superadmin')) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator rights required.',
    });
    return;
  }
  next();
}
