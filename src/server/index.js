const compression = require('compression');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(compression());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const start = () => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = { start };
