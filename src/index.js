const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const totp = require('./totp');
const db = require('./db');

const JWT_SECRET = 'yolo';

const app = express();
app.use(
  bodyParser.json({
    type: 'json'
  })
);

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/auth', async (req, res, next) => {
  const users = await db.load();
  const user = users.find(
    user =>
      user.emailAddress === req.body.emailAddress &&
      user.password === req.body.password
  );
  if (user) {
    res.send({
      token: jwt.sign(user.emailAddress, JWT_SECRET)
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/totp', async (req, res, next) => {
  const users = await db.load();
  const tokenEmailAddress = jwt.verify(req.headers.authorization, JWT_SECRET);
  const user = users.find(user => user.emailAddress === tokenEmailAddress);
  if (!user.verified) {
    const qrcode = await totp.generateQRCode();
    user.secret = totp.secret.ascii;
    await db.save(users);
    res.send({ qrcode });
  } else {
    res.send({ qrcode: null });
  }
});

app.post('/totp', async (req, res, next) => {
  const users = await db.load();
  const tokenEmailAddress = jwt.verify(req.headers.authorization, JWT_SECRET);
  const user = users.find(user => user.emailAddress === tokenEmailAddress);
  const verified = await totp.verify(user.secret, req.body.token);
  if (verified) {
    user.verified = true;
    await db.save(users);
  }
  res.send({ verified });
});

app.listen(3000);
