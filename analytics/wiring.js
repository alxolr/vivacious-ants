const net = require('net');
const nos = require('net-object-stream');
const through = require('through2');
const pump = require('pump');
const bloomrun = require('bloomrun');

const {
  ANALYTICS_SERVICE_PORT,
} = process.env;

module.exports = wire;

function wire(service) {
  const patterns = createPatternRoutes(service);
  const matcher = createMatcherStream(patterns);

  const server = net.createServer((socket) => {
    socket = nos(socket);
    pump(socket, matcher, socket, failure);
  });

  server.listen(ANALYTICS_SERVICE_PORT, '0.0.0.0', () => {
    console.log('server listening at', ANALYTICS_SERVICE_PORT);
  });
}

function createPatternRoutes(service) {
  const patterns = bloomrun();
  patterns.add({ role: 'analytics', cmd: 'log' }, service.append);
  patterns.add({ role: 'analytics', cmd: 'list' }, service.list);

  return patterns;
}

function createMatcherStream(patterns) {
  return through.obj((obj, enc, cb) => {
    const match = patterns.lookup(obj);

    if (match === null) {
      return cb();
    }

    return match(obj, (err, data) => {
      if (err) {
        return cb(null, { status: 'error', err });
      }

      return cb(null, data);
    });
  });
}

function failure(err) {
  if (err) {
    console.error('Server error', err);
  } else {
    console.error('Stream pipeline ended');
  }
}