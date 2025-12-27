// This script will be used to set up the frontend project
// Run with: node setup-frontend.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

// Create frontend directory if it doesn't exist
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir);
  console.log('Created frontend directory');
}

// Initialize a new Vite + React project
console.log('Initializing Vite + React project...');
process.chdir(frontendDir);

try {
  // Initialize package.json if it doesn't exist
  if (!fs.existsSync('package.json')) {
    execSync('npm init -y', { stdio: 'inherit' });
    
    // Install required dependencies
    console.log('Installing dependencies...');
    const dependencies = [
      'react@^18.2.0',
      'react-dom@^18.2.0',
      'react-router-dom@^6.14.2',
      'zustand@^4.3.8',
      'axios@^1.4.0',
      'date-fns@^2.30.0',
      'react-icons@^4.10.1'
    ];
    
    const devDependencies = [
      '@vitejs/plugin-react@^4.0.3',
      'autoprefixer@^10.4.14',
      'postcss@^8.4.27',
      'tailwindcss@^3.3.3',
      'vite@^4.4.5'
    ];
    
    execSync(`npm install ${dependencies.join(' ')} --save`, { stdio: 'inherit' });
    execSync(`npm install ${devDependencies.join(' ')} --save-dev`, { stdio: 'inherit' });
    
    console.log('Dependencies installed successfully!');
  }
  
  // Create necessary directories
  const dirs = [
    'src',
    'src/components',
    'src/pages',
    'src/hooks',
    'src/store',
    'src/services',
    'src/assets',
    'src/utils',
    'src/contexts',
    'src/styles'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('Frontend project structure created!');
  
} catch (error) {
  console.error('Error setting up frontend:', error);
  process.exit(1);
}

console.log('Frontend setup complete!');
console.log('Run the following commands to start the development server:');
console.log('cd frontend');
console.log('npm run dev');
