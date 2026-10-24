import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const BACKEND_RENDER_URL = 'https://navistudo-backend.onrender.com';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Handle preflight CORS for any API call
        if (req.method === 'OPTIONS' && req.url?.startsWith('/api/')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
          res.statusCode = 204;
          res.end();
          return;
        }

        // Forward recommendations endpoints to backend to avoid browser CORS issues
        if (req.url?.startsWith('/api/v1/recommendations')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

          const forwardUrl = `${BACKEND_RENDER_URL}${req.url}`;
          const headers: Record<string, string> = {
            'Accept': 'application/json'
          };
          if (req.headers['authorization']) {
            headers['Authorization'] = String(req.headers['authorization']);
          }
          if (req.headers['content-type']) {
            headers['Content-Type'] = String(req.headers['content-type']);
          }

          let bodyBuffer: Buffer | undefined;
          if (req.method === 'POST' || req.method === 'PUT') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            bodyBuffer = Buffer.concat(chunks);
          }

          const executeForward = async (retryCount = 0): Promise<void> => {
            try {
              const fetchResponse = await fetch(forwardUrl, {
                method: req.method,
                headers,
                body: bodyBuffer ? bodyBuffer.toString('utf-8') : undefined
              });

              res.statusCode = fetchResponse.status;
              res.setHeader('Content-Type', fetchResponse.headers.get('content-type') || 'application/json');

              const responseText = await fetchResponse.text();
              res.end(responseText);
            } catch (err: any) {
              // If Render is waking up (cold start connection timeout), retry once
              if (retryCount < 1) {
                console.warn('[Proxy] Render backend connection waking up, retrying once in 2s...', err?.message);
                await new Promise(r => setTimeout(r, 2000));
                return executeForward(retryCount + 1);
              }
              console.error('[Proxy] Failed to reach Render backend:', err?.message);
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'backend_unavailable',
                message: 'Le serveur de recommandation (Render) est actuellement en cours de démarrage ou injoignable. Veuillez réessayer dans quelques instants.',
                details: err?.message || 'Connection failed'
              }));
            }
          };

          await executeForward();
          return;
        }

        if (req.url === '/api/v1/feedback' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              console.log('[Dev API] Received Feedback:', parsed);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                status: 'success',
                message: 'Feedback received and processed successfully',
                feedback_id: `fb_${Date.now()}`
              }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON payload' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/NAVISTUDO/' : '/',
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
