import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Middleware helper to validate if a string is a valid MongoDB ObjectId or non-empty ID parameter.
 */
export function isValidId(id: string): boolean {
  if (!id) return false;
  if (mongoose.Types.ObjectId.isValid(id)) return true;
  // Allow alphanumeric string IDs used in seed datasets (e.g. 'toy_01', 'cat_01', 'ORD-2026-8812')
  return typeof id === 'string' && id.trim().length > 0;
}

export function validateObjectId(req: Request, res: Response, next: NextFunction): void {
  const { id, productId } = req.params;
  const targetId = id || productId;

  if (targetId && !isValidId(targetId)) {
    res.status(400).json({
      success: false,
      message: `Invalid ID format provided: ${targetId}`
    });
    return;
  }
  next();
}
