import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'toyora_jwt_secure_secret_key_2026';
const JWT_EXPIRES_IN = '24h';

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.',
      });
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
      return;
    }

    if (!admin.active) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact system support.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
      return;
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error: any) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during authentication.',
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin profile',
    });
  }
}

/**
 * Setup Initial Admin endpoint
 * Allows creation of initial admin ONLY if 0 admins exist in database
 */
export async function setupInitialAdmin(req: Request, res: Response): Promise<void> {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Initial admin setup is disabled because admin accounts already exist.',
      });
      return;
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      name: name.trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: 'admin',
      active: true,
    });

    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Initial admin account created successfully',
      data: {
        token,
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      },
    });
  } catch (error: any) {
    console.error('Error setting up initial admin:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to setup initial admin',
    });
  }
}
