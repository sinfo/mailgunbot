const path = require('path')
const config = require(path.join(__dirname, '.', 'config'))
const plugins = require(path.join(__dirname, '.', 'plugins'))
const Hapi = require('hapi')
const rp = require('request-promise')
const Boom = require('boom')
const logger = require('logger').getLogger()
const server = Hapi.server({
  host: config.HOST,
  port: config.PORT
})

async function register () {
  await server.register(plugins)
}

server.route({
  config: {
    cors: { origin: config.CORS }
  },
  method: 'POST',
  path: '/',
  handler: async (request, h) => {
    logger.debug(request.payload)
    var options = {
      uri: `https://www.google.com/recaptcha/api/siteverify?secret=${config.RECAPTCHA_SECRET_KEY}&response=${request.payload.recaptcha}`,
      method: 'POST',
      json: true
    }

    const source = request.payload.source
    const receivers = config.RECEIVERS

    // send request to google to verify recaptcha code
    try {
      let res = await rp(options)

      if (res.success) {
        request.server.methods.mailgun
          .send(source, receivers, request.payload)
        return { success: true }
      } else {
        return Boom.unauthorized('reCaptcha not valid')
      }
    } catch (err) {
      logger.error(err)
      return Boom.boomify(err)
    }
  }
})

// Start the server
async function start () {
  try {
    config.validate()
    await register()
    await server.start()
    logger.info(`Server running at: ${server.info.uri}`)
  } catch (err) {
    logger.error('error', err)
    process.exit(1)
  }
};

module.exports.start = start
module.exports.register = register
module.exports.server = server
