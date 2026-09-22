import mongoose, { Schema, Document } from 'mongoose';

export interface IProductReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
  childAge?: string;
}

export interface IProduct extends Document {
  productId?: string;
  slug: string;
  sku?: string;
  name: string;
  tagline: string;
  category: string;
  ageBracket: '0-2' | '3-5' | '6-8' | '9-12' | '12+';
  ageDisplay: string;
  playType: 'Build' | 'Create' | 'Explore' | 'Imagine' | 'Move';
  playroomCollection?: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isStaffPick?: boolean;
  isEcoFriendly?: boolean;
  description: string;
  developmentalBenefits: string[];
  features: string[];
  specifications: {
    material: string;
    dimensions: string;
    pieceCount?: number;
    safetyStandards: string;
    care: string;
    boxContents: string;
  };
  images: string[];
  reviews: IProductReview[];
  createdAt: Date;
  updatedAt: Date;
}

const productReviewSchema = new Schema<IProductReview>(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    verified: { type: Boolean, default: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, required: true },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    childAge: { type: String },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    productId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    ageBracket: {
      type: String,
      enum: ['0-2', '3-5', '6-8', '9-12', '12+'],
      required: [true, 'Age bracket is required'],
      index: true,
    },
    ageDisplay: {
      type: String,
      default: '',
    },
    playType: {
      type: String,
      enum: ['Build', 'Create', 'Explore', 'Imagine', 'Move'],
      required: [true, 'Play type is required'],
      index: true,
    },
    playroomCollection: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price must be non-negative'],
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockCount: {
      type: Number,
      default: 0,
      min: [0, 'Stock count cannot be negative'],
    },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isStaffPick: { type: Boolean, default: false },
    isEcoFriendly: { type: Boolean, default: false },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    developmentalBenefits: [{ type: String }],
    features: [{ type: String }],
    specifications: {
      material: { type: String, default: '' },
      dimensions: { type: String, default: '' },
      pieceCount: { type: Number },
      safetyStandards: { type: String, default: '' },
      care: { type: String, default: '' },
      boxContents: { type: String, default: '' },
    },
    images: [{ type: String }],
    reviews: [productReviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Search indexes
productSchema.index({ name: 'text', tagline: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ ageBracket: 1, playType: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
