const bcrypt = require('bcrypt');

bcrypt.hash('resh123', 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
