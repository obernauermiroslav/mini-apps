const express = require("express");
const PORT = 3000;
const app = express();
const mysql = require("mysql2");
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/../frontend"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "gfa",
  database: "signupform",
});

connection.query(
  `CREATE TABLE IF NOT EXISTS users 
    (id INT AUTO_INCREMENT primary key NOT NULL, 
      username varchar(200) NOT NULL,
      password varchar(200) NOT NULL,
      email varchar(200) NOT NULL ,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW());`,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("signupform table created if did not exist");
  }
);


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username cannot be empty' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error saving data to database' });
    }

    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const timestamp = req.body.timestamp ?? new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

    // Store the hashed password in the database
    connection.query(
      'INSERT INTO users (username, email, password, timestamp) VALUES (?, ?, ?, ?)',
      [username, email, hash, timestamp],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error saving data to database' });
        }
        res.redirect('/');
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
