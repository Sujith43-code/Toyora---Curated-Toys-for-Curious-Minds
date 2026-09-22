import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  storeEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  estimatedDeliveryDays: string;
  enableCod: boolean;
  enableUpi: boolean;
  enableCards: boolean;
  lowStockAlertThreshold: number;
  emailNotifications: boolean;
  orderDispatchAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    storeName: {
      type: String,
      default: 'TOYORA Wooden & Playroom Essentials',
      trim: true,
    },
    storeEmail: {
      type: String,
      default: 'hello@toyora.in',
      trim: true,
      lowercase: true,
    },
    supportPhone: {
      type: String,
      default: '+91 80 4910 2200',
      trim: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    freeShippingThreshold: {
      type: Number,
      default: 999,
      min: 0,
    },
    standardDeliveryFee: {
      type: Number,
      default: 99,
      min: 0,
    },
    estimatedDeliveryDays: {
      type: String,
      default: '2–4 Business Days',
    },
    enableCod: {
      type: Boolean,
      default: true,
    },
    enableUpi: {
      type: Boolean,
      default: true,
    },
    enableCards: {
      type: Boolean,
      default: true,
    },
    lowStockAlertThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    orderDispatchAlerts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
