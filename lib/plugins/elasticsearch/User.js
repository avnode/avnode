const logger = require('../../utilities/logger');
const elasticsearch = require('../elasticsearch');
const TYPE = 'user';

const cleanForIndex = ({ _id, slug, name, stagename, about }) => {
  return {
    index: elasticsearch.INDEX,
    type: TYPE,
    id: `${_id}`,
    body: {
      slug,
      name,
      stagename,
      about
    }
  };
};

module.exports = function elasticsearchIndexPlugin(schema, _opts) {
  schema.post('save', function save(user) {
    const clean = cleanForIndex(user);
    logger.debug('Indexing user');
    logger.debug(clean);
    elasticsearch.index(clean, (error, _res) => {
      if (error) {
        logger.debug('Indexing user failed');
      } else {
        logger.debug('Indexing user success');
      }
    });
  });

  schema.post('remove',  elasticsearch.remove(TYPE));
};
