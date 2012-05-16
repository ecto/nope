#!/usr/bin/env node
var file = process.argv[2];

if (!file) {
  // TODO display usage
  console.log('Must supply a list of servers');
  process.exit();
}

var servers;
try {
  servers = require(process.cwd() + '/' + file);
} catch (e) {}

if (!servers) {
  console.log('Could not find ' + file);
  process.exit();
}

console.log(servers);

var fs = require('fs');
var http = require('http');
var bouncy = require('bouncy');
var count = 0;

var statusPage = fs.readFileSync(__dirname + '/../status.html').toString();

bouncy(function (req, bounce) {
  req.on('error', function () {
    req.destroy();
  });
  if (!~req.url.indexOf('socket.io') && req.url != '/nope-status') {
    //try {
      bounce(servers[count++ % servers.length]).on('error', function () {
        console.log(arguments);
      });
    //} catch (e) {
    //  console.log('Could not bounce to endpoint', e);
    //}
    s.sockets.volatile.emit('count', count);
  } else {
    //try {
      bounce(9090);
    //} catch (e) {
    //  console.log('Could not bounce to status server', e);
    //}
  }
}).listen(80);

var statusServer = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(statusPage.replace('{{count}}', count));
});

statusServer.listen(9090);

var io = require('socket.io');
var s = io.listen(statusServer);
s.set('log level', 0);
