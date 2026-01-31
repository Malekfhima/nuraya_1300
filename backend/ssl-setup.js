// SSL/HTTPS Configuration for Production
// This file should be used when deploying to production with HTTPS

const fs = require("fs");
const path = require("path");

// SSL Certificate Configuration
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
  ca: fs.readFileSync(path.join(__dirname, "ssl", "ca-bundle.pem")),
  requestCert: false,
  rejectUnauthorized: false,
};

// HTTPS Server Configuration
const https = require("https");
const express = require("express");

function createHttpsServer(app) {
  return https.createServer(sslOptions, app);
}

// Security Headers for HTTPS
const securityHeaders = (req, res, next) => {
  // HSTS - Force HTTPS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted.cdn.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://api.payment-provider.com; " +
      "frame-ancestors 'none'; " +
      "form-action 'self'; " +
      "base-uri 'self'; " +
      "upgrade-insecure-requests",
  );

  // Other security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );

  next();
};

// Redirect HTTP to HTTPS
const httpsRedirect = (req, res, next) => {
  if (!req.secure && req.get("x-forwarded-proto") !== "https") {
    const httpsUrl = `https://${req.get("host")}${req.url}`;
    return res.redirect(301, httpsUrl);
  }
  next();
};

module.exports = {
  createHttpsServer,
  securityHeaders,
  httpsRedirect,
  sslOptions,
};
