const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.intelligence.io.solutions',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/v1'
      },
      onProxyRes: function(proxyRes) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: function(err, req, res) {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
      }
    })
  );
};