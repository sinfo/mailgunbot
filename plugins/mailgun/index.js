const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config'))
const logger = require(path.join(__dirname, '..', 'logger'))
const fs = require('fs')
const handlebars = require('handlebars')

const mailgun = require('mailgun-js')({
  apiKey: config.MAILGUN.API_KEY,
  //domain: config.MAILGUN.DOMAIN
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
  //if (process.env.NODE_ENV !== 'production') { return }

  //receivers.push(config.COORDINATION_EMAIL)

  receivers.forEach(receiver => {
    let data = {
      from: 'Mailgun <mailgun@sinfo.org>',
      to: receiver,
      subject: '[SINFO] Comunication from partners - ' + comunication.subject,
      html: template(comunication)
    }

    console.log(1);

    mailgun.messages().send(data, function (error, body) {
      if (error) { console.log(error) }
        console.log(body);
    });
    console.log(2);

  })

  return 3;
}

module.exports = {
  name: 'mailgun',
  version: '1.0.0',
  register: async (server, options) => {
    server.method('mailgun.sendComunicationFromPartners', sendComunicationFromPartners)
  }
}
