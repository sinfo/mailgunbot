const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config'))
const logger = require('logger').getLogger()
const fs = require('fs')
const handlebars = require('handlebars')

const mailgun = require('mailgun-js')({
  apiKey: config.MAILGUN.API_KEY,
  domain: config.MAILGUN.DOMAIN
})

let template

fs.readFile(path.join(__dirname, 'email.html'), { encoding: 'UTF-8' }, (err, data) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }

  template = handlebars.compile(data)
})

function send (source, receivers, comunication) {
  receivers.forEach(receiver => {
    let data = {
      from: 'Mailgun <mailgun@sinfo.org>',
      to: receiver,
      subject: `[${source.toUpperCase()}] ${comunication.subject}`,
      html: template(comunication)
    }

    mailgun.messages().send(data, function (error, body) {
      if (error) {
        logger.error(error)
      } else {
        logger.info({
          source: source,
          receivers: receivers,
          data: data
        })
      }
    })
  })
}

module.exports = {
  name: 'mailgun',
  version: '1.0.0',
  register: async (server, options) => {
    server.method('mailgun.send', send)
  }
}
