'use strict';

const Joi = require('joi');
const Randomstring = require('randomstring');
const Boom = require('boom');
const md5 = require('md5');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/r/{longUrl}',
        handler: function (request, reply) {

            const models = request.server.plugins['hapi-sequelize'].db.sequelize.models;
            const lengthened = request.params.longUrl;
            const lengthenedHash = md5(request.params.longUrl);

            models.Url.findAll( { where: { lengthenedHash: lengthenedHash } } )
                .then((urls) => {

                    let foundUrl = false;

                    for (let url of urls) {
                        if (url.lengthened == lengthened) {
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

    server.route({
        method: 'POST',
        path: '/urls',
        handler: function (request, reply) {

            const models = request.server.plugins['hapi-sequelize'].db.sequelize.models;
            const submittedUrl = request.payload.url;

            // Figure out what's longer, 50% of the URL's length, or our minimum length of 50 characters.
            const potentialLength = submittedUrl.original.length * 1.5;
            const newLength = parseInt(potentialLength > 50 ? potentialLength : 50);
            const lengthenedUrl = Randomstring.generate(newLength);

            // Create hashes
            const originalHash = md5(submittedUrl.original);
            const lengthenedHash = md5(lengthenedUrl);

            // First check and see if the URL already exists in the database.
            models.Url.findOrCreate({
                where: { originalHash: originalHash },
                defaults: {
                    lengthened: lengthenedUrl,
                    original: submittedUrl.original,
                    lengthenedHash: lengthenedHash
                }
            })
                .spread((url) => {

                    return reply(url);
                })
                .catch((err) => {

                    return reply(err);
                });
        },
        config: {
            validate: {
                payload: {
                    url: {
                        original: Joi.string().uri({ scheme: ['http', 'https'] }).max(500).required()
                    }
                }
            }
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web'
};
