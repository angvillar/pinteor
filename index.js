const knex = require('./server/db.js');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Ajv = require('ajv');
const R = require('ramda');
const jwt = require('jsonwebtoken');
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');

const app = express();
const ajv = new Ajv({ allErrors: true });

function authCheck(req, res, next) {
  console.log('header auth token: ', req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: 'no auth request header',
      errors: {}
    })
  }

  // const token = req.headers.authorization.split(' ')[1];
  const token = req.headers.authorization;
  console.log(token);
  return jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        message: 'verify auth err',
        error: err
      })
    }
    const userId = decoded.sub;
    console.log('userId: ', userId);
    return knex('users')
      .where('id', userId)
      .then(_ => next())
      .catch(err => {
        return res.status(401).json({
          message: 'auth err',
          error: err
        })
      })
  })
}

app.use(express.static(path.join(__dirname, 'server/static')));
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
app.use('/api', authCheck);


function checkUsernameExists(schema, username) {
  return knex(schema.table)
    .select('username')
    .where('username', username)
    .then(rows => {
      return !rows.length;
    })
    .catch(console.log)
}

function checkEmailExists(schema, email) {
  return knex(schema.table)
    .select('email')
    .where('email', email)
    .then(rows => {
      return !rows.length;
    })
    .catch(console.log)
}

ajv.addKeyword('usernameExists', {
  async: true,
  type: 'string',
  validate: checkUsernameExists
});

ajv.addKeyword('emailExists', {
  async: true,
  type: 'string',
  validate: checkEmailExists
});

const userSignupSchema = {
  "$async": true,
  "properties": {
    "username": { 
      "type": "string",
      "minLength": 3,
      "maxLength": 10,
      "usernameExists": { "table": "users" }
    },
    "email": { 
      "type": "string", 
      "format": "email",
      "emailExists": { "table": "users" } 
    },
    "password": { 
      "type": "string",
      "minLength": 3,
      "maxLength": 10 
    }
  }
};

const validateUserSignup = ajv.compile(userSignupSchema);

function userSignupValidation(req, res, next) { 
  validateUserSignup(req.body)
    .then(_ => next())
    .catch(err => {
      // unique username and email error
      const keywordList =  R.map(err => err.keyword, err.errors);
      const isUserNameExistsError = R.contains('usernameExists', keywordList);
      const isEmailExistsError = R.contains('emailExists', keywordList);
      if (isUserNameExistsError || isEmailExistsError) {
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors',
          errors: err.errors
        });
      }
      // other validation errors
      return res.status(400).json({
        success: false,
        message: 'Sorry You not passed user validation',
        errors: err
      })
    })
}

function checkEmailNotExists(schema, email) {
  return checkEmailExists(schema, email)
    .then(emailExists => !emailExists)
    .catch(console.log);
}

function checkPasswordMatch(schema, password) {
  return knex(schema.table)
    .select('password')
    .where('password', password)
    .then(rows => {
      return !!rows.length;
    })
    .catch(console.log)
}

ajv.addKeyword('emailNotExists', {
  async: true,
  type: 'string',
  validate: checkEmailNotExists
});

ajv.addKeyword('passwordMatch', {
  async: true,
  type: 'string',
  validate: checkPasswordMatch
});

const userLoginSchema = {
  "$async": true,
  "properties": {
    "email": { 
      "type": "string", 
      "format": "email",
      "emailNotExists": { "table": "users" } 
    },
    "password": { 
      "type": "string",
      "minLength": 3,
      "maxLength": 10,
      "passwordMatch": { "table": "users" }
    }
  }
};

const validateUserLogin = ajv.compile(userLoginSchema);

function userLoginValidation(req, res, next) {
  validateUserLogin(req.body)
  .then(_ => next())
  .catch(err => {
    console.log(err);
    // other validation errors
    return res.status(400).json({
      success: false,
      message: 'Sorry You not passed user validation',
      errors: err
    })
  })
}

function userSignup(req, res, next) {
  passport.authenticate('local-signup', err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Something bad happend',
        errors: {}
      });
    }
    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.',
      errors: {}
    });
  })(req, res, next);
}

function userLogin(req, res, next) {
  passport.authenticate('local-login', (err, token) => {
    console.log('login token: ', token);
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Something bad happend',
        errors: err
      });
    }    
    return res.status(200).json({
      token,
      success: true,
      message: 'You have successfully logged up!',
      errors: {}
    });
  })(req, res, next)
}

app.get('/api/dashboard', function(req, res) {
  return res.status(200).json({
    message: "You're authorized to see this secret message."
  });
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'server/static/index.html'));
});

app.post('/auth/signup', userSignupValidation, userSignup);

app.post('/auth/login', userLoginValidation, userLogin);

// start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});