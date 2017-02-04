const logger = require('../../utilities/logger');
const elasticsearch = require('../elasticsearch');
const TYPE = 'event';

const cleanForIndex = (event) => {
  const { _id, slug, title, about, starts, ends, is_closed } = event;

  return {
    index: elasticsearch.INDEX,
    type: TYPE,
    id: `${_id}`,
    body: {
      slug,
      title,
      about,
      starts,
      ends,
      is_closed
    }
  };
};

module.exports = function elasticsearchIndexPlugin(schema, _opts) {
  schema.post('save', function save(event) {
    logger.debug('Indexing event');
    if (event.is_public) {
      const clean = cleanForIndex(event);
      logger.debug(clean);
      elasticsearch.index(clean, (error, _res) => {
        if (error) {
          logger.debug('Indexing event failed');
        } else {
          logger.debug('Indexing event success');
        }
      });
    } else {
      logger.debug('Indexing skipped, event is not public');
    }
  });

  schema.post('remove', elasticsearch.remove(TYPE));
};
