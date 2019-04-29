const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_user: 'gkodama',
    api_key: 'WJVQqHJBBz9zhtoXPuXDiubY'
  }
}

const client = nodemailer.createTransport(sgTransport(options))

module.exports = {
  sendEmail: function(email) {
    client.sendMail(email)
  }
}
