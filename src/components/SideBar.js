import React from "react";

const SideBar = () => {
    return (
        <div>
            <div style={styles.title}>
                Menu
            </div>
            <select type="text" name="school">
                <option>A</option>
                <option>A</option>
                <option>A</option>
            </select>
            <select type="text" name="student">
                <option>A</option>
                <option>A</option>
                <option>A</option>
            </select>
        </div>
    );
}

const styles = {
    title : {
        backgroundColor : '#DDEFF7'
    }
};
export default SideBar;