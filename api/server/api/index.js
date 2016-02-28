'use strict';

const Joi = require('joi');
const Chance = require('chance');
const chance = new Chance();

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            reply({ message: 'Welcome to the plot device.' });
        }
    });


    server.route({
        method: 'POST',
        path: '/url',
        // @TODO: test coverage and split this up into a plugin.
        handler: function (request, reply) {

            const models = request.server.plugins['hapi-sequelize'].db.sequelize.models;

            // Figure out what's longer, 50% of the URL's length, or our minimum length of 50 characters.
            const potentialLength = request.payload.url.length * 0.5;
            const newLength = potentialLength > 50 ? potentialLength : 50;

            const lengthedUrl = chance.string({
                length: newLength,
                pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            });

            // First check and see if the URL already exists in the database.
            models.Url.findOrCreate({
                where: { original: request.payload.url },
                defaults: { lengthened: lengthedUrl }
            })
                .spread((url, created) => {

                    return reply(url);
                })
                .error((err) => {

                    return reply(err);
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
    name: 'api'
};
