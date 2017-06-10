const logger = require('../../utilities/logger');
const elasticsearch = require('../elasticsearch');
const TYPE = 'event';

const cleanForIndex = (event) => {
  return {
    index: elasticsearch.INDEX,
    type: TYPE,
    id: `${event._id}`,
    body: {
      publicUrl: event.publicUrl,
      title: event.title,
      about: event.about,
      starts: event.starts,
      ends: event.ends,
      is_closed: event.is_closed,
      imageUrl: event.imageUrl
    }
  };
};

module.exports = (es = elasticsearch) => {
  return function elasticsearchIndexPlugin(schema, _opts) {
    schema.post('save', function save() {
      logger.debug('Indexing event');
      if (this.is_public) {
        const clean = cleanForIndex(this);
        logger.debug(clean);
        es.getClient().index(clean, (error, _res) => {
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

    schema.post('remove', (entity) => es.remover(TYPE)(entity));
  };
};
