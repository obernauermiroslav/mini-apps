const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql2");

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
express.static("static");
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const path = require("path");
app.use("/static", express.static(path.join(__dirname, "static")));
//app.use("/static", express.static("static"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "gfa",
  database: "weather",

  
});

connection.query(
  `CREATE TABLE IF NOT EXISTS weather 
    (id INT AUTO_INCREMENT primary key NOT NULL, 
      city varchar(200),
      location varchar(200) ,
      weather varchar(200),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW());`,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("weather table created if did not exist");
  }
);

const forecasts = [
  {
    city: "Seattle",
    location: "Washington, United States",
    weather: [
      { temp: 11, icon: "cloudy", message: "Complete Grey" },
      { temp: 11, icon: "cloudy", message: "Just stay in bed." },
      { temp: 13, icon: "cloudy", message: "Meh..." },
      { temp: 12, icon: "cloudy", message: "Still meh..." },
      { temp: 13, icon: "partly_cloudy", message: "Not too sunny." },
    ],
  },
  {
    city: "Miami",
    location: "Florida, United States",
    weather: [
      { temp: 33, icon: "sunny", message: "Hot." },
      { temp: 35, icon: "sunny", message: "Too hot!" },
      { temp: 34, icon: "sunny", message: "Sunny." },
      { temp: 34, icon: "sunny", message: "Beach time!" },
      { temp: 35, icon: "sunny", message: "Here comes the sun." },
    ],
  },
  {
    city: "Barcelona",
    location: "Spain",
    weather: [
      { temp: 19, icon: "sunny", message: "Sunny." },
      { temp: 15, icon: "partly_cloudy", message: "Not too sunny." },
      { temp: 17, icon: "sunny", message: "So far so good." },
      { temp: 16, icon: "rainy", message: "Rihanna - Umbrella" },
      { temp: 18, icon: "sunny", message: "Here comes the sun." },
    ],
  },
  {
    city: "London",
    location: "United Kingdom",
    weather: [
      { temp: 4, icon: "snowy", message: "Go home winter." },
      { temp: 7, icon: "rainy", message: "Do you have an umbrella?" },
      { temp: 10, icon: "rainy", message: "It's rainy." },
      { temp: 9, icon: "rainy", message: "Meh..." },
      { temp: 11, icon: "rainy", message: "Meh... Again." },
    ],
  },
  {
    city: "Budapest",
    location: "Hungary",
    weather: [
      { temp: 12, icon: "partly_cloudy", message: "It's cloudy." },
      { temp: 16, icon: "rainy", message: "Sooo... Wet." },
      { temp: 18, icon: "partly_cloudy", message: "Here comes the sun." },
      { temp: 16, icon: "partly_cloudy", message: "Not too sunny." },
      { temp: 19, icon: "partly_cloudy", message: "So far so good." },
    ],
  },
];

app.get("/", (req, res) => {
  res.render("weather.ejs", { forecasts: forecasts });
});

app.post("/api/weather/submit", (req, res) => {
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  const data = req.body;
  const timestamp =
    data?.timestamp ??
    new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
  let dataNew = [];
  for (let i = 0; i < forecasts.length; i++) {
    dataNew.push([
      forecasts[i].city,
      forecasts[i].location,
      forecasts[i].weather[0].temp,
      timestamp,
    ]);
  }
  connection.query(
    `INSERT INTO weather (city, location, weather, timestamp) VALUES ? `,
    [dataNew],

    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.status(200).send();
    }
  );
});

app.post("/api/weather/sendData", (req, res) => {
  console.log(req.body);
  const { City: city, Location: location, Weather: weather } = req.body;
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  const data = req.body;
  const timestamp =
    data?.timestamp ??
    new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
  connection.query(
    `INSERT INTO weather (city, location, weather, timestamp) VALUES (?, ?, ?, ?)`,
    [city, location, weather, timestamp],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.redirect("http://localhost:3000/locations?location=Washington,%20United%20States");
    }
  );
});

app.get("/locations", (req, res) => {
  const location = req.query.location;
  let result = forecasts.filter((x) => x.location === location);

  res.render("locations.ejs", { location: result[0] });
});

app.get("/getData", (req, res) => {
  connection.query("SELECT * FROM weather.weather", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    res.status(200).send(data);
  });
});

app.delete("/api/weather/delete", (req, res) => {
  connection.query(`DELETE FROM weather `, (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

app.delete("/api/weather/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send();
    return;
  }
  connection.query(
    `DELETE FROM weather WHERE id = ? `,
    [id],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else if (result.affectedRows === 0) {
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    }
  );
});



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
