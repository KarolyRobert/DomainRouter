#!/usr/bin/env node

const bouncy = require("bouncy");
const tls = require("tls");
const config = require("webconfigurator")({ router: true });

console.log(process.env);

const http = bouncy(function(req, res, bounce) {
  var bounced = false;
  config.http.map(function(host) {
    if (req.headers.host == host.name) {
      bounced = true;
      bounce(host.port, { headers: { ishttp: true } });
    }
  });
  if (!bounced) {
    res.statusCode = 404;
    res.end("no such host");
  }
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
  var bounced = false;
  config.https.map(function(host) {
    if (req.headers.host == host.name) {
      bounced = true;
      bounce(host.port);
    }
  });
  if (!bounced) {
    bounce("http://" + req.headers.host);
  }
});

// ports from router virtualserver configuration
http.listen(config.httpPort);
https.listen(config.httpsPort);
