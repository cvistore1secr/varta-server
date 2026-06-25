// Varta Server - Private Chat Server
// Run: node server.js

const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`
╔═══════════════════════════════╗
║   Varta Server Chalu Hai! 💕  ║
║   Port: ${PORT}                  ║
╚═══════════════════════════════╝
`);

const clients = new Set();

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`✓ Naya connection: ${ip}`);
  clients.add(ws);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log(`Message from ${msg.sender}: ${msg.text || '[Photo]'}`);

      // Sab clients ko bhejo (sender ko bhi)
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } catch (e) {
      console.error('Error:', e);
    }
  });

  ws.on('close', () => {
    console.log(`✗ Connection band: ${ip}`);
    clients.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    clients.delete(ws);
  });
});

console.log('Server ready! App mein yeh URL daalo:');
console.log('ws://YOUR_IP:8080');
console.log('\nApna IP dhundho: ipconfig command se\n');
