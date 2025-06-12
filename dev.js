#!/usr/bin/env node
const { spawn } = require('child_process');

// Run the start script since dev doesn't exist
const child = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});