const knex = require('../db.js');
const PassportLocalStrategy = require('passport-local').Strategy;


module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const newUser = {
    username: req.body.username.trim(),
    email: email.trim(),
    password: password.trim()
  }
  return knex('users')
    .insert(newUser)
    .then(id => done(null))
    .catch(done)
});