const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'server/static')));
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'server/static/index.html'));
});

// start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});