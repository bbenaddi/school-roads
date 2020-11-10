
# School Roads

This project is data extraction from QGIS, stored in Postgres with extention of postgis, Evaluated by pgrouting to link Students to Schools in sroundings.
![Home Page](https://i.imgur.com/JXoljZ5.png)
## Prepare the enviroment

### Import Data

Extract backup.sql

Run psql -U username -d database < backup.sql

### Install

Run npm install

## Configuration

### Database
Fill connection object in './server/db.config.js'

### MapBox
Fill MapBox AccessToken in './src/components/Home.js'

## Run the enviroment

In the project directory, you can run:

### Front End

Runs npm start
App will run on localhost:3000

### Back End

Runs node ./server/index/js
Api will run on localhost:3001

/students<br />
/schools<br />
/road/:studentID/:schoolID<br />
