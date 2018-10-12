const bouncy = require('bouncy');

const proxy = bouncy(function (req, res, bounce) {
  console.log(req.headers);
  switch (req.headers.host) {
    case 'mimapunk.hu':
      bounce(81);
      break;
    case 'xn--kinetalld-61a.hu':
      bounce(82);
      break;
  }
});
proxy.listen(80);
console.log("DomainRouter started on port 80.");
