import { defineConfig } from 'vite'
const backend = {
  target: 'http://127.0.0.1:3001',
  changeOrigin: false,
  configure(proxy) {
    proxy.on('proxyReq', (proxyReq, req) => {
      if (req.headers.origin) proxyReq.setHeader('Origin', req.headers.origin)
    })
  },
}
export default defineConfig({ server: {
  fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/server/data/**'] },
  proxy: { '/api': backend, '/uploads': backend },
} })
