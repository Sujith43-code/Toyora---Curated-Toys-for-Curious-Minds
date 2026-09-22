import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review';
import { Product } from '../models/Product';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const query: any = {};
    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const query: any = {
      $or: [{ productId }, { product: mongoose.Types.ObjectId.isValid(productId) ? productId : null }],
      status: 'approved',
    };

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product reviews',
      error: error.message,
    });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, customerName, customerEmail, rating, title, comment, childAge } = req.body;

    if (!productId || !customerName || !customerEmail || rating === undefined || !title || !comment) {
      res.status(400).json({
        success: false,
        message: 'Required fields missing: productId, customerName, customerEmail, rating, title, comment',
      });
      return;
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
      return;
    }

    // Check if product exists
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({
        $or: [{ productId }, { slug: String(productId).toLowerCase() }],
      });
    }

    const reviewId = `rev_${Date.now()}`;

    const newReview = await Review.create({
      reviewId,
      product: product ? product._id : undefined,
      productId: product ? product.productId || String(product._id) : productId,
      productName: product ? product.name : 'Toyora Product',
      productImage: product && product.images.length > 0 ? product.images[0] : '',
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      rating: numRating,
      title: title.trim(),
      comment: comment.trim(),
      childAge: childAge || '',
      verifiedPurchase: true,
      status: 'pending', // Requires admin moderation
    });

    // Recalculate product rating if product found and review is approved
    if (product) {
      const approvedReviews = await Review.find({
        $or: [{ product: product._id }, { productId: product.productId }],
        status: 'approved',
      });

      if (approvedReviews.length > 0) {
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        product.rating = Number((totalRating / approvedReviews.length).toFixed(1));
        product.reviewCount = approvedReviews.length;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and pending moderation',
      data: newReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

export const updateReviewModeration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['approved', 'pending', 'hidden'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid review status. Allowed: ${validStatuses.join(', ')}`,
      });
      return;
    }

    let review = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      review = await Review.findById(id);
    }
    if (!review) {
      review = await Review.findOne({ reviewId: id });
    }

    if (!review) {
      res.status(404).json({
        success: false,
        message: `Review not found: ${id}`,
      });
      return;
    }

    review.status = status;
    await review.save();

    // Recalculate product rating
    if (review.product || review.productId) {
      const product = await Product.findOne({
        $or: [{ _id: review.product }, { productId: review.productId }],
      });

      if (product) {
        const approvedReviews = await Review.find({
          $or: [{ product: product._id }, { productId: product.productId }],
          status: 'approved',
        });

        if (approvedReviews.length > 0) {
          const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
          product.rating = Number((totalRating / approvedReviews.length).toFixed(1));
          product.reviewCount = approvedReviews.length;
        } else {
          product.reviewCount = 0;
        }
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Review status updated to '${status}'`,
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review moderation status',
      error: error.message,
    });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let review = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      review = await Review.findById(id);
    }
    if (!review) {
      review = await Review.findOne({ reviewId: id });
    }

    if (!review) {
      res.status(404).json({
        success: false,
        message: `Review not found: ${id}`,
      });
      return;
    }

    await Review.findByIdAndDelete(review._id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      deletedId: id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};
