var http = require('http');
var db = require('./db.js');
var express = require('express');
var app = express();
var morgan = require('morgan');
var api = require('./api/api.js');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

// API to communicate with frontend
app.use('/api', api);

app.get('/', function(req, res) {
	res.sendFile('public/index.html', {'root' : __dirname});
});

app.listen(1337, function() {
	console.log('Server running at http://127.0.0.1:1337/');
});