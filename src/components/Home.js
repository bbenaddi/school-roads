import React from "react";

import Map from './Map'
import SideBar from './SideBar'

const Home = () => {
    return (
        <div className='home' style={styles.home}>
            <div className="map 8" style={styles.map}>
                <Map />
            </div>
            <br />
            <div className="sidebar 2" style={styles.sidebar}>
                <SideBar />
            </div>
        </div>
    );
}

const styles = {
    map: {
    },
    sidebar: {
        position:'absolute',
        top : 0,
        right : 0,
        width : '20%'
    },
    home :{
    },
}
export default Home;