#!/usr/bin/env node

// This script mimics npm run dev by calling the start script
const { spawn } = require('child_process');
const path = require('path');

// Change to the project directory
process.chdir(__dirname);

console.log('Starting development server...');

// Execute yarn start
const child = spawn('yarn', ['start'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

child.on('error', (error) => {
  console.error('Error starting development server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});