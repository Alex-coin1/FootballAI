import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function footballApiPlugin() {
  const handler = async (req: any, res: any, next: any) => {
    const url = req.url || '';
    if (!url.startsWith('/api/')) {
      return next();
    }

    const dataPath = path.resolve(__dirname, 'src/data/realMatches.json');

    if (url === '/api/matches' || url.startsWith('/api/matches?')) {
      try {
        if (fs.existsSync(dataPath)) {
          const content = fs.readFileSync(dataPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=60');
          res.end(content);
          return;
        }
      } catch (err) {
        console.error('Error serving real matches:', err);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify([]));
      return;
    }

    if (url.startsWith('/api/crest-proxy?')) {
      try {
        const parsed = new URL(url, 'http://localhost:3000');
        const targetUrl = parsed.searchParams.get('url');
        if (targetUrl && (targetUrl.startsWith('https://crests.football-data.org/') || targetUrl.startsWith('http://crests.football-data.org/'))) {
          const resp = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          if (resp.ok) {
            const contentType = resp.headers.get('content-type') || 'image/png';
            const buffer = await resp.arrayBuffer();
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(Buffer.from(buffer));
            return;
          }
        }
      } catch (err) {
        console.error('Crest proxy error:', err);
      }
      res.statusCode = 404;
      res.end('Crest not found');
      return;
    }

    if (url === '/api/matches/status' || url === '/api/matches/sync') {
      let count = 0;
      try {
        if (fs.existsSync(dataPath)) {
          const items = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
          count = items.length;
        }
      } catch (e) {}
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        status: 'online',
        provider: 'api.football-data.org',
        hasKey: !!process.env.FOOTBALL_API_KEY,
        realMatchesCount: count,
        source: 'FOOTBALL_API_KEY',
        competitions: ['Premier League (PL)', 'La Liga (PD)', 'UEFA Champions League (CL)']
      }));
      return;
    }

    next();
  };

  return {
    name: 'football-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      footballApiPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'FootballAI',
          short_name: 'FAI',
          description: 'Where Football Meets Intelligence - Match predictions, pilot rewards, and digital collectibles.',
          theme_color: '#060b14',
          background_color: '#060b14',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
