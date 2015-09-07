var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/easy-autocomplete/dist/'));
app.use('/www', express.static(__dirname + '/www/lib'));
app.use('/bower_components', express.static(__dirname + '/bower_components/));

app.listen(process.env.PORT || 3000);
