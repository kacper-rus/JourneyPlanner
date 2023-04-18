const mysql = require('mysql');

// Connect to the database using mysql
const db_hostname = "studdb.csc.liv.ac.uk";
const db_database = "hskruszk";
const db_username = "hskruszk";
const db_password = "123";
const db_charset = "utf8mb4";
const connection = mysql.createConnection({
  host: db_hostname,
  user: db_username,
  password: db_password,
  database: db_database,
  charset: db_charset
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database with connection id: ' + connection.threadId);
});

// Perform database operations here...

connection.end((err) => {
  if (err) {
    console.error('Error ending MySQL database connection: ' + err.stack);
    return;
  }
  console.log('MySQL database connection ended.');
});