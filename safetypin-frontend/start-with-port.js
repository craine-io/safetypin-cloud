/**
 * Cross-platform script to start React app with a specific port
 * To use: node start-with-port.js
 */

const { spawn } = require('child_process');
const os = require('os');

// Set the desired port
const PORT = 3001;

// Determine OS and set command accordingly
const isWindows = os.platform() === 'win32';
let command, args;

if (isWindows) {
  console.log(`Starting React app on Windows with PORT=${PORT}`);
  command = 'cmd.exe';
  args = ['/c', `set PORT=${PORT} && npm start`];
} else {
  console.log(`Starting React app on Unix with PORT=${PORT}`);
  command = 'sh';
  args = ['-c', `PORT=${PORT} npm start`];
}

// Spawn the process
const child = spawn(command, args, { 
  stdio: 'inherit',
  env: { ...process.env },
  shell: true
});

// Handle process events
child.on('error', (error) => {
  console.error(`Error starting process: ${error.message}`);
});

child.on('exit', (code) => {
  console.log(`Process exited with code ${code}`);
});
