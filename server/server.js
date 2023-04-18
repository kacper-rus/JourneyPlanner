const express = require('express')
const app = require('./app');
const mysql = require('mysql');
const session = require('express-session');
const { db } = require('./users/emissions.control');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const axios = require('axios');
const secretKey = 'secret';
const path = require('path')

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, '..' ,'dist')))

// Define your backend routes here


// Serve the Vue.js app for all other requests

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 10 // Session expires after 10 minute of inactivity
  }
}));



app.get('/', (req, res) => {

  res.send("Hello you!")

});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM `users`';

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'An unexpected error occurred while fetching users.' });
    }

    return res.json(result);
  });

});

app.post('/users/register', async (req, res) => {
  // console.log(res)

  let { username, email, password } = req.body;
  console.log(req.body)
  console.log(username)
  console.log(email)
  console.log("Normal password: "+password)

  try {

    password = await bcrypt.hash(password, 10)
    console.log("Hashed password: "+password)

  } catch {
    res.status(500).send()
  }

  const sql = 'INSERT INTO `users` SET ?';

    db.query(sql, { username, email, password }, (error, results) => {

      if (error) {
        console.log(error.sqlMessage)
        return res.status(409).json({ message: error.sqlMessage });
      } else {
        console.log(results)
        return res.status(201).json({ message: username });
      }

      });
    
    });


app.post('/users/changePassword', async (req, res) => {
  console.log("I'm in change password")

  let { password, userID } = req.body;

  try {

    password = await bcrypt.hash(password, 10)

  } catch {
    res.status(500).send()
  }

  const sql = 'UPDATE `users` SET password = ? WHERE userID = ?';

    db.query(sql, [ password, userID ], (error, results) => {

      if (error) {
        console.log(error.sqlMessage)
        return res.status(409).json({ message: error.sqlMessage });
      } else {
        console.log(results)
        return res.status(201).json({ message: "Password changed" });
      }

      });
    
    });

    
app.post('/users/login', async (req, res) => {
  // console.log(res)

  const { username, password } = req.body;
  console.log(req.body)
  console.log(username)
  console.log(password)

  const sql = "Select * from `users` where username = ?";
  const search_query = mysql.format(sql,[username])

  db.query(search_query, async (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "An unexpected error occurred during login." });
    }
    console.log("result: ")
    console.log(result)
    if (result.length == 0) {
      console.log("--------> User does not exist")
      return res.status(404).json({ message: "The username provided does not exist." });
     } else {
      console.log("Normal password: "+password)
      console.log("Normal password: "+result[0].password)
      if (await bcrypt.compare(password, result[0].password)) {
        req.session.user = {
          username: result[0].username
        };
        res.cookie('sessionId', req.session.id, { httpOnly: true });
        let userID = result[0].userID
        const payload = { username, userID };
        const token = jwt.sign(payload, secretKey);

        console.log(token)
        console.log("req.session:")
        console.log(req.session)
        console.log("---------> Login Successful")
        return res.status(200).json({ message: "Login successful!", token: token});
        } 
        else {
          console.log("---------> Password Incorrect")
          return res.status(401).json({ message: "The password provided is incorrect." });
        } 

     }

  });
  
    
    });


  app.get('/api/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      console.log("No token")
      return res.status(401).json({ message: 'Authentication failed: Missing token' });
    }
  
    try {
      const decodedToken = jwt.verify(token, secretKey);
      const username = decodedToken.username;
      const userID = decodedToken.userID;
      console.log(decodedToken)
      console.log("Token verified")
      return res.status(200).json({ username: username, userID: userID});
    } catch (error) {
      console.log("invalid token")
      return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
  });


  app.get('/users/checkLoggedIn', (req, res) => {
    console.log("/users/checkLoggedIn")
    console.log("req.cookies.loggedIn: "+req.cookies.loggedIn)
    console.log("req.cookies.username: "+req.cookies.username)
    console.log("req.session.user: "+ req.session.user)
    const username = req.cookies.username;
      const loggedIn = req.cookies.loggedIn === 'true' && req.session.user;
      if (req.cookies.loggedIn) {
        console.log("logged")
        return res.send({ loggedIn,  username});
      } else {
        console.log("Not logged in")
        return res.status(404).json({ message: "Not logged in" });
      }
     
  });


  app.post('/users/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.clearCookie('loggedIn');
    res.clearCookie('username');
    return res.send({ message: 'Logout successful.' });
});
  
