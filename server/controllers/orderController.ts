import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { Settings } from '../models/Settings';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    const query: any = {};

    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { orderId: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { customerEmail: { $regex: q, $options: 'i' } },
        { 'customerDetails.fullName': { $regex: q, $options: 'i' } },
        { 'customerDetails.email': { $regex: q, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order not found with ID: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer, items, paymentMethod, isGift, giftMessage, deliveryNotes } = req.body;

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.addressLine1 || !customer.city || !customer.state || !customer.pincode) {
      res.status(400).json({
        success: false,
        message: 'Complete customer shipping address is required (fullName, email, phone, addressLine1, city, state, pincode)',
      });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart items cannot be empty',
      });
      return;
    }

    // Load store settings for delivery fee calculations
    let settings = await Settings.findOne();
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 999;
    const standardDeliveryFee = settings?.standardDeliveryFee ?? 99;

    let verifiedSubtotal = 0;
    const validatedItems: any[] = [];

    // Verify each product and stock availability
    for (const item of items) {
      const { productId, quantity } = item;
      const qty = Number(quantity);

      if (!qty || qty <= 0 || !Number.isInteger(qty)) {
        res.status(400).json({
          success: false,
          message: `Invalid product quantity: ${quantity}`,
        });
        return;
      }

      // Lookup product by ObjectId or custom productId
      let dbProduct = null;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        dbProduct = await Product.findById(productId);
      }
      if (!dbProduct) {
        dbProduct = await Product.findOne({
          $or: [{ productId }, { slug: String(productId).toLowerCase() }],
        });
      }

      if (!dbProduct) {
        res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
        return;
      }

      if (dbProduct.stockCount < qty) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${dbProduct.name}'. Available: ${dbProduct.stockCount}, Requested: ${qty}`,
        });
        return;
      }

      const itemTotal = dbProduct.price * qty;
      verifiedSubtotal += itemTotal;

      validatedItems.push({
        product: dbProduct._id,
        productId: dbProduct.productId || String(dbProduct._id),
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: qty,
        image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '',
      });
    }

    // Calculate shipping fee and final total on server
    const shippingFee = verifiedSubtotal >= freeShippingThreshold ? 0 : standardDeliveryFee;
    const discount = req.body.discount ? Math.max(0, Number(req.body.discount)) : 0;
    const verifiedTotal = Math.max(0, verifiedSubtotal + shippingFee - discount);

    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Decrement product stock quantities
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockCount: -item.quantity },
      });

      // Update inStock flag if stock reaches 0
      const updatedP = await Product.findById(item.product);
      if (updatedP && updatedP.stockCount <= 0) {
        updatedP.inStock = false;
        await updatedP.save();
      }
    }

    // Save order
    const newOrder = await Order.create({
      orderId,
      customerDetails: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        addressLine1: customer.addressLine1.trim(),
        addressLine2: customer.addressLine2 || '',
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        deliveryNotes: deliveryNotes || '',
        isGift: Boolean(isGift),
        giftMessage: giftMessage || '',
      },
      customerName: customer.fullName.trim(),
      customerEmail: customer.email.trim().toLowerCase(),
      customerPhone: customer.phone.trim(),
      shippingAddress: {
        line1: customer.addressLine1.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
      },
      items: validatedItems,
      subtotal: verifiedSubtotal,
      shipping: shippingFee,
      discount,
      total: verifiedTotal,
      totalAmount: verifiedTotal,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending',
      trackingNumber: '',
      estimatedDeliveryDate: '2–4 Business Days',
      estimatedDelivery: '2–4 Business Days',
    });

    // Sync Customer metrics
    const emailLower = customer.email.trim().toLowerCase();
    let dbCustomer = await Customer.findOne({ email: emailLower });
    if (dbCustomer) {
      dbCustomer.ordersCount += 1;
      dbCustomer.totalSpent += verifiedTotal;
      dbCustomer.lastOrderDate = new Date();
      if (dbCustomer.totalSpent > 5000) dbCustomer.status = 'vip';
      await dbCustomer.save();
    } else {
      await Customer.create({
        fullName: customer.fullName.trim(),
        email: emailLower,
        phone: customer.phone.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        addressLine1: customer.addressLine1.trim(),
        ordersCount: 1,
        totalSpent: verifiedTotal,
        lastOrderDate: new Date(),
        status: verifiedTotal > 5000 ? 'vip' : 'active',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'confirmed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`,
      });
      return;
    }

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order not found with ID: ${id}`,
      });
      return;
    }

    order.status = status;
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

export const updateOrderTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { trackingNumber, estimatedDeliveryDate } = req.body;

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order not found with ID: ${id}`,
      });
      return;
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (estimatedDeliveryDate !== undefined) {
      order.estimatedDeliveryDate = estimatedDeliveryDate;
      order.estimatedDelivery = estimatedDeliveryDate;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order tracking details updated successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update tracking details',
      error: error.message,
    });
  }
};
