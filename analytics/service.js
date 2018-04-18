const { MongoClient } = require('mongodb');
const { dns } = require('concordant')();

function initService() {
  const dbName = 'analytics';
  let db;
  setup();

  function setup() {
    const mongo = '_main._tcp.mongo.micro.svc.cluster.local';

    dns.resolve(mongo, (err, locs) => {
      if (err) {
        console.error(err);

        return;
      }

      const { host, port } = locs[0];
      const uri = `mongodb://${host}:${port}/${dbName}`;
      MongoClient.connect(uri, (err, conn) => {
        if (err) {
          console.error(err);

          return;
        }
        db = conn.db(dbName);
        db.on('close', () => db = null)
      });
    });
  }

  function append(args, cb) {
    const logs = db.collection('logs');
    const doc = {
      ants: args.ants,
      result: args.result,
      createdAt: new Date(),
    }

    logs.insert(doc, (err, result) => {
      if (err) {
        return cb(err);
      }

      cb(null, { result: result.toString() });
    });
  }

  function list(args, cb) {
    const logs = db.collection('logs');
    logs.find({}, { limit: 10 }).toArray((err, docs) => {
      if (err) {
        return cb(err);
      }

      cb(null, { list: docs });
    });
  }

  return {
    list,
    append,
  }
}

module.exports = initService;