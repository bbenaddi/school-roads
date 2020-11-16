var path = require('path');
var express = require('express');
var app = express();
var port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`School Roads Backend listening at http://localhost:${port}`);
})