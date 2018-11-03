#!/usr/bin/env node

const bouncy = require("bouncy");
const fs = require("fs");
const tls = require("tls");

const http = bouncy(function(req, res, bounce) {
  switch (req.headers.host) {
    case "mimapunk.hu":
      bounce(3001);
      break;
    case "xn--kinetalld-61a.hu":
      bounce(3002);
      break;
  }
});

const cPath = "/etc/letsencrypt/live/";
var certs = {
  "mimapunk.hu": {
    key: fs.readFileSync(cPath + "mimapunk.hu/privkey.pem", "utf8"),
    cert: fs.readFileSync("/etc/letsencrypt/live/mimapunk.hu/cert.pem", "utf8"),
    ca: fs.readFileSync("/etc/letsencrypt/live/mimapunk.hu/chain.pem", "utf8")
  },
  "xn--kinetalld-61a.hu": {
    key: fs.readFileSync(cPath + "xn--kinetalld-61a.hu/privkey.pem", "utf8"),
    cert: fs.readFileSync(cPath + "xn--kinetalld-61a.hu/cert.pem", "utf8"),
    ca: fs.readFileSync(cPath + "xn--kinetalld-61a.hu/chain.pem", "utf8")
  }
};
console.log();

var sslRouters = {
  key: certs["mimapunk.hu"].key,
  cert: certs["mimapunk.hu"].cert,
  SNICallback: function(host, cb) {
    var context = tls.createSecureContext(certs[host]);
    cb(null, context);
  }
};

const https = bouncy(sslRouters, function(req, res, bounce) {
  console.log(req.headers);
  switch (req.headers.host) {
    case "mimapunk.hu":
      bounce(4001);
      break;
    case "xn--kinetalld-61a.hu":
      bounce(4002);
      break;
  }
});

http.listen(3000);
https.listen(4000);
