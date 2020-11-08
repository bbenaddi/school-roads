var express = require('express');
var router = express.Router();

const { Client, Query } = require('pg')

// Setup connection
var username = "postgres"
var password = "root"
var host = "localhost:5432"
var database = "nyc"
var conString = "postgres://" + username + ":" + password + "@" + host + "/" + database; // Your Database Connection

var client = new Client(conString);
client
    .connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('connection error', err.stack))

var request = "SELECT * FROM nyc_census_blocks";

router.get('/data', function (req, res) {
    var query = client.query(new Query(request));
    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/', function (req, res) {
    res.send('Index Page');
});

router.get('/students', function (req, res) {
    res.end(JSON.stringify([
        { id: 1 ,name :'student1'},
        { id: 2 ,name :'student2'},
        { id: 3 ,name :'student3'},
        { id: 4 ,name :'student4'},
        { id: 5 ,name :'student5'},
    ]));
});

router.get('/schools', function (req, res) {
    res.end(JSON.stringify([
        { id: 1 ,name :'school1'},
        { id: 2 ,name :'school2'},
        { id: 3 ,name :'school3'},
        { id: 4 ,name :'school4'},
        { id: 5 ,name :'school5'},
    ]));
});

module.exports = router;