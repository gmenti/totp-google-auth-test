const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const secret = speakeasy.generateSecret({
  name: '2fa-test'
});

const generateQRCode = () => {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const verify = (userSecret, token) => {
  console.log({
    secret: userSecret,
    encoding: 'ascii',
    token,
  });
  return speakeasy.totp.verify({
    secret: userSecret,
    encoding: 'ascii',
    token,
  });
};

module.exports = { secret, generateQRCode, verify };
