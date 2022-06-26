'use strict';

const { transformResponse } = require('@strapi/strapi/lib/core-api/controller/transform');

const { getPluginService } = require('../../util/getPluginService');
const { sanitizeOutput } = require('../../util/sanitizeOutput');

/**
 * ByPath controller
 */

module.exports = {
  get: async (ctx) => {
    const { path } = ctx.query;
    const { auth } = ctx.state;

    const { entity, contentType } = await getPluginService('byPathService').byPath(path, ctx.query);

    if (!entity) {
      ctx.notFound();
      return;
    }

    // Add content type to response.
    entity.contentType = contentType;
    const contentTypeObj = strapi.contentTypes[contentType];

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entity, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, {}, { contentType: contentTypeObj });
  },

  all: async (ctx) => {
    const { auth } = ctx.state;
    const { query } = ctx;

    const { results, pagination } = await getPluginService('pathService').findMany(false, query);
    const contentTypeObj = strapi.contentTypes['plugin::url-alias.path'];

    if (!results) {
      ctx.notFound();
      return;
    }

    // Format response.
    const sanitizedEntity = await sanitizeOutput(results, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, { pagination }, { contentType: contentTypeObj });
  },
};
