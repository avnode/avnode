const elasticsearch = require('elasticsearch');
const logger = require('../utilities/logger');
const INDEX = 'avnode';

let instance = null;

if (instance === null) {
  logger.info('Connecting to elasticsearch');
  
  instance = new elasticsearch.Client({
    host: 'localhost:9200'
    //log: 'trace'
  });
}

module.exports = instance;

module.exports.INDEX = INDEX;

// Default remove function one can use
module.exports.remove = (type) => {
  logger.debug(`Removing ${type} from index`);
  return function remove(entity) {
    instance.delete({
      type: type,
      index: INDEX,
      id: `${entity._id}`
    }, (error, _res) => {
      if (error) {
        logger.debug(`Removing ${type} failed`);
        logger.debug(error);
      } else {
        logger.debug(`Removing ${type} success`);
      }
    });
  };
};
