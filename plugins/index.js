const path = require('path')

module.exports = [
  require(path.join(__dirname, '.', 'mailgun')),
  require(path.join(__dirname, '.', 'logger'))
]
