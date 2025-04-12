const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.intelligence.io.solutions",
      changeOrigin: true,
      secure: false,
      onProxyRes: function (proxyRes) {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      },
    })
  );
};
