'use strict';

const Confidence = require('confidence');
const Db = require('./db');

const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the plot device.',
    projectName: 'lengthenr',
    port: {
        web: {
            $filter: 'env',
            test: 9090,
            $default: 8080
        }
    },
    db: {
        $filter: 'env',
        production: Db.production,
        test: Db.test,
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
