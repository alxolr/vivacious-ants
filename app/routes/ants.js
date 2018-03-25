const express = require('express');
const net = require('net');
const nos = require('net-object-stream');
const router = express.Router();

const { ANTSCOUNTER_SERVICE_HOST, ANTSCOUNTER_SERVICE_PORT } = process.env;

router.get('/', function (req, res, next) {
  res.render('ants', { title: 'Ants page', count: 0, ants: '' });
});

router.post('/count', (req, res, next) => {
  const { ants } = req.body;
  const client = createClient('count', {
    host: ANTSCOUNTER_SERVICE_HOST,
    port: ANTSCOUNTER_SERVICE_PORT,
  });

  const role = 'antscounter';
  const cmd = 'count';

  client.once('data', (data) => {
    const { result } = data;
    res.render('ants', { title: 'Ants page', count: result, ants });
  });

  client.write({ role, cmd, ants });
});

function createClient(ns, opts) {
  return createClient[ns] || (createClient[ns] = nos(net.connect(opts)));
}

module.exports = router;
