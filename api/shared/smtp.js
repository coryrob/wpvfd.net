const nodemailer = require('nodemailer');

function settings() {
  return {
    host: process.env.SMTP_HOST || 'mail.smtp2go.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USERNAME || 'operations@wpvfd.net',
      pass: process.env.SMTP_PASSWORD
    },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false
  };
}

async function send(message) {
  const transport = nodemailer.createTransport(settings());
  try {
    const result = await transport.sendMail({
      ...message,
      from: process.env.APPLICATION_FROM_EMAIL || 'WPVFD Applications <operations@wpvfd.net>',
      attachments: (message.attachments || []).map(file => ({ ...file, encoding: 'base64' }))
    });
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    if (!recipients.every(recipient => result.accepted?.some(address => String(address).toLowerCase() === recipient.toLowerCase()))) {
      throw new Error('SMTP server did not accept the recipient.');
    }
  } finally {
    transport.close();
  }
}

module.exports = { settings, send };
