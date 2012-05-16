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
  if (req.url != '/nope-status') {
    bounce(servers[count++ % servers.length]);
  } else {
    bounce(9090);
  }
}).listen(80);

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(statusPage.replace('{{count}}', count));
}).listen(9090);
