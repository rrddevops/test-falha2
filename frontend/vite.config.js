import { defineConfig } from 'vite';

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; connect-src 'self' http://localhost:3001; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-DNS-Prefetch-Control': 'off'
};

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    headers: securityHeaders
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    headers: securityHeaders
  }
});