var express = require('express');
var router = express.Router();

const { Client, Query } = require('pg')

// Setup connection
var username = "postgres"
var password = "root"
var host = "localhost:5432"
var database = "school"
var conString = "postgres://" + username + ":" + password + "@" + host + "/" + database; // Your Database Connection

var client = new Client(conString);
client
    .connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('connection error', err.stack))

var requestSchoolList = "SELECT * FROM ecoles";
var requestStudentList = "SELECT * FROM etudiant";

//'select v.id,v.the_geom from roads_noded_vertices_pgr as v,roads_noded as rn where v.id=(select id from roads_noded_vertices_pgr order by the_geom <-> ST_SetSRID(ST_MakePoint(%x%,%y%),4326) limit 1) limit 1'

router.get('/', function (req, res) {
    res.send('Index Page');
});

router.get('/schools', function (req, res) {
    var query = client.query(new Query(requestSchoolList));
    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

router.get('/students', function (req, res) {
    var query = client.query(new Query(requestStudentList));
    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        res.send(result.rows);
        res.end();
    });
});

module.exports = router;