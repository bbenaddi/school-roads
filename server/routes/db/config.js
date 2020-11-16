require('dotenv').config()

exports.config = {
    username : process.env.DUSERNAME,
    password : process.env.DPASSWORD,
    host : process.env.DHOST,
    port :process.env.DPORT,
    database : process.env.DDATABASE,
};
