const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: '123',
  database: 'restaurante',
  multipleStatements: true
});

module.exports = connection;