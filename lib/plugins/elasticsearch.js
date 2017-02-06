const elasticsearch = require('elasticsearch');
const logger = require('../utilities/logger');
const INDEX = 'avnode';

let instance = null;

if (instance === null) {
  logger.info('Connecting to elasticsearch');
  
  instance = new elasticsearch.Client({
    host: `${process.env.ELASTICSEARCH}'
    //log: 'trace'
  });
}

module.exports = instance;

module.exports.INDEX = INDEX;

// Default remove function one can use
module.exports.remove = (type) => {
  return function remove(entity) {
    logger.debug(`Removing ${type} from index`);
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
