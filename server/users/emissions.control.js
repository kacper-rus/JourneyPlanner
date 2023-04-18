
const mysql = require('mysql');

const dbConfig = {
  host: 'b3xu3tgtqnvldhwsvcrq-mysql.services.clever-cloud.com',
  user: 'ussbgbiqhcqfk5ak',
  password: 'rzYgm0DpafOXQE9j0o8C',
  database: 'b3xu3tgtqnvldhwsvcrq',
  // Add the following two options for auto-reconnect
  acquireTimeout: 10000,
  waitForConnections: true,
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Failed to connect to MySQL database:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to MySQL database in the cloud :)');
    }
  });

  db.on('error', (err) => {
    console.error('MySQL database connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

async function httpGetEmissions(req, res) { 

    const sql = 'SELECT * FROM emissions';
  
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
  
      res.json(result);
    });

}

module.exports = {
    httpGetEmissions,
    db
  };
