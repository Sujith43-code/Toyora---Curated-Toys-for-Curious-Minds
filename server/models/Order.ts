import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrderCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryNotes?: string;
  isGift?: boolean;
  giftMessage?: string;
}

export interface IOrder extends Document {
  orderId: string;
  customer?: mongoose.Types.ObjectId;
  customerDetails: IOrderCustomerDetails;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  totalAmount?: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'confirmed' | 'cancelled';
  trackingNumber: string;
  estimatedDeliveryDate: string;
  estimatedDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderCustomerDetailsSchema = new Schema<IOrderCustomerDetails>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, default: '', trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    deliveryNotes: { type: String, default: '' },
    isGift: { type: Boolean, default: false },
    giftMessage: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerDetails: {
      type: orderCustomerDetailsSchema,
      required: true,
    },
    customerName: { type: String },
    customerEmail: { type: String, index: true },
    customerPhone: { type: String },
    shippingAddress: {
      line1: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    items: {
      type: [orderItemSchema],
      validate: [(val: IOrderItem[]) => val.length > 0, 'Order must contain at least one item'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    shipping: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'cod'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    estimatedDeliveryDate: {
      type: String,
      default: '',
    },
    estimatedDelivery: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
