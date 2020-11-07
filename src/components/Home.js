import React from "react";

import Map from './Map'
import SideBar from './SideBar'

const Home = () => {
    return (
        <div className='home' style={styles.home}>
            <div className="map" style={styles.map}>
                <Map />
            </div>
            <br />
            <div className="sidebar" style={styles.sidebar}>
                <SideBar />
            </div>
        </div>
    );
}

const styles = {
    map: {
        flexGrow: 1,

    },
    sidebar: {
        flexGrow: 1,
    },
    home :{
        flexDirection: 'row'

    }
}
export default Home;