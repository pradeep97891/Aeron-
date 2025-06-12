#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting React app with JSON server...');

// Start JSON server on port 3001
const jsonServer = spawn('npx', ['json-server', '--port', '3001', '--watch', 'public/api/db.json'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true,
  cwd: __dirname
});

// Start React development server
const reactApp = spawn('npm', ['run', 'dev'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true,
  cwd: __dirname
});

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  jsonServer.kill('SIGTERM');
  reactApp.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  jsonServer.kill('SIGTERM');
  reactApp.kill('SIGTERM');
  process.exit(0);
});

jsonServer.on('error', (error) => {
  console.error('JSON Server error:', error);
});

reactApp.on('error', (error) => {
  console.error('React App error:', error);
});

jsonServer.on('exit', (code) => {
  if (code !== 0) {
    console.log(`JSON Server exited with code ${code}`);
  }
});

reactApp.on('exit', (code) => {
  if (code !== 0) {
    console.log(`React App exited with code ${code}`);
  }
});