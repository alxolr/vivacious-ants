const { MongoClient } = require('mongodb');
const { dns } = require('concordant')();

module.exports = initService;

function initService() {
  let db;
  const dbName = 'events';

  setup();

  function setup() {
    const mongo = '_main._tcp.mongo.vivaciousants.svc.cluster.local';

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

  function record(args, cb) {
    if (!db) {
      cb(Error('No database connection'))
      return
    }

    const events = db.collection('events');
    const data = {
      ts: Date.now(),
      eventType: args.type,
      url: args.url,
    }

    events.insert(data, (err, result) => {
      if (err) {
        cb(err);

        return;
      }
      cb(null, result);
    });
  }

  function list(args, cb) {
    if (!db) {
      cb(Error('No database connection'))
      return
    }

    const summary = {};
    const events = db.collection('events');
    events.find({}).toArray((err, docs) => {
      if (err) return cb(err);

      function countSummary(acc, doc) {
        if (!acc[doc.url]) {
          acc[doc.url] = 1;
        } else {
          acc[doc.url] += 1;
        }

        return acc;
      }

      cb(null, docs.reduce(countSummary, summary));
    });
  }

  return {
    list,
    record,
  }
}
