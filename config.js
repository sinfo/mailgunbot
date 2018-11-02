const config = {
  HOST: process.env.MAILGUNBOT_HOST || 'localhost',
  PORT: process.env.MAILGUNBOT_PORT || 8888,
  MAILGUNBOT_PATH: process.env.NODE_ENV === 'production'
    ? process.env.MAILGUNBOT_PATH
    : 'localhost:8888',

  COORDINATION_EMAIL: 'coordination@sinfo.org',

  LOGENTRIES_TOKEN: process.env.CORLIEF_LOGENTRIES_TOKEN,

  MAILGUN: {
    API_KEY: process.env.MAILGUNBOT_MAILGUN_API_KEY,
    DOMAIN: process.env.MAILGUNBOT_HOST || 'sinfo.org'
  },

  PARTNERS_RECAPTCHA: {
    SECRET_KEY: process.env.PARTNERS_RECAPTCHA_SECRET_KEY
  }
}

/* TODO const logger = process.env.MAILGUNBOT_LOGENTRIES_TOKEN &&
  config.MAILGUN.API_KEY &&
  process.env.NODE_ENV === 'production'
  ? require('logger').getLogger(
    process.env.MAILGUNBOT_LOGENTRIES_TOKEN,
    config.MAILGUN.API_KEY,
    'MAILGUNBOT'
  )
  : require('logger').getLogger()*/

module.exports = config

module.exports.validate = () => {
  if (process.env.NODE_ENV === 'production') {
    //logger.warn('Running in production mode')

    if (config.MAILGUNBOT_PATH === undefined) {
      //logger.error('Env var of MAILGUNBOT_PATH not defined')
      process.exit(1)
    }

    if (config.LOGENTRIES_TOKEN === undefined) {
      //logger.warn('Production mode without logentries token given')
    }

    if (config.MAILGUN.API_KEY === undefined) {
      //logger.error('Env var of MAILGUNBOT_MAILGUN_API_KEY not defined')
      process.exit(1)
    }
  }
}