import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { INITIAL_PRODUCTS } from '../../src/data/products';

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!uri) {
    if (isProduction) {
      throw new Error('MONGODB_URI environment variable is required in production.');
    }
    console.log('[MongoDB] MONGODB_URI not defined. Running in local in-memory fallback mode (development only).');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'toyora'
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);

    // Synchronize missing initial products safely without deleting existing products
    try {
      if (INITIAL_PRODUCTS && INITIAL_PRODUCTS.length > 0) {
        let addedCount = 0;
        for (const p of INITIAL_PRODUCTS) {
          const existing = await Product.findOne({
            $or: [{ productId: p.id }, { slug: p.slug }]
          });
          if (!existing) {
            await Product.create({
              productId: p.id,
              slug: p.slug,
              sku: p.sku,
              name: p.name,
              tagline: p.tagline,
              category: p.category,
              ageBracket: p.ageBracket,
              ageDisplay: p.ageDisplay,
              playType: p.playType,
              playroomCollection: p.playroomCollection,
              price: p.price,
              originalPrice: p.originalPrice,
              discountPercent: p.discountPercent,
              rating: p.rating,
              reviewCount: p.reviewCount,
              inStock: p.inStock,
              stockCount: p.stockCount,
              isBestSeller: p.isBestSeller,
              isNewArrival: p.isNewArrival,
              isStaffPick: p.isStaffPick,
              isEcoFriendly: p.isEcoFriendly,
              description: p.description,
              developmentalBenefits: p.developmentalBenefits,
              features: p.features,
              specifications: p.specifications,
              images: p.images,
              reviews: p.reviews.map(r => ({
                id: r.id,
                author: r.author,
                verified: r.verified,
                rating: r.rating,
                date: r.date,
                title: r.title,
                comment: r.comment,
                childAge: r.childAge
              }))
            });
            addedCount++;
          }
        }
        if (addedCount > 0) {
          console.log(`[MongoDB] Synchronized ${addedCount} missing initial products into database.`);
        }
      }
    } catch (seedErr) {
      console.error('[MongoDB] Warning: Product synchronization failed:', seedErr);
    }

    return conn;
  } catch (error) {
    if (isProduction) {
      console.error('[MongoDB] Production connection error:', error);
      throw error;
    }
    console.warn('[MongoDB] Connection error (using local fallback mode in development):', error);
    return null;
  }
}

