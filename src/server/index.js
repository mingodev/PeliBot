import { renderToString } from "react-dom/server";
import React from 'react';

import App from '../client/App';

import indexHtml from './html/home';

const compression = require('compression');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(compression());
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log(indexHtml)
  const appHtml = renderToString(<App />)
  const html = indexHtml.replace('{{app}}', appHtml);
  res.send(html);
});

const start = () => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = { start };
