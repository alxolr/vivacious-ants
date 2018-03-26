const { MongoClient } = require('mongodb');

const {
  MONGO_SERVICE_HOST,
  MONGO_SERVICE_PORT,
} = process.env;

const uri = `mongodb://${MONGO_SERVICE_HOST}:${MONGO_SERVICE_PORT}`;
const databaseName = 'analytics';

module.exports = function initService() {

  function append(args, cb) {
    MongoClient.connect(uri, (err, client) => {
      const db = client.db(databaseName);

      if (err) {
        return cb(err);
      }

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
        client.close();
      });

    });
  }

  function list(args, cb) {
    MongoClient.connect(uri, (err, client) => {
      if (err) {
        return cb(err);
      }

      const db = client.db(databaseName);
      const logs = db.collection('logs');
      logs.find({}, { limit: 10 }).toArray((err, docs) => {
        if (err) {
          return cb(err);
        }

        cb(null, { list: docs });
        client.close();
      });
    });
  }

  return {
    append,
    list,
  };
};
