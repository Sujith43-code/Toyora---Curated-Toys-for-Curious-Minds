import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { PRODUCT_CATEGORIES } from '../../src/data/categories';
import { INITIAL_PRODUCTS } from '../../src/data/products';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const countMap = new Map<string, number>();
      INITIAL_PRODUCTS.forEach(p => {
        const cat = p.category.toLowerCase();
        countMap.set(cat, (countMap.get(cat) || 0) + 1);
      });

      const fallbackCategories = PRODUCT_CATEGORIES.map((catName, index) => ({
        _id: `cat_${index + 1}`,
        name: catName,
        slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Curated collection for ${catName}`,
        status: 'active',
        productCount: countMap.get(catName.toLowerCase()) || 0
      }));

      res.status(200).json({
        success: true,
        count: fallbackCategories.length,
        data: fallbackCategories,
      });
      return;
    }

    const categories = await Category.find().sort({ name: 1 });

    // Aggregate active product counts per category
    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    categoryCounts.forEach((c: any) => {
      if (c._id) countMap.set(c._id.toLowerCase(), c.count);
    });

    const enrichedCategories = categories.map((cat: any) => {
      const obj = cat.toObject();
      obj.productCount = countMap.get(cat.name.toLowerCase()) || 0;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: enrichedCategories.length,
      data: enrichedCategories,
    });
  } catch (error: any) {
    const fallbackCategories = PRODUCT_CATEGORIES.map((catName, index) => ({
      _id: `cat_${index + 1}`,
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `Curated collection for ${catName}`,
      status: 'active',
      productCount: 0
    }));
    res.status(200).json({
      success: true,
      count: fallbackCategories.length,
      data: fallbackCategories,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let category = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({
        $or: [{ slug: id.toLowerCase() }, { name: { $regex: `^${id}$`, $options: 'i' } }],
      });
    }

    if (!category) {
      res.status(404).json({
        success: false,
        message: `Category not found: ${id}`,
      });
      return;
    }

    const productCount = await Product.countDocuments({ category: category.name });
    const obj = category.toObject();
    obj.productCount = productCount;

    res.status(200).json({
      success: true,
      data: obj,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, ageBracketFocus, featuredImage, status } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
      return;
    }

    const slug =
      req.body.slug ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Category with name or slug '${name}' already exists`,
      });
      return;
    }

    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      ageBracketFocus: ageBracketFocus || '',
      featuredImage: featuredImage || '',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let category = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      res.status(404).json({
        success: false,
        message: `Category not found: ${id}`,
      });
      return;
    }

    const updated = await Category.findByIdAndUpdate(category._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let category = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      res.status(404).json({
        success: false,
        message: `Category not found: ${id}`,
      });
      return;
    }

    // Safety check: verify if products still use this category
    const dependentProducts = await Product.countDocuments({ category: category.name });
    if (dependentProducts > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category '${category.name}'. ${dependentProducts} products are currently assigned to it. Please reassign or delete these products first.`,
        dependentCount: dependentProducts,
      });
      return;
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      success: true,
      message: `Category '${category.name}' deleted successfully`,
      deletedId: id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};
