const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.intelligence.io.solutions",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api/v1",
      },
      onProxyRes: function (proxyRes) {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      },
      onError: function (err, req, res) {
        console.error("Proxy Error:", err);
        res.status(500).send("Proxy Error");
      },
    })
  );

  app.use(
    "/api/proxy",
    createProxyMiddleware({
      target: "https://api.intelligence.io.solutions",
      changeOrigin: true,
      pathRewrite: {
        "^/api/proxy": "/api/v1/chat/completions",
      },
      onProxyRes: function (proxyRes) {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
        proxyRes.headers["Access-Control-Allow-Methods"] =
          "GET,OPTIONS,PATCH,DELETE,POST,PUT";
        proxyRes.headers["Access-Control-Allow-Headers"] =
          "Content-Type, Authorization";
      },
      onError: function (err, req, res) {
        console.error("Proxy Error:", err);
        res.status(500).send("Proxy Error");
      },
    })
  );

  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: "https://api.intelligence.io.solutions",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api/v1": "/api/v1",
      },
      onProxyRes: function (proxyRes) {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
        proxyRes.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
        proxyRes.headers["Access-Control-Allow-Headers"] =
          "Content-Type, Authorization";
      },
    })
  );
};
