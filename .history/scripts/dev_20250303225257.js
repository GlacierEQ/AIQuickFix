#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting development environment...');

// Run TypeScript watch mode
const tscWatch = spawn('npm', ['run', 'watch'], { 
  shell: true,
  stdio: 'inherit'
});

// Wait a bit for the TypeScript compiler to start
setTimeout(() => {
  console.log('⚙️ Starting extension development server...');
  
  // Launch VS Code with the extension
  const vscodeProcess = spawn('code', [
    '--extensionDevelopmentPath',
    path.resolve(__dirname, '..')
  ], {
    shell: true,
    stdio: 'inherit'
  });

  vscodeProcess.on('error', (err) => {
    console.error('Failed to start VS Code:', err);
  });

}, 3000);

// Handle termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development environment...');
  tscWatch.kill();
  process.exit();
});
