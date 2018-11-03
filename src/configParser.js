const fs = require("fs");

const cPath = "/etc/letsencrypt/live/";

module.exports = file => {
  var config = JSON.parse(fs.readFileSync(file, "utf8"));
  var certs = {};
  config.https.map((host, index) => {
    var key = fs.readFileSync(cPath + host.name + "/privkey.pem", "utf8");
    var cert = fs.readFileSync(cPath + host.name + "/cert.pem", "utf8");
    var ca = fs.readFileSync(cPath + host.name + "/chain.pem", "utf8");
    certs[host.name] = {
      key: key,
      cert: cert,
      ca: ca
    };
    if (index == 0) {
      certs.default = {
        key: key,
        cert: cert,
        ca: ca
      };
    }
    config.certs = certs;
  });
  return config;
};
