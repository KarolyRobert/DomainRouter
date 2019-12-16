#!/usr/bin/env node

const bouncy = require("bouncy");
const tls = require("tls");
//const net = require("net");
const config = require("webconfigurator")({ router: true });

//console.log(process.env);
var counter = 0;
const http = bouncy(function(req, res, bounce) {
  var bounced = false;
  config.http.map(function(host) {
    if (req.headers.host == host.name) {
      counter++;
      if((counter % 4) === 0){
        console.log("host: "+host.name+" visitcount: ",counter/4);
      } 
      try{
          bounce(host.port, { headers: { ishttp: true } });
          bounced = true;
      }catch(e){
        console.log("Error! host:"+host.name,e.toString());
      }
    }
  });
  if (!bounced) {
    res.statusCode = 404;
    res.end("Az oldal nem elérhető!");
  }
});

var sslRouters = config.https.length === 0 ? null : {
  key: config.certs.default.key,
  cert: config.certs.default.cert,
  SNICallback: function(host, cb) {
    var context = tls.createSecureContext(config.certs[host]);
    cb(null, context);
  }
};

const https = config.https.length === 0 ? null : bouncy(sslRouters, function(req, res, bounce) {
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
if(config.https.length > 0){
  https.listen(config.httpsPort);
}
