const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Ajv = require('ajv');

const app = express();
const ajv = new Ajv();

app.use(express.static(path.join(__dirname, 'server/static')));
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(bodyParser.json());


app.post('/api/signup', function (req, res) {
  console.log(req.body);
  const schema = {
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "password": { "type": "string" }
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
  
  return res.status(200).json({});
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'server/static/index.html'));
});

// start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});