const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, './users.json');

const save = data =>
  new Promise((resolve, reject) =>
    fs.writeFile(usersPath, JSON.stringify(data, null, 2), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );

const load = () =>
  new Promise((resolve, reject) => {
    fs.readFile(usersPath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });

module.exports = { save, load };
