import { WebSocketServer, WebSocket } from 'ws';

let wss = null;
const clients = new Set();

export function initWebSocketServer(httpServer) {
  wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws, req) => {
    clients.add(ws);
    ws.userId = null;

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'IDENTIFY') {
          ws.userId = message.userId;
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });

    // Send initial welcome
    ws.send(JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() }));
  });

  console.log('[WS] WebSocket Server initialized on /ws');
  return wss;
}

export function broadcast(event) {
  if (!wss) return;
  const payload = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

export function sendToUser(userId, event) {
  if (!wss) return;
  const payload = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      client.send(payload);
    }
  }
}
