'use strict';

const Joi = require('joi');
const Randomstring = require('randomstring');
const Boom = require('boom');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: 'public/index.html'
        }
    });

    // Static files
    server.route({
        method: 'GET',
        path: '/dist/{file*}',
        handler: {
            directory: {
                path: 'public/dist'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/app/{file*}',
        handler: {
            directory: {
                path: 'public/app'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/r/{longUrl}',
        handler: function (request, reply) {

            const models = request.server.plugins['hapi-sequelize'].db.sequelize.models;

            models.Url.findOne({ where: {lengthened: request.params.longUrl}})
                .then((url) => {

                    if (!url) {
                        return reply(Boom.badRequest('Invalid URL.'));
                    }

                    return reply.redirect(url.original).permanent();
                })
                .catch((err) => {

                    return reply(err);
                });

        },
    });

    server.route({
        method: 'POST',
        path: '/generate',
        handler: function (request, reply) {

            const models = request.server.plugins['hapi-sequelize'].db.sequelize.models;

            // Figure out what's longer, 50% of the URL's length, or our minimum length of 50 characters.
            const potentialLength = request.payload.url.length * 1.5;
            const newLength = parseInt(potentialLength > 50 ? potentialLength : 50);

            const lengthedUrl = Randomstring.generate(newLength);

            // First check and see if the URL already exists in the database.
            models.Url.findOrCreate({
                where: { original: request.payload.url },
                defaults: { lengthened: lengthedUrl }
            })
                .spread((url, created) => {

                    return reply(url);
                })
                .catch((err) => {

                    return reply(err);
                });
        },
        config: {
            validate: {
                payload: {
                    url: Joi.string().uri({ scheme: ['http', 'https'] }).max(500).required()
                }
            }
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web'
};
