import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { INITIAL_PRODUCTS } from '../../src/data/products';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      age,
      play,
      inStock,
      minPrice,
      maxPrice,
      sortBy,
      bestSeller,
      newArrival,
    } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let items = [...INITIAL_PRODUCTS];

      if (search && typeof search === 'string' && search.trim()) {
        const q = search.trim().toLowerCase();
        items = items.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.tagline.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q)
        );
      }

      if (category && typeof category === 'string') {
        const categories = category.split(',').map(c => c.trim().toLowerCase());
        items = items.filter(p => categories.includes(p.category.toLowerCase()));
      }

      if (age && typeof age === 'string') {
        const ages = age.split(',').map(a => a.trim());
        items = items.filter(p => ages.includes(p.ageBracket));
      }

      if (play && typeof play === 'string') {
        const plays = play.split(',').map(p => p.trim().toLowerCase());
        items = items.filter(p => plays.includes(p.playType.toLowerCase()));
      }

      if (inStock === 'true') {
        items = items.filter(p => p.inStock);
      }

      if (bestSeller === 'true') {
        items = items.filter(p => p.isBestSeller);
      }

      if (newArrival === 'true') {
        items = items.filter(p => p.isNewArrival);
      }

      if (minPrice) {
        items = items.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        items = items.filter(p => p.price <= Number(maxPrice));
      }

      if (sortBy === 'price-asc') {
        items.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        items.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
      }

      res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
      return;
    }

    const query: any = {};

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    if (category && typeof category === 'string') {
      const categories = category.split(',').map(c => c.trim());
      query.category = { $in: categories };
    }

    if (age && typeof age === 'string') {
      const ages = age.split(',').map(a => a.trim());
      query.ageBracket = { $in: ages };
    }

    if (play && typeof play === 'string') {
      const plays = play.split(',').map(p => p.trim());
      query.playType = { $in: plays };
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (bestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (newArrival === 'true') {
      query.isNewArrival = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions: any = { createdAt: -1 };
    if (sortBy === 'price-asc') sortOptions = { price: 1 };
    else if (sortBy === 'price-desc') sortOptions = { price: -1 };
    else if (sortBy === 'rating') sortOptions = { rating: -1 };
    else if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const products = await Product.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    // Fallback to INITIAL_PRODUCTS if DB query fails
    res.status(200).json({
      success: true,
      count: INITIAL_PRODUCTS.length,
      data: INITIAL_PRODUCTS,
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const product = INITIAL_PRODUCTS.find(p => p.id === id || p.slug === id.toLowerCase());
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product not found with ID or slug: ${id}`,
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: product,
      });
      return;
    }

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({
        $or: [{ productId: id }, { slug: id.toLowerCase() }],
      });
    }

    if (!product) {
      const fallback = INITIAL_PRODUCTS.find(p => p.id === id || p.slug === id.toLowerCase());
      if (fallback) {
        res.status(200).json({ success: true, data: fallback });
        return;
      }
      res.status(404).json({
        success: false,
        message: `Product not found with ID or slug: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    const { id } = req.params;
    const fallback = INITIAL_PRODUCTS.find(p => p.id === id || p.slug === id.toLowerCase());
    if (fallback) {
      res.status(200).json({ success: true, data: fallback });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      ageBracket,
      playType,
      description,
      stockCount,
    } = req.body;

    if (!name || price === undefined || !category || !ageBracket || !playType || !description) {
      res.status(400).json({
        success: false,
        message: 'Required fields missing: name, price, category, ageBracket, playType, description',
      });
      return;
    }

    if (Number(price) < 0) {
      res.status(400).json({
        success: false,
        message: 'Price must be a positive number',
      });
      return;
    }

    const stock = stockCount !== undefined ? Number(stockCount) : 10;
    const computedInStock = stock > 0;

    const slug =
      req.body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const productId = req.body.productId || `toy_${Date.now()}`;

    const newProduct = await Product.create({
      ...req.body,
      productId,
      slug,
      price: Number(price),
      originalPrice: originalPrice !== undefined ? Number(originalPrice) : Number(price),
      stockCount: stock,
      inStock: computedInStock,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Product with this slug or productId already exists',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({
        $or: [{ productId: id }, { slug: id.toLowerCase() }],
      });
    }

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`,
      });
      return;
    }

    const updates = { ...req.body };

    if (updates.stockCount !== undefined) {
      updates.stockCount = Number(updates.stockCount);
      updates.inStock = updates.stockCount > 0;
    }

    if (updates.price !== undefined && Number(updates.price) < 0) {
      res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(product._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({
        $or: [{ productId: id }, { slug: id.toLowerCase() }],
      });
    }

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`,
      });
      return;
    }

    await Product.findByIdAndDelete(product._id);

    // Clean up related reviews safely
    await Review.deleteMany({
      $or: [{ product: product._id }, { productId: product.productId }, { productId: id }],
    });

    res.status(200).json({
      success: true,
      message: 'Product and associated reviews deleted successfully',
      deletedId: id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
