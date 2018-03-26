const express = require('express');
const net = require('net');
const nos = require('net-object-stream');
const router = express.Router();

const {
  ANTSCOUNTER_SERVICE_HOST,
  ANTSCOUNTER_SERVICE_PORT,
  ANALYTICS_SERVICE_HOST,
  ANALYTICS_SERVICE_PORT,
} = process.env;

router.get('/', function (req, res, next) {
  res.render('ants', { title: 'Ants page', count: 0, ants: '' });
});

router.post('/count', (req, res, next) => {
  const { ants } = req.body;
  const clients = {
    antscounter: createClient('antscounter', { host: ANTSCOUNTER_SERVICE_HOST, port: ANTSCOUNTER_SERVICE_PORT }),
    analytics: createClient('analytics', { host: ANALYTICS_SERVICE_HOST, port: ANALYTICS_SERVICE_PORT }),
  }

  clients.antscounter.once('data', (data) => {
    const { result } = data;
    clients.analytics.write({ role: 'analytics', cmd: 'log', ants, result }); // we are logging asynchronously
    res.render('ants', { title: 'Ants page', count: result, ants });
  });

  clients.antscounter.write({ role: 'antscounter', cmd: 'count', ants });
});

function createClient(ns, opts) {
  return createClient[ns] || (createClient[ns] = nos(net.connect(opts)));
}

module.exports = router;
