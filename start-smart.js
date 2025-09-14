import { spawn } from 'child_process';
import { createServer } from 'net';
import fs from 'fs';
import path from 'path';

// Find available port starting from 8000
const findAvailablePort = async (startPort = 8000) => {
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
    if (port > startPort + 100) {
      throw new Error('No available ports found');
    }
  }
  return port;
};

// Update frontend proxy automatically
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

// Main startup function
const startSmart = async () => {
  try {
    console.log('🔍 Finding available port...');
    const port = await findAvailablePort(8000);
    
    console.log(`✅ Found available port: ${port}`);
    updateFrontendProxy(port);
    
    // Set environment variable for the port
    process.env.PORT = port.toString();
    
    console.log(`🚀 Starting server on port ${port}...`);
    
    // Start the main server
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: port.toString() }
    });
    
    server.on('error', (error) => {
      console.error('❌ Failed to start server:', error);
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};

startSmart();
