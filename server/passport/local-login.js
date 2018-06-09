const knex = require('../db.js');
const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  console.log('called: ', email, password);
  const userData = {
    email: email.trim(),
    password: password.trim()
  }
  return knex('users')
    .limit(1)
    .where({ email: userData.email })
    .select('id', 'email', 'password')
    .then(rows => {
      const user = rows[0];
      console.log('user: ', user);
      // email not found
      if (!user) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError email not found';
        return done(error);
      }
      // password not equal
      if (user.password !== userData.password) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError password not match';
        return done(error);
      }
      const payload = { sub: user.id };
      const token = jwt.sign(payload, 'secret');
      return done(null, token);
    })
    .catch(done)


});
