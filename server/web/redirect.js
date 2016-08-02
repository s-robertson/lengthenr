'use strict';

const Boom = require('boom');
const Md5 = require('md5');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/r/{longUrl}',
        handler: function (request, reply) {

            const models = request.server.plugins['hapi-sequelize'].db.sequelize.models;
            const lengthened = request.params.longUrl;
            const lengthenedHash = Md5(request.params.longUrl);

            models.Url.findAll( { where: { lengthenedHash: lengthenedHash } } )
                .then((urls) => {

                    let foundUrl = false;

                    for (const url of urls) {
                        if (url.lengthened === lengthened) {
                            foundUrl = url;
                            break;
                        }
                    }

                    if (!foundUrl) {
                        return reply(Boom.badRequest('Invalid URL.'));
                    }

                    return reply.redirect(foundUrl.original).permanent();
                })
                .catch((err) => {

                    return reply(err);
                });

        }
    });

    next();
};


exports.register.attributes = {
    name: 'redirect'
};
