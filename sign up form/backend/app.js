const express = require("express");
const PORT = 3000;
const app = express();
const mysql = require("mysql2");

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
  const { username, email } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username cannot be empty' });
  }
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const timestamp = req.body.timestamp ?? new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

  connection.query(
    'INSERT INTO users (username, email, timestamp) VALUES (?, ?, ?)',
    [username, email, timestamp],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error saving data to database' });
      }
      res.redirect('/');
    }
  );
});



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
