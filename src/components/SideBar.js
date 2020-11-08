import React, { useState, useEffect } from "react";
import axios from "axios";

const url = 'http://localhost:3001/';

const SideBar = () => {
    const [student, setStudent] = useState();
    const [school, setSchool] = useState();

    const [schools, setSchools] = useState({ data: [] });
    const [students, setStudents] = useState({ data: [] });

    useEffect(() => {
        axios.get(url + 'schools')
            .then(({ data }) => {
                setSchools({ data });
                console.log('=>', data);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get(url + 'students')
            .then(({ data }) => {
                setStudents({ data });
                console.log('=>', data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const onStudentChange = event => setStudent(event.target.value);
    const onSchoolChange = event => setSchool(event.target.value);

    const renderSchools = () => schools.data.map(school => {
        console.log(school);
        return (<option key={school.id} value={school.id}> {school.name} </option>);
    });

    const renderStudents = () => students.data.map(student => <option key={student.id} value={student.id}> {student.name} </option>);

    return (
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
        </div>
    );
}

const styles = {
    title: {
        borderRadius: '5px',
        border: '1px solid #ddeff7',
        textAlign : 'center'
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
};
export default SideBar;