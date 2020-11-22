import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

require('dotenv').config()

const url = process.env.REACT_APP_SERVERURL;

const Home = () => {
    const [student, setStudent] = useState(1);
    const [school, setSchool] = useState(1);
    const [oldData, setOldData] = useState([]);

    const [schools, setSchools] = useState({ data: [] });
    const [students, setStudents] = useState({ data: [] });

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);


    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_ACCESSTOKEN;
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: process.env.REACT_APP_STYLE,
                center: [-7.64, 33.58],
                zoom: 12
            });

            map.on('load', function () {
                setMap(map);
/*
                map.on('click', function (e) {
                    var coordinates = e.lngLat;
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML('<h1><strong>You are Here:</strong></h1> <br/>')
                        .addTo(map);
                    const point = map.project(coordinates);

                    setLocation(point);
                });
*/
            });

        };

        if (!map) initializeMap({ setMap, mapContainer });

        axios.get(url + 'schools')
            .then(({ data }) => setSchools({ data }))
            .catch((error) => console.log(error));
        axios.get(url + 'students')
            .then(({ data }) => setStudents({ data }))
            .catch((error) => console.log(error));
    }, [map]);

    const onStudentChange = event => setStudent(event.target.value);
    const onSchoolChange = event => setSchool(event.target.value);

    const renderSchools = () => schools.data.map(school => <option key={school.gid} value={school.gid} title={school.name}> {school.name} </option>);
    const renderStudents = () => students.data.map(student => <option key={student.id} value={student.id} title={student.nom + ' ' + student.prenom}> {student.nom} {student.prenom} </option>);

    const drawMarker = (id, coordinates, title, imageURL) => {
        map.loadImage(
            imageURL,
            function (error, image) {
                if (error) throw error;
                map.addImage('I' + id, image);
                map.addSource('M' + id, {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': { 'type': 'Point', 'coordinates': coordinates },
                                'properties': { 'title': title }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'M' + id,
                    'type': 'symbol',
                    'source': 'M' + id,
                    'layout': {
                        'icon-image': 'I' + id,
                        'text-field': ['get', 'title'],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                });
            }
        );
    }

    const drawLineString = (id, geometry, color = 'blue') => {
        map.addSource(id, {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'properties': {},
                            'coordinates': geometry.coordinates
                        }
                    },
                ]
            }
        });
        map.addLayer({
            'id': id,
            'type': 'line',
            'source': id,
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': { 'line-color': color, 'line-width': 1 }
        });
    }
    const removeLayerSource = (id) => {
        map.removeLayer(id);
        map.removeSource(id);
    }

    const onShortDistanceClick = (e) => {
        axios.post(url + 'shortest/' + student + '/' + school)
            .then(({ data }) => {
                oldData.forEach(element => removeLayerSource("L" + element.id))

                setOldData(data.result);

                var p1 = data.adrEtu;
                var p2 = data.adrEco;

                drawMarker('e' + school, [p2.x, p2.y], schools.data[school - 1].name,
                    'http://www.myiconfinder.com/icon/download/24-24-e414d7db351dac6a4e7223bbd16706c9-school.png');
                drawMarker('s' + student, [p1.x, p1.y], students.data[student - 1].nom + students.data[student - 1].prenom,
                    'http://www.myiconfinder.com/icon/download/24-24-4ee75941b34533d1e05d60abba692c54-student.png');

                data.result.forEach(element => {
                    const geometry = JSON.parse(element.geom);
                    drawLineString("L" + element.id, geometry)

                });
                map.flyTo({ center: [p1.x, p1.y], zoom: 14, essential: true });
            })
            .catch((error) => console.log(error));
    };

    const onSafeDistanceClick = (e) => {
        axios.post(url + 'safest/' + student + '/' + school)
            .then(({ data }) => {
                oldData.forEach(element => removeLayerSource("L" + element.id))

                setOldData(data.result);

                var p1 = data.adrEtu;
                var p2 = data.adrEco;

                drawMarker('e' + school, [p2.x, p2.y], schools.data[school - 1].name,
                    'http://www.myiconfinder.com/icon/download/24-24-e414d7db351dac6a4e7223bbd16706c9-school.png');
                drawMarker('s' + student, [p1.x, p1.y], students.data[student - 1].nom + students.data[student - 1].prenom,
                    'http://www.myiconfinder.com/icon/download/24-24-4ee75941b34533d1e05d60abba692c54-student.png');

                data.result.forEach(element => {
                    const geometry = JSON.parse(element.geom);
                    drawLineString("L" + element.id, geometry, 'green')

                });
                map.flyTo({ center: [p1.x, p1.y], zoom: 14, essential: true });
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className='home' style={styles.home}>
            <div className="map 8" style={styles.map}>
                <div ref={el => (mapContainer.current = el)} style={styles.mapContainer} />
            </div>
            <br />
            <div className="sidebar 2" style={styles.sidebar}>
                <div style={styles.container}>
                    <div style={styles.title}>
                        Menu
                    </div>
                    <label style={styles.label} >School :</label>
                    <select type="text" style={styles.select} name="school" value={school} onChange={onSchoolChange}>
                        {schools && renderSchools()}
                    </select>
                    <label style={styles.label} >Student :</label>
                    <select type="text" style={styles.select} name="student" value={student} onChange={onStudentChange}>
                        {students && renderStudents()}
                    </select>
                    <button style={styles.button} onClick={onShortDistanceClick}>Shortest Path</button>
                    <button style={styles.button} onClick={onSafeDistanceClick}>Safest Path</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    map: {
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '20%'
    },
    home: {
    },
    mapContainer: {
        width: "80%",
        height: "calc(100vh - 80px)",
        position: "absolute"
    },
    title: {
        borderRadius: '5px',
        border: '1px solid #ddeff7',
        textAlign: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        itemsAlign: 'center',
        alignItems: 'center',
        margin: '11px'
    },
    select: {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '##ddeff7',
        padding: '0.8rem 0.8rem',
        cursor: 'pointer'
    },
    label: {
        borderRadius: '5px',
        border: '1px solid #ddeff7'
    },
    button: {
        font: 'inherit',
        margin: '0.6rem',
        fontWeight: '600',
        padding: '0.6rem 2rem',
        background: '#b6f2ff',
        color: 'currentcolor',
        border: '1px solid',
        transition: 'background 100ms ease',
        position: 'static'
    }
}
export default Home;