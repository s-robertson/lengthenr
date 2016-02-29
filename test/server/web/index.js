'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const IndexPlugin = require('../../../server/web/index');
const Randomstring = require('randomstring');

const lab = exports.lab = Lab.script();
let request;
let server;

lab.beforeEach((done) => {

    const plugins = [
        {
            register: require('hapi-sequelize'),
            options: Config.get('/db')
        },
        IndexPlugin
    ];

    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/api') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.plugins['hapi-sequelize'].db.sequelize.sync({ force: Config.get('/db/force') })
            .then(() => {

                done();
            })
            .catch((err) => {

                return done(err);
            })
            .error((err) => {

                return done(err);
            });
    });
});


lab.experiment('Index Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/'
        };

        done();
    });


    lab.test('it renders the homepage', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/activate the plot device/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('URL Creation', () => {

    const url = 'http://' + Randomstring.generate(10);
    const longUrl = 'http://' + Randomstring.generate(60);

    let urlID;

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/generate',
            payload: {
                url: url
            }
        };

        done();
    });

    lab.test('it creates a lengthened url', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.original).to.be.a.string().and.to.equal(url);
            Code.expect(response.result.id).to.be.a.number();
            Code.expect(response.result.lengthened).to.be.a.string().and.to.have.length(50);

            urlID = response.result.id;

            done();
        });
    });

    lab.test('it retrieves the newly-added url', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.id).to.equal(urlID);

            done();
        });
    });


    lab.test('it creates a lengthened url longer than 50 characters', (done) => {

        request.payload.url = longUrl;

        server.inject(request, (response) => {

            Code.expect(response.result.lengthened).to.be.a.string().and.to.have.length(parseInt(longUrl.length * 1.5));

            done();
        });
    });

});
