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

var requestRoad = (point) => {
    return 'select v.id,v.the_geom from roads_noded_vertices_pgr as v,roads_noded as rn where v.id=(select id from roads_noded_vertices_pgr order by the_geom <-> ST_SetSRID(ST_MakePoint(' + point.x + ',' + point.y + '),4326) limit 1) limit 1';
};

router.get('/', function (req, res) {
    res.send('Index Page');
});

router.get('/road/:student/:school', function (req, res) {
    const student = req.params.student
    const school = req.params.school
    //Search for school Adresse
    var searchSchoolAdrQuery = 'SELECT ST_X(geom) as x ,ST_Y(geom) as y FROM public.ecoles WHERE gid=' + school;
    var query = client.query(new Query(searchSchoolAdrQuery));
    query.on("row", function (row, result1) {
        result1.addRow(row);
    });

    query.on("end", function (result1) {
        var searchStudentAdrQuery = 'SELECT ST_X(geom) as x ,ST_Y(geom) as y FROM public.etudiant, public.adressespoints WHERE etudiant.adresse = adressespoints.gid AND etudiant.id = ' + student;
        var query = client.query(new Query(searchStudentAdrQuery));
        query.on("row", function (row, result2) {
            result2.addRow(row);
        });

        query.on("end", function (result2) {
            const schoolAdresse = result1.rows[0];
            const studentAdresse = result2.rows[0];
            console.log(schoolAdresse, studentAdresse);

            //Adresse close to school
            var query = client.query(new Query(requestRoad(schoolAdresse)));
            query.on("row", function (row, result3) {
                result3.addRow(row);
            });

            query.on("end", function (result3) {
                    //Adresse close to Student
                    var query = client.query(new Query(requestRoad(studentAdresse)));
                    query.on("row", function (row, result4) {
                        result4.addRow(row);
                    });
        
                    query.on("end", function (result4) {
                        // result3 source SCHOOL 
                        // result4 target STUDENT

                        res.end();
                    });
                    res.end();
            });
        });
    });
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