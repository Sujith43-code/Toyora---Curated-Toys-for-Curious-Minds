import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  city: string;
  state: string;
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
  joinedDate: string;
  status: 'active' | 'vip' | 'inactive';
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      select: false, // Exclude password from query results by default
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    addressLine1: {
      type: String,
      default: '',
      trim: true,
    },
    addressLine2: {
      type: String,
      default: '',
      trim: true,
    },
    ordersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastOrderDate: {
      type: Date,
    },
    joinedDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    },
    status: {
      type: String,
      enum: ['active', 'vip', 'inactive'],
      default: 'active',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
