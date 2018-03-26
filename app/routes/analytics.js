const express = require('express');
const net = require('net');
const nos = require('net-object-stream');
const router = express.Router();

const { ANALYTICS_SERVICE_HOST, ANALYTICS_SERVICE_PORT } = process.env;

router.get('/', function (req, res, next) {
  const client = createClient('analytics', {
    host: ANALYTICS_SERVICE_HOST,
    port: ANALYTICS_SERVICE_PORT,
  });

  const role = 'analytics';
  const cmd = 'list';

  client.once('data', (data) => {
    const { result } = data;
    res.render('analytics', { title: 'Analytics', list: data.list });
  });

  client.write({ role, cmd, ants });
});

function createClient(ns, opts) {
  return createClient[ns] || (createClient[ns] = nos(net.connect(opts)));
}

module.exports = router;
