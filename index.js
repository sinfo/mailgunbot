'use strict';

const Hapi = require('hapi');
const https = require('https');
const config = require('config');
const mailgun = require('mailgun');

const server = Hapi.server({
    port: 8888,
    host: 'localhost'
});

const RECAPTCHA_SECRET_KEY = config.PARTNERS_RECAPTCHA.SECRET_KEY;

server.route({
    method: 'POST',
    path: '/',
    handler: (request, h) => {
        var options = {
          host: 'www.google.com',
          port: 443,
          path: '/recaptcha/api/siteverify?secret=' + RECAPTCHA_SECRET_KEY + '&response=' + request.payload.recaptcha,
          method: 'POST'
        };

        // send request to google to verify recaptcha code
        var req = https.request(options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            if (chunk.success) {
                mailgun.sendComunicationFromPartners(['test@test.org'] request.payload);
                return 'Goodrequest';
            } else {
                return "Badrequest"
            }
          });
        });

        req.on('error', function(e) {
          return "Badrequest"
        });

        req.end();

    }
});

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();