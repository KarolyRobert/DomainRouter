#!/usr/bin/env node

const bouncy = require("bouncy");
const fs = require("fs");
const tls = require("tls");
const config = require("./src/configParser")("/mnt/Project/webconfig.json");

const http = bouncy(function(req, res, bounce) {
  config.http.map(function(host) {
    if (req.headers.host == host.name) {
      bounce(host.port);
    }
  });
});

var sslRouters = {
  key: config.certs.default.key,
  cert: config.certs.default.cert,
  SNICallback: function(host, cb) {
    var context = tls.createSecureContext(config.certs[host]);
    cb(null, context);
  }
};

const https = bouncy(sslRouters, function(req, res, bounce) {
  config.https.map(function(host) {
    if (req.headers.host == host.name) {
      bounce(host.port);
    }
  });
});

// ports from router virtualserver configuration
http.listen(3000);
https.listen(4000);
