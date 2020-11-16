const { config } = require('./config');
const { Client, Query } = require('pg')

const client = new Client("postgres://" + config.username + ":" + config.password + "@" + config.host + ':' + config.port + "/" + config.database);
client
    .connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('connection error', err.stack))

exports.client = client;