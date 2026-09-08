import { defineConfig } from 'vite';
import { handleApiRequest } from './server/api.js';
import { initWebSocketServer } from './server/ws.js';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [
    {
      name: 'campus-karma-backend',
      configureServer(server) {
        if (server.httpServer) {
          initWebSocketServer(server.httpServer);
        }

        server.middlewares.use((req, res, next) => {
          handleApiRequest(req, res, next);
        });
      }
    }
  ]
});
