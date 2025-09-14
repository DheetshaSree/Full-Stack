import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { userId, items, fullName, phone, email, address, deliveryFee = 0 } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item' });
    }
    if (!fullName || !phone || !address) {
      return res.status(400).json({ message: 'Missing required customer details' });
    }

    const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
    const totalAmount = subtotal + Number(deliveryFee || 0);

    const order = await Order.create({
      userId,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      fullName,
      phone,
      email,
      address,
      status: 'placed'
    });

    return res.status(201).json({
      message: 'Order created successfully',
      id: order._id.toString(),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


