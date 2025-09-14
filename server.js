import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'net';
import fs from 'fs';
import path from 'path';
import authRoutes from './src/routes/auth.js';
import cartRoutes from './src/routes/cart.js';
import orderRoutes from './src/routes/orders.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yummycart';

// Function to find available port
const findAvailablePort = async (startPort = 8001) => {
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 50) {
      throw new Error('No available ports found');
    }
  }
  return port;
};

// Function to update frontend proxy
const updateFrontendProxy = (port) => {
  try {
    const packageJsonPath = path.join(process.cwd(), '..', 'website', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.proxy = `http://localhost:${port}`;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`📱 Frontend proxy updated to port ${port}`);
  } catch (error) {
    console.log('⚠️  Could not update frontend proxy automatically');
  }
};

// Start server with dynamic port
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Find available port
    const PORT = await findAvailablePort(8001);
    console.log(`🔍 Found available port: ${PORT}`);
    
    // Update frontend proxy automatically
    updateFrontendProxy(PORT);
    
    // Start server on available port
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend API URL: http://localhost:${PORT}/api`);
      console.log(`🔗 MongoDB: ${mongoUri}`);
      console.log('✨ Your backend is ready!');
      console.log(`\n🔄 Frontend proxy updated automatically!`);
      console.log(`📝 Restart your frontend to pick up the new proxy settings.`);
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Payment verification endpoint
app.post('/api/orders/verify-payment', async (req, res) => {
  try {
    const { upiId, amount, timestamp } = req.body;
    
    // In a real implementation, you would:
    // 1. Check with your payment gateway/UPI provider
    // 2. Verify the transaction in your database
    // 3. Check if the amount matches
    // 4. Verify the UPI ID
    
    // For now, we'll simulate verification
    // In production, integrate with your actual payment verification system
    console.log('Payment verification request:', { upiId, amount, timestamp });
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always return success
    // In production, implement actual verification logic
    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      transactionId: `TXN_${Date.now()}`,
      verifiedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start everything
startServer();


