const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'gabriel',
    database: 'boistockdb'
});

db.connect(err =>{
    if (err) throw err;
    console.log('Conectado ao banco de dados');
});

module.exports = db;