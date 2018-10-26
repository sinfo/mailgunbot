const config = {
  HOST: process.env.MAILGUNBOT_HOST || 'localhost',
  PORT: process.env.MAILGUNBOT_PORT || 8888,
  MAILGUNBOT_PATH: process.env.NODE_ENV === 'production'
    ? process.env.MAILGUNBOT_PATH
    : 'localhost:8888',

  COORDINATION_EMAIL: 'coordination@sinfo.org',

  MAILGUN: {
    API_KEY: process.env.MAILGUNBOT_MAILGUN_API_KEY
  }

  PARTNERS_RECAPTCHA: {
    SECRET_KEY: process.env.PARTNERS_RECAPTCHA_SECRET_KEY
  }
}

module.exports = config
