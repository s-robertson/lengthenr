'use strict';

const Composer = require('./index');
const Config = require('./config');

Composer((err, server) => {

    if (err) {
        throw err;
    }

    const db = server.plugins['hapi-sequelize'].db;

    db.sequelize.sync({ force: Config.get('/db/force') }).then(() => {

        console.log('Database models synced.');

        server.start(() => {

            console.log('Started the plot device on port ' + server.info.port);
        });
    });
});
