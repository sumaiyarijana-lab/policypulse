const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting PolicyPulse Development Environment...');
console.log('🔹 Backend Server: http://localhost:5000');
console.log('🔹 AI Neural Engine: http://localhost:5001');
console.log('🔹 Frontend Client: http://localhost:3000\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Start Server
const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start Client
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
