module.exports = function initService() {
  function count(args, cb) {
    const { ants } = args;

    if (!ants) return cb(null, { result: 0 });

    const start = {
      a: 0,
      n: 0,
      t: 0,
    };

    const bodyParts = ants.split('.')
      .map(ant => ant.replace(/ant/g, ''))
      .join('')
      .replace(/\s+/g, '')
      .split('')
      .reduce((prev, curr) => {
        prev[curr] += 1;

        return prev;
      }, start);

    return cb(null, { result: Math.max(bodyParts.a, bodyParts.n, bodyParts.t) });
  }

  return {
    count,
  };
};
