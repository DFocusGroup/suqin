const http = require("http");

const users = {
  A: {
    name: 'a',
    age: 1
  },
  B: {
    name: 'b',
    age: 2
  }
};

const server = http.createServer(function (req, res) {
  const url = require('url').parse(req.url, true);
  const query = url.query;

  if (query.getToken) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('imtoken');
  }
  if (req.headers.authorization === 'imtoken') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end();
  } else {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end();
  }
});

server.listen('3000', function() {
  console.log('testing!');
});

module.exports = server;
