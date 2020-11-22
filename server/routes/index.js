const { client } = require('./db/connection');
var express = require('express');
const { getByPlaceholderText } = require('@testing-library/react');
var router = express.Router();

//  Queries
var requestSchoolList = "SELECT gid,name FROM ecoles";
var requestStudentList = "SELECT id,nom,prenom FROM etudiant";
var searchSchoolAdrQuery = 'SELECT ST_X(geom) as x ,ST_Y(geom) as y FROM public.ecoles WHERE gid=$1';
var searchStudentAdrQuery = 'SELECT ST_X(geom) as x ,ST_Y(geom) as y FROM public.etudiant, public.adressespoints WHERE etudiant.adresse = adressespoints.gid AND etudiant.id = $1';
var requestRoad = 'select v.id,ST_X(v.the_geom) as x,ST_Y(v.the_geom) as y from roads_noded_vertices_pgr as v,roads_noded as rn where v.id=(select id from roads_noded_vertices_pgr order by the_geom <-> ST_SetSRID(ST_MakePoint($1,$2),4326) limit 1) limit 1';
var searchNearestRoad = "select min(d.seq) as seq,r.old_id as id , r.name,r.type,sum(r.distance) as distance, ST_AsGeoJSON( ST_MakeLine(r.the_geom)) as geom from pgr_dijkstra('select id , source ,target , distance as cost from roads_noded',$1::int,$2::int,false) as d,roads_noded as r where d.edge=r.id group by r.old_id,r.name,r.type";
var searchSafestRoad = "select min(d.seq) as seq,r.old_id as id , r.name,r.type,sum(r.distance) as distance, ST_AsGeoJSON( ST_MakeLine(r.the_geom)) as geom from pgr_dijkstra('select type,id , source ,target ,the_geom, distance as cost from roads_noded where type != ''secondary'' and type != ''service''',$1::int,$2::int,false) as d,roads_noded as r where d.edge=r.id group by r.old_id,r.name,r.type";

router.get('/', (req, res) => {
    res.send('Index Page');
});

router.get('/schools', (req, res) => {
    client.query(requestSchoolList, [])
        .then(result => {
            console.log('_________________________Schools____________________________');
            console.log(`\nGet list of Schools from database :`);
            console.log(`result`, result.rows);
            res.send(result.rows);
            console.log('_____________________________________________________________');
            res.end();
        })
        .catch(e => res.status(400).send("Bad request in school request"))
});

router.get('/students', (req, res) => {
    client.query(requestStudentList, [])
        .then(result => {
            console.log('_________________________Students____________________________');
            console.log(`\nGet list of Students from database :`);
            console.log(`result`, result.rows);
            res.send(result.rows);
            console.log('_____________________________________________________________');
            res.end();
        })
        .catch(e => res.status(400).send("Bad request in school students"))
});

router.post('/shortest/:student/:school', (req, res) => {
    console.log('_________________________Short Path____________________________');
    sendPath(req, res, searchSafestRoad)
});

router.post('/safest/:student/:school', (req, res) => {
    console.log('_________________________Safe Path____________________________');
    sendPath(req, res, searchNearestRoad)
});

const sendPath = (req, res, pathRequest) => {
    const school = req.params.school
    const student = req.params.student
    //Get School Addresse
    console.log(`\nGet School ${school} Addresse from database :`);
    client.query(searchSchoolAdrQuery, [school])
        .then(schoolResult => {
            const schoolAdresse = schoolResult.rows[0];
            console.log('result :', schoolAdresse);

            //Get Student Addresse
            console.log(`\nGet Student ${student} Addresse from database :`);
            client.query(searchStudentAdrQuery, [student])
                .then(studentResult => {
                    const studentAdresse = studentResult.rows[0];
                    console.log('result :', studentAdresse);
                    //Close road to the school
                    console.log(`\nGet Close Road Addresse to the School from database :`);
                    client.query(requestRoad, [schoolAdresse.x, schoolAdresse.y])
                        .then(schoolRoad => {
                            const source = schoolRoad.rows[0].id;
                            console.log('result :', schoolRoad.rows);
                            //Close road to the student
                            console.log(`\nGet Close Road Addresse to the Student from database :`);
                            client.query(requestRoad, [studentAdresse.x, studentAdresse.y])
                                .then(studentRoad => {
                                    const target = studentRoad.rows[0].id;
                                    console.log('result :', studentRoad.rows);
                                    //Calculate the nearest road to schol from
                                    console.log(`\nGet Roads from School to the student :`);
                                    client.query(pathRequest, [source, target])
                                        .then(roads => {
                                            console.log('Roads are :');
                                            for (const index in roads.rows) {
                                                const road = roads.rows[index];
                                                console.log(`Road #${index} : name(${road.name}) type(${road.type})`);
                                            }
                                            res.send({
                                                adrEco: schoolAdresse,
                                                adrEtu: studentAdresse,
                                                result: roads.rows
                                            });
                                            console.log('_____________________________________________________________');
                                            res.end();
                                        })
                                        .catch(e => { console.log(e); return res.status(400).send("Bad request in roads request") })
                                })
                                .catch(e => { console.log(e); return res.status(400).send("Bad request in student road") })
                        })
                        .catch(e => { console.log(e); return res.status(400).send("Bad request in school road") })
                })
                .catch(e => { console.log(e); return res.status(400).send("Bad request in student request") })
        })
        .catch(e => { console.log(e); return res.status(400).send("Bad request in school request") })

}
module.exports = router;