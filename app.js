'use strict';
const path = require('path')
const config = require(path.join(__dirname, '.', 'config'))
const plugins = require(path.join(__dirname, '.', 'plugins'))
const Hapi = require('hapi');
const https = require('https');
const Boom = require('boom');

const server = Hapi.server({
    host: config.HOST,
    port: config.PORT,
});

async function register () {
  await server.register(plugins)
}

const receiversOfPartnersComunication = ['pedro.correia@sinfo.org']

server.route({
    method: 'POST',
    path: '/',
    handler: (request, h) => {
        var options = {
          host: 'www.google.com',
          port: 443,
          path: '/recaptcha/api/siteverify?secret=' + config.PARTNERS_RECAPTCHA.SECRET_KEY + '&response=' + request.payload.recaptcha,
          method: 'POST'
        };

        // send request to google to verify recaptcha code
        var req = https.request(options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            return chunk.success;
          });
        });

        req.on('error', function(err) {
          logger.error(err)
          return Boom.boomify(err)
        });

        if (req.end()) {
          // recaptcha is valid
          try {
            request.server.methods.mailgun.sendComunicationFromPartners(receiversOfPartnersComunication, request.payload);
            return {'message': 'Message sent'};
          } catch (err) {
            logger.error(err)
            return Boom.boomify(err)
          }
        } else {
          // recaptcha is not valid
            return Boom.unauthorized('reCaptcha not valid')
        }
    }
});

// Start the server
async function start () {
  try {
    config.validate()
    await register()
    await server.start()
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) {
    console.error('error', err)
    process.exit(1)
  }
};

module.exports.start = start
module.exports.register = register
module.exports.server = server