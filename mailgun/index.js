const path = require('path')
const config = require(path.join(__dirname, '..', 'config'))
const logger = require('logger').getLogger()
const fs = require('fs')
const handlebars = require('handlebars')

const API_KEY = config.MAILGUN.API_KEY
const DOMAIN = config.MAILGUN.DOMAIN

const mailgun = require('mailgun-js')({
  apiKey: API_KEY,
  domain: DOMAIN
})

let template

fs.readFile(path.join(__dirname, 'email.html'), { encoding: 'UTF-8' }, (err, data) => {
  if (err) {
    logger.error(err)
    process.exit(1)
  }

  template = handlebars.compile(data)
})

function sendComunicationFromPartners (receivers, comunication) {
  if (process.env.NODE_ENV !== 'production') { return }

  receivers.push(config.COORDINATION_EMAIL)

  receivers.forEach(receiver => {
    let data = {
      from: 'Mailgun <mailgun@sinfo.org>',
      to: receiver,
      subject: '[SINFO] Comunication from partners - ' + comunication.topic,
      html: template(comunication)
    }

    mailgun.messages().send(data, function (error, body) {
      if (error) { logger.error(error) }
    })
  })
}

module.exports = {
  name: 'mailgun',
  version: '1.0.0',
  register: async (server, options) => {
    server.method('mailgun.sendComunicationFromPartners', sendComunicationFromPartners)
  }
}
