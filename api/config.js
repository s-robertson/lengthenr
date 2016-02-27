'use strict';

const Confidence = require('confidence');
const Db = require('./db');

const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the plot device.',
    projectName: 'api',
    port: {
        api: {
            $filter: 'env',
            test: 9090,
            $default: 8080
        }
    },
    db: {
        $filter: 'env',
        production: Db.dev,
        $default: Db.dev
    }
};


const store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
