const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Always set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  console.log('Proxying:', req.method, req.url);
  next();
});

// Proxy /v1 to the real API, no pathRewrite needed
app.use('/v1', createProxyMiddleware({
  target: 'https://api.relationshipmenu.org/v1',
  changeOrigin: true
}));

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}`);
}); 