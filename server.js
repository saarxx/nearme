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
//app.post('/students',students.addStudent);

//app.put('/students/:id',students.updateStudent)
//app.delete('/students/:id',students.deleteStudent);

app.listen(port,host);
