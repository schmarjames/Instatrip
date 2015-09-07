var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.get('/', function(request, response) {
    response.sendfile('/public/home.html');
}).listen(port);
