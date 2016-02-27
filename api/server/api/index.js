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

            // First check and see if the URL already exists in the database.
            request.app.db.query('SELECT * FROM url WHERE original = ?', request.payload.url, (err, results, fields) => {

                if (err) {
                    return reply(err);
                }

                if (results.length > 0) {
                    return reply(results[0]);
                }

                // Figure out what's longer, 50% of the URL's length, or our minimum length of 50 characters.
                const potentialLength = request.payload.url.length * 0.5;
                const newLength = potentialLength > 50 ? potentialLength : 50;

                const lengthedUrl = chance.string({
                    length: newLength,
                    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                });

                let record = {
                    id: null,
                    original: request.payload.url,
                    lengthened: lengthedUrl
                };

                request.app.db.query('INSERT INTO url SET ?', {
                    original: request.payload.url,
                    lengthened: lengthedUrl
                }, (err, result) => {

                    if (err) {
                        return reply(err);
                    }

                    record.id = result.insertedId;

                    reply(record);
                });
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
