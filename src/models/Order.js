import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  description: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    status: { type: String, enum: ['placed','processing','completed','cancelled'], default: 'placed' }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;


