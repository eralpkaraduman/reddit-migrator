'use strict';
var express = require('express');
var app = express();
var index = require('./index');

app.get('/', index.handleAuth);

const PORT = 3333
app.listen(PORT, () => console.log('Example app listening on port '+PORT+'!'))
