require("dotenv-flow").config();
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

var app = express();

const PROXY_PORT = 8400;
const UI_PORT = 8401;
const LEGACY_PORT = 8402;

// Proxy API endpoints to the MAAS.
app.use(
  createProxyMiddleware(
    [`${process.env.BASENAME}/api`, `${process.env.BASENAME}/accounts`],
    {
      target: process.env.MAAS_URL,
    }
  )
);

// Proxy the WebSocket API endpoint to the MAAS.
app.use(
  createProxyMiddleware(`${process.env.BASENAME}/ws`, {
    target: process.env.MAAS_URL,
    ws: true,
  })
);

app.use(
  createProxyMiddleware(
    [`${process.env.BASENAME}/`, "/root-application.js", "/0.js"],
    {
      target: `http://localhost:8080/`,
    }
  )
);

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
