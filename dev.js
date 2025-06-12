#!/usr/bin/env node
const { spawn } = require('child_process');

// Use yarn since the project is configured for yarn
const child = spawn('yarn', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('Failed to start:', err);
  // Fallback to npm if yarn fails
  const fallback = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true
  });
  
  fallback.on('exit', (code) => {
    process.exit(code || 0);
  });
});