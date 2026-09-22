import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id?: string;
  name: string;
  slug: string;
  description: string;
  ageBracketFocus: string;
  productCount: number;
  featuredImage: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    ageBracketFocus: {
      type: String,
      default: '',
      trim: true,
    },
    productCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
