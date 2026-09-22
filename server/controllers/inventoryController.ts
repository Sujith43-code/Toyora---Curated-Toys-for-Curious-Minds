import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Settings } from '../models/Settings';

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await Settings.findOne();
    const threshold = settings?.lowStockAlertThreshold ?? 10;

    const products = await Product.find()
      .select('productId name sku category price stockCount inStock rating images')
      .sort({ stockCount: 1 });

    const inventoryData = products.map(p => ({
      id: p._id,
      productId: p.productId || String(p._id),
      name: p.name,
      sku: p.sku || 'N/A',
      category: p.category,
      price: p.price,
      stockCount: p.stockCount,
      inStock: p.inStock,
      isLowStock: p.stockCount <= threshold,
      image: p.images && p.images.length > 0 ? p.images[0] : '',
    }));

    res.status(200).json({
      success: true,
      count: inventoryData.length,
      data: inventoryData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory data',
      error: error.message,
    });
  }
};

export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { stockCount } = req.body;

    if (stockCount === undefined || isNaN(Number(stockCount)) || Number(stockCount) < 0) {
      res.status(400).json({
        success: false,
        message: 'Valid non-negative stockCount is required',
      });
      return;
    }

    const qty = Number(stockCount);
    const inStock = qty > 0;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({
        $or: [{ productId }, { slug: String(productId).toLowerCase() }],
      });
    }

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product not found: ${productId}`,
      });
      return;
    }

    product.stockCount = qty;
    product.inStock = inStock;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Inventory updated for '${product.name}'. New stock: ${qty}`,
      data: {
        id: product._id,
        productId: product.productId,
        name: product.name,
        stockCount: product.stockCount,
        inStock: product.inStock,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory',
      error: error.message,
    });
  }
};
