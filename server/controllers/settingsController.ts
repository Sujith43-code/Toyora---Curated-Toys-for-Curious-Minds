import { Request, Response } from 'express';
import { Settings } from '../models/Settings';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store settings',
      error: error.message,
    });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update store settings',
      error: error.message,
    });
  }
};
