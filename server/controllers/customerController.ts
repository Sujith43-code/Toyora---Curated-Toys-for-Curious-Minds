import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Customer } from '../models/Customer';
import { Order } from '../models/Order';

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    const query: any = {};
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).select('-password').sort({ totalSpent: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message,
    });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let customer = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      customer = await Customer.findById(id).select('-password');
    }
    if (!customer) {
      customer = await Customer.findOne({ email: id.toLowerCase() }).select('-password');
    }

    if (!customer) {
      res.status(404).json({
        success: false,
        message: `Customer not found: ${id}`,
      });
      return;
    }

    // Fetch customer recent order history
    const customerOrders = await Order.find({
      $or: [{ customerEmail: customer.email }, { 'customerDetails.email': customer.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        customer,
        orders: customerOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer profile',
      error: error.message,
    });
  }
};
