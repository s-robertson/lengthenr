'use strict';

const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
    env: process.env.NODE_ENV
};

const manifest = {
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web']
    }],
    registrations: [
        {
            plugin: {
                register: 'hapi-sequelize',
                options: Config.get('/db')
            }
        },
        {
            plugin: {
                register: './server/web/api'
            },
            options: {
                routes: {
                    prefix: '/api/v1'
                }
            }
        },
        {
            plugin: './server/web/redirect'
        }
    ]
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
