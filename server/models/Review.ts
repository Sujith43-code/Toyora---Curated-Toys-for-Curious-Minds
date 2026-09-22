import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  reviewId?: string;
  product?: mongoose.Types.ObjectId;
  productId: string;
  productName: string;
  productImage: string;
  customer?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      index: true,
    },
    productName: {
      type: String,
      default: '',
    },
    productImage: {
      type: String,
      default: '',
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'hidden'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
