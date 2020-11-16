
# School Roads

This project is data extraction from QGIS, stored in Postgres with extention of postgis, Evaluated by pgrouting to link Students to Schools in sroundings.
![Home Page](https://i.imgur.com/JXoljZ5.png)
## Prepare the enviroment

### Import Data

Extract backup.sql from  backup.rar

```
$> psql -U username -d database < backup.sql
```

### Install

```
$> yarn add
```

## Configuration

Rename .env.sample to .env, and fill the varibales.

### MapBox


## Run the enviroment

In the project directory, you can run:

### Front End

```
$> yarn run start
```
App will run on localhost:3000

### Back End

```
$> yarn run server
```
Api will run on localhost:3001

/students<br />
/schools<br />
/road/:studentID/:schoolID<br />
