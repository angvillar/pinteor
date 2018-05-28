const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Ajv = require('ajv');
const User = require('./server/models/user.js');
const localSignupStrategy = require('./server/passport/local-signup');


mongoose.connect('mongodb://localhost/pinteor');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('connected'));

User
  .remove({})
  .then(() => console.log('user collection removed'))
  .catch(console.log)

const newUser = new User({
  name: 'jon',
  email: 'jon@localhost.com',
  password: 'snow',
});

newUser
  .save()
  .then(console.log)
  .catch(console.log)

const app = express();
const ajv = new Ajv({ allErrors: true });

app.use(express.static(path.join(__dirname, 'server/static')));
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use('local-signup', localSignupStrategy);

app.post('/api/signup', function (req, res, next) {
  const schema = {
    "properties": {
      "name": { 
        "type": "string",
        "minLength": 4,
        "maxLength": 10
      },
      "email": { 
        "type": "string", 
        "format": "email" 
      },
      "password": { 
        "type": "string",
        "minLength": 4,
        "maxLength": 10 
      }
    }
  };
  const validate = ajv.compile(schema);
  const isValid = validate(req.body);
  
  //if (valid) console.log('Valid!');
  //else console.log('Invalid: ' + ajv.errorsText(validate.errors));

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Check the form for errors',
      errors: validate.errors
    });
  }
  
  // return res.status(200).json({});
  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.'
    });
  })(req, res, next);
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'server/static/index.html'));
});

// start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});