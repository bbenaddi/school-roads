import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

/*
import Map from './Map'
import SideBar from './SideBar'
*/
const url = 'http://localhost:3001/';

const Home = () => {
    const [student, setStudent] = useState(1);
    const [school, setSchool] = useState(1);

    const [schools, setSchools] = useState({ data: [] });
    const [students, setStudents] = useState({ data: [] });

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmJlbmFkZGkiLCJhIjoiY2tnbzkxcXN4MDAxZzJ0bDgzNXdxcW9uZiJ9.x2jIHTfrSAzgdcJTaUKcTA';
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
                center: [0, 0],
                zoom: 5
            });

            map.on("load", () => {
                setMap(map);
                map.resize();
            });
        };

        if (!map) initializeMap({ setMap, mapContainer });
        axios.get(url + 'schools')
            .then(({ data }) => {
                setSchools({ data });
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get(url + 'students')
            .then(({ data }) => {
                setStudents({ data });
            })
            .catch((error) => {
                console.log(error);
            });

    }, [map]);

    const onStudentChange = event => setStudent(event.target.value);
    const onSchoolChange = event => setSchool(event.target.value);

    const renderSchools = () => schools.data.map(school => <option key={school.gid} value={school.gid}> {school.name} </option>);

    const renderStudents = () => students.data.map(student => <option key={student.id} value={student.id}> {student.name} {student.prenom} </option>);

    const onClickHandle = (e) => {
        //e.preventDefaults();
        console.log(url + 'road/'+student+'/'+school);
        axios.get(url + 'road/'+student+'/'+school)
            .then(({ data }) => {
            })
            .catch((error) => {
                console.log(error);
            });    
    };

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
                    <button onClick={onClickHandle}>Tracer</button>
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
        itemsAlign: 'center'
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
    }
}
export default Home;