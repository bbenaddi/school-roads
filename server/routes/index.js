const { client } = require('./db/connection');
var express = require('express');
var router = express.Router();

//  Queries
var requestSchoolList = "SELECT gid,name FROM ecoles";
var requestStudentList = "SELECT id,nom,prenom FROM etudiant";
var searchSchoolAdrQuery = 'SELECT ST_X(geom) as x ,ST_Y(geom) as y FROM public.ecoles WHERE gid=$1';
var searchStudentAdrQuery = 'SELECT ST_X(geom) as x ,ST_Y(geom) as y FROM public.etudiant, public.adressespoints WHERE etudiant.adresse = adressespoints.gid AND etudiant.id = $1';
var requestRoad = 'select v.id,v.the_geom from roads_noded_vertices_pgr as v,roads_noded as rn where v.id=(select id from roads_noded_vertices_pgr order by the_geom <-> ST_SetSRID(ST_MakePoint($1,$2),4326) limit 1) limit 1';
var searchNearestRoad = "select min(d.seq) as seq,r.old_id as id , r.name,r.type,sum(r.distance) as distance, ST_AsGeoJSON( ST_MakeLine(r.the_geom)) as geom from pgr_dijkstra('select id , source ,target , distance as cost from roads_noded',$1::int,$2::int,false) as d,roads_noded as r where d.edge=r.id group by r.old_id,r.name,r.type";

router.get('/', function (req, res) {
    res.send('Index Page');
});

// Road from student adresse to school adresse exemple : road/1/1
router.get('/road/:student/:school', function (req, res) {
    const student = req.params.student
    const school = req.params.school

    //Get School Addresse
    client.query(searchSchoolAdrQuery, [school])
        .then(schoolResult => {
            //Get Student Addresse
            client.query(searchStudentAdrQuery, [student])
                .then(studentResult => {
                    const schoolAdresse = schoolResult.rows[0];
                    const studentAdresse = studentResult.rows[0];
                    //Close road to the school
                    client.query(requestRoad, [schoolAdresse.x, schoolAdresse.y])
                        .then(schoolRoad => {
                            //Close road to the student
                            client.query(requestRoad, [studentAdresse.x, studentAdresse.y])
                                .then(studentRoad => {
                                    const source = schoolRoad.rows[0].id;
                                    const target = studentRoad.rows[0].id;
                                    //Calculate the nearest road to schol from
                                    client.query(searchNearestRoad, [source, target])
                                        .then(roads => {
                                            res.send({
                                                adrEco: schoolAdresse,
                                                adrEtu: studentAdresse,
                                                result: roads.rows
                                            });
                                            res.end();
                                        })
                                        .catch(e => res.status(400).send("Bad request in roads request"))
                                })
                                .catch(e => res.status(400).send("Bad request in student road"))
                        })
                        .catch(e => res.status(400).send("Bad request in school road"))
                })
                .catch(e => res.status(400).send("Bad request in school request"))
        })
        .catch(e => res.status(400).send("Bad request in school request"))
});

router.get('/schools', function (req, res) {
    client.query(requestSchoolList, [])
        .then(result => {
            res.send(result.rows);
            res.end();
        })
        .catch(e => res.status(400).send("Bad request in school request"))
});

router.get('/students', function (req, res) {
    client.query(requestStudentList, [])
        .then(result => {
            res.send(result.rows);
            res.end();
        })
        .catch(e => res.status(400).send("Bad request in school students"))
});

module.exports = router;