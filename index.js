var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', function(request, response) {
    response.sendfile('/home.html');
}).listen(port);
