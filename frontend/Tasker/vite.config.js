import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import history from 'connect-history-api-fallback'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Custom plugin to handle SPA routing
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use(
          history({
            // Exclude API routes and static files
            rewrites: [
              { from: /^\/api\/.*$/, to: function(context) {
                return context.parsedUrl.pathname;
              }},
            ],
            // Don't rewrite requests for files that exist
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
          })
        )
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
