"use strict";
var mongoose = require('mongoose');
var config = require('./config.js');
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost/' + config.db.name
mongoose.connect(uri.toString());
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Connection Made!');
});