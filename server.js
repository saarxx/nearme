var express = require('express');
var nearme = require('./nearme');
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var app = express();
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());
});

app.get('/users/:id',nearme.getUser);

app.get('/users',nearme.getUsers);
app.post('/users',nearme.addUser);

app.put('/users/:id',nearme.updateUser)
app.delete('/users/:id',nearme.deleteUser);

app.listen(port,host);
