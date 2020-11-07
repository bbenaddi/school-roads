var express = require('express'); 
var router = express.Router();

const { Client, Query } = require('pg')

// Setup connection
var username = "postgres"
var password = "root" 
var host = "localhost:5432"
var database = "nyc" 
var conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection

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

router.get('/', function(req, res, next) {
  res.send('Index Page');
});

module.exports = router;