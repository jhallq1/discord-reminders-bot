'use strict';

const redis = require('redis');
const http = require('http');
const nconf = require('nconf');

nconf.argv().env().file('keys.json');

const client = redis.createClient(
  nconf.get('redisPort') || '6379',
  nconf.get('redisHost') || '127.0.0.1',
  {
    'auth_pass': nconf.get('redisKey'),
    'return_buffers': true
  }
).on('error', (err) => console.error('ERR:REDIS:', err));

http.createServer((req, res) => {
  client.on('error', (err) => console.log('Error', err));

  const listName = 'IPs';
  client.lpush(listName, req.connection.remoteAddress);
  client.ltrim(listName, 0, 25);

  let iplist = '';
  client.lrange(listName, 0, -1, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
      return;
    }

    data.forEach((ip) => {
      iplist += `${ip}; `;
    });

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(iplist);
  });
}).listen(process.env.PORT || 8080);

console.log('started web process');
