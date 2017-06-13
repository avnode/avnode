const _ = require('lodash');
const async = require('async');
const args = require('minimist')(process.argv.slice(2));
const config = require('dotenv').load({path: '.env.local'});
const MongoClient = require('mongodb').MongoClient;
const es = require('./lib/plugins/elasticsearch').getClient();
const INDEX = require('./lib/plugins/elasticsearch').INDEX;
const indexHelper = {
  crews: require('./lib/plugins/elasticsearch/Crew').cleanForIndex,
  users: require('./lib/plugins/elasticsearch/User').cleanForIndex,
  events: require('./lib/plugins/elasticsearch/Event').cleanForIndex,
  performances: require('./lib/plugins/elasticsearch/Performance').cleanForIndex
};

const TYPES = [
  'users', 'events', 'performances', 'crews'
];

const index = (doc, done) => {
  es.index(doc, (error, _res) => {
    if (error) {
      console.log(`Indexing failed for ${doc.id}`);
      throw err;
    } else {
      console.log(`Indexing successful for ${doc.id}`);
      done();
    }
  });
};

const removeFromIndex = (type, cb) => {
  //FIXME we get type as e.g. crews but have to delete by type which is crew
  const t = type.slice(0, -1);
  es.deleteByQuery({
    index: INDEX,
    body: {
      query: {
        term: { _type: t }
      }
    }
  }, (err, _res) => {
    if (err) {
      throw err;
    }
    cb();
  })
};

const reindex = (db, types, done) => {
  async.eachSeries(types, (type, next) => {
    removeFromIndex(type, () => {
      console.log(`Removed all documents from type ${type}`);
      console.log(`Start reindexing ${type}`);
      const collection = db.collection(type);
      collection.find({}).toArray((err, docs) => {
        if (err) {
          throw err;
        }
        async.each(docs, (doc, cb) => {
          index(indexHelper[type](doc), () => {
            cb();
          });
        }, () => {
          next();
        });
      });
    });
  }, () => {
    end(db);
  });
};

const connect = (next) => {
  console.log('Establish connection to ' + config.MONGODB_URI);
  MongoClient.connect(config.MONGODB_URI, (err, db) => {
    if (err) {
      throw err;
    }
    next(db);
  });
};

const end = (db) => {
  console.log('Close connection');
  db.close();
  process.exit();
};

const initialize = () => {
  const affected = _.intersection(TYPES, args._);
  if (args.all === true || affected.length !== 0) {
    connect((db) => {
      if (args.all === true) {
        reindex(db, TYPES);
      } else {
        reindex(db, affected);
      }
    });
  } else {
    console.log('Nothing happend… ¯\\_(ツ)_/¯');
  }
};

initialize();
