const { MongoClient } = require('mongodb');

const {
  MONGO_SERVICE_HOST,
  MONGO_SERVICE_PORT,
} = process.env;

const uri = `mongodb://${MONGO_SERVICE_HOST}:${MONGO_SERVICE_PORT}/analytics`;

module.exports = function initService() {

  function append(args, cb) {
    MongoClient.connect(uri, (err, db) => {
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

          cb(null, { result: result.toString() });
        }
        db.close();
      });

    });
  }

  function list(args, cb) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        return cb(err);
      }

      const logs = db.collection('logs');
      logs.find({}, { limit: 10 }).toArray((err, docs) => {
        if (err) {
          return cb(err);
        }

        cb(null, { list: docs });
        db.close();
      });
    });
  }

  return {
    append,
    list,
  };
};