// Journeys endpoint



app.get('/getJourneys', (req, res) => {
  const sql = 'SELECT * FROM `journeys`';

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'An unexpected error occurred while fetching Journeys.' });
    }

    return res.json(result);
  });

});

app.get('/getGroups', (req, res) => {
  const sql = "SELECT * FROM `groups`";


  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'An unexpected error occurred while fetching groups.' });
    }

    return res.json(result);
  });

});

app.post('/createGroup', async (req, res) => {
  // console.log(res)
  const groupName = req.body.newGroupName;
  console.log(groupName)

  const sql = 'INSERT INTO `groups` SET ?';

  db.query(sql, { groupName }, (error, results) => {

    if (error) {
      console.log(error.sqlMessage)
      return res.status(409).json({ message: "Error: "+error.sqlMessage });
    } else {
      console.log(results)
      return res.status(201).json({ message: "Group " +groupName+" created successfully!" });
    }

      });
  });


  app.post('/joinGroup', async (req, res) => {
    const { groupID, username } = req.body;
    console.log(groupID)
    console.log(username)
  
    const sql = 'UPDATE `users` SET groupID = ? WHERE username = ?';
  
    db.query(sql, [groupID, username], (error, results) => {
  
      if (error) {
        console.log(error.sqlMessage)
        return res.status(409).json({ error: "Error: "+error.sqlMessage });
      } else {
        console.log(results)
        return res.status(201).json({ message: "You joined a group!" });
      }
  
    });
  });

  app.delete('/joinGroup/:userID', (req, res) => {
    const userID = req.params.userID;
    console.log(userID); // Log the userID

    const sql = 'UPDATE `users` SET groupID = null WHERE userID = ?';
  
    db.query(sql, [userID], (error, results) => {
  
      if (error) {
        console.log(error.sqlMessage)
        return res.status(409).json({ error: "Error: "+error.sqlMessage });
      } else {
        console.log(results)
        return res.status(201).json({ message: "Your group will miss you" });
      }
  
    });
  });


  app.get('/co2emissions/:registrationNumber', async (req, res) => {
    const registrationNumber = req.params.registrationNumber;
    try {
      const co2Emissions = await getCO2EmissionsFromReg(registrationNumber);
      res.status(200).json({ co2Emissions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  async function getCO2EmissionsFromReg(registrationNumber) {
    let co2Emissions;
    const response = await axios({
      method: 'post',
      url: 'https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      headers: {
        'x-api-key': 'dD1IAGOEHG50l3rX5x0Qo43bLolPGfeP6lXHH8vm',
        'Content-Type': 'application/json',
      },
      data: {
        registrationNumber: registrationNumber,
      },
    });
    const responseBody = response.data;
  
    switch (response.status) {
      case 200:
        co2Emissions = responseBody.co2Emissions;
        return co2Emissions;
      default:
        throw new Error(`API returned status ${response.status}`);
    }
  }
  
const intervalInMilliseconds = 100 * 1000;

// Define the function to execute the database query
const executeQuery = () => {
  const sql = 'SELECT * FROM `users`';
  db.query(sql, (err) => {
    if (err) {
      console.error('An unexpected error occurred while fetching users.', err);
      return;
    }
    console.log("Fecther data");
  });
};

// Call the function immediately to execute the query once
executeQuery();

// Call the function every minute to keep the database connection alive
setInterval(executeQuery, intervalInMilliseconds);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..' ,'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = db;