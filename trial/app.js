const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql2");
const fs = require("fs");
const os = require("os");

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
express.static("static");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

const path = require("path");
app.use("/static", express.static(path.join(__dirname, "static")));
//app.use("/static", express.static("static"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "gfa",
  database: "urlaliaser",
});

function createTables() {
  const urlaliaser = new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS urlaliaser 
        (id INT AUTO_INCREMENT primary key NOT NULL, 
          url varchar(200),
          alias varchar(200) ,
          hitcount INT NOT NULL DEFAULT 0,
          secretcode INT NOT NULL ,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW());`,
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });

  const newdata = new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS newdata 
        (id INT AUTO_INCREMENT primary key NOT NULL, 
          title varchar(200),
          author varchar(200) ,
          category varchar(200),
          publisher varchar(200) ,
          price INT NOT NULL DEFAULT 0 );`,
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });

  Promise.all([urlaliaser, newdata])
    .then(() => {
      console.log("Both tables created if did not exist");
    })
    .catch((error) => {
      console.error(error);
    });
}
createTables();

//object for aditional data
const newData = [
  {
    title: "Introduction to Electrodynamics",
    author: "William Norton",
    category: "Science",
    publisher: "New Harrold Publication",
    price: 85,
  },
  {
    title: "Understanding of Steel Construction",
    author: "William Maugham",
    category: "Technology",
    publisher: "Jex Max Publication",
    price: 105,
  },
  {
    title: "Guide to Networking",
    author: "William Anthony",
    category: "Computers",
    publisher: "BPP Publication",
    price: 200,
  },
  {
    title: "Transfer  of Heat and Mass",
    author: "S.B.Swaminathan",
    category: "Technology",
    publisher: "Ultra Press Inc.",
    price: 250,
  },
  {
    title: "Conceptual Physics",
    author: "Thomas Morgan",
    category: "Science",
    publisher: "Summer Night Publication",
    price: 145,
  },
  {
    title: "Fundamentals of Heat",
    author: "Thomas Merton",
    category: "Science",
    publisher: "Mountain Publication",
    price: 112,
  },
  {
    title: "Advanced 3d Graphics",
    author: "Piers Gibson",
    category: "Computers",
    publisher: "BPP Publication",
    price: 56,
  },
  {
    title: "exterminatus",
    author: "adeptus astartes",
    category: "sci-fi",
    publisher: "empire of men",
    price: 15,
  },
];

//another object for additional data
const userdata = [
  {
    url: "https://warhammer40k.fandom.com/wiki/Warlord-class_Titan",
    alias: [
      { first: "warlord1", message: "it is my name." },
      { second: "warlord2", message: "this is also my name" },
    ],
    hitcount: 5,
    secretcode: 8808,
  },
  {
    url: "https://warhammer40k.fandom.com/wiki/Emperor-class_Battleship",
    alias: [
      { first: "gloriana", message: "it is my name." },
      { second: "dominus astra", message: "this is also my name" },
    ],
    hitcount: 15,
    secretcode: 868,
  },
];

//rendering the main page with urlaliaser table with templating
app.get("/", (req, res) => {
  connection.query("SELECT * FROM urlaliaser", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    connection.query("SELECT * FROM newdata", (err, data2) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      res.render("main.ejs", { data: data, data2: data2 });
    });
  });
});

/*standard way
app.get("/", (req, res) => {
  res.send(
  res.render(
    path.resolve(path.join(__dirname, "/../bookstore1/views/index.ejs"))
  );
});
*/

//get all from the database(urlaliaser)
// http://localhost:3000/api/getData
app.get("/api/getData", (req, res) => {
  connection.query("SELECT * FROM urlaliaser", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    res.status(200).send(data);
  });
});

//get all from the database(urlaliaser) with offset and size
// http://localhost:3000/api/getSelect?offset=0&size=5
app.get("/api/getSelect", (req, res) => {
  const query = connection.query(
    `SELECT * FROM urlaliaser LIMIT ?, ?;`,
    [parseInt(req.query.offset), parseInt(req.query.size)],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send({
          message: "success",
          size: result.length,
          data: result,
        });
      }
    }
  );
});

//get some filtered data from database(table: newdata) and store them in .txt
// http://localhost:3000/api/filtering?publisher=Mountain Publication&plt=200&pgt=100&category=Science
app.get("/api/filtering", (req, res) => {
  const filters = []; // list of string
  const parameters = []; // list of values

  if (req.query.category !== undefined) {
    filters.push("category = ?");
    parameters.push(req.query.category);
  }

  if (req.query.publisher !== undefined) {
    filters.push("publisher = ?");
    parameters.push(req.query.publisher);
  }
  if (req.query.plt !== undefined) {
    filters.push("price < ?");
    parameters.push(req.query.plt);
  }

  if (req.query.pgt !== undefined) {
    filters.push("price > ?");
    parameters.push(req.query.pgt);
  }
  console.log(req.query);
  let select = `SELECT newdata.category as category ,
                         newdata.publisher as publisher ,
                         newdata.price as price
                         FROM newdata `;

  if (filters.length > 0) {
    select += ` WHERE ` + filters.join(" AND ");
  }
  console.log(select);
  console.log(parameters);
  connection.query(select, parameters, (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      let dataToSave = data.map((item) => JSON.stringify(item));
      dataToSave = dataToSave.join(os.EOL);
      // Use fs.appendFile to add new post to the file
      fs.appendFile("./filtered.txt", dataToSave, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          // Send a success message in the response
          res.status(200).send({ message: "Data saved to filtered.txt" });
        }
      });
    }
  });
});

//gets some data from 2 tables with JOIN
// http://localhost:3000/api/joindata
app.get("/api/joindata", (req, res) => {
  let query = `SELECT newdata.category as category,
                        newdata.publisher as publisher,
                        urlaliaser.alias as alias,
                        urlaliaser.secretcode as secretcode
                        FROM urlaliaser
                        INNER JOIN newdata ON newdata.id = urlaliaser.id`;

  connection.query(query, (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
});

/*posting new data from object to database - universal, for sending all at once
let dataNew = [];
for (let i = 0; i < userdata.length; i++) {
    dataNew.push([
      userdata[i].url,
      userdata[i].alias[0].first,
      userdata[i].hitcount,
      userdata[i].secretcode,
      timestamp,
    ]);
  }
*/

//adds new data from object to table newData
app.post("/api/newtabledata", (req, res) => {
  const dataNew = [];
  for (let i = 0; i < newData.length; i++) {
    connection.query(
      `SELECT * FROM newdata WHERE  title = ? AND author = ? AND category = ? AND publisher = ? AND price = ? `,
      [
        newData[i].title,
        newData[i].author,
        newData[i].category,
        newData[i].publisher,
        newData[i].price,
      ],
      (err, rows) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (rows.length === 0) {
          dataNew.push([
            newData[i].title,
            newData[i].author,
            newData[i].category,
            newData[i].publisher,
            newData[i].price,
          ]);
        }
        if (i === newData.length - 1) {
          if (dataNew.length > 0) {
            connection.query(
              `INSERT INTO newData (title, author, category, publisher, price) VALUES ? `,
              [dataNew],
              (err) => {
                if (err) {
                  return res.status(500).json(err);
                }
                return res
                  .status(200)
                  .json({ message: "data are added to the table" });
              }
            );
          } else {
            return res.status(400).json({ error: "data already in table" });
          }
        }
      }
    );
  }
});

//posting some new data from object to table urlaliaser
// http://localhost:3000/api/objectDataFirst
app.post("/api/objectDataFirst", (req, res) => {
  connection.query(
    `SELECT * FROM urlaliaser WHERE  url = ? AND  alias = ?`,
    [userdata[0].url, userdata[0].alias[0].first],
    (err, rows) => {
      console.log(rows, err);
      if (err) {
        return res.status(500).json(err);
      }
      if (rows.length > 0) {
        return res.status(400).json({ error: "Your titan is already in use" });
      } else {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        const timestamp = new Date(Date.now() - tzoffset)
          .toISOString()
          .slice(0, -1);
        const dataNew = [];
        dataNew.push([
          userdata[0].url,
          userdata[0].alias[0].first,
          userdata[0].hitcount,
          userdata[0].secretcode,
          timestamp,
        ]);
        connection.query(
          `INSERT INTO urlaliaser (url, alias, hitcount, secretcode, timestamp) VALUES ? `,
          [dataNew],
          (err) => {
            console.log(err);
            if (err) {
              return res.status(500).json(err);
            }
            return res
              .status(200)
              .json({ message: "titan is added to the table" });
          }
        );
      }
    }
  );
});

//posting some different new data from object to table urlaliaser
// http://localhost:3000/api/objectDataSecond
app.post("/api/objectDataSecond", (req, res) => {
  connection.query(
    `SELECT * FROM urlaliaser WHERE  url = ? AND  alias = ?`,
    [userdata[1].url, userdata[1].alias[0].first],
    (err, rows) => {
      console.log(rows, err);
      if (err) {
        return res.status(500).json(err);
      }
      if (rows.length > 0) {
        return res.status(400).json({ error: "Your ship is already in use" });
      } else {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        const timestamp = new Date(Date.now() - tzoffset)
          .toISOString()
          .slice(0, -1);
        const dataNew = [
          userdata[1].url,
          userdata[1].alias[0].first,
          userdata[1].hitcount,
          userdata[1].secretcode,
          timestamp,
        ];
        connection.query(
          `INSERT INTO urlaliaser (url, alias, hitcount, secretcode, timestamp) VALUES (?) `,
          [dataNew],
          (err) => {
            console.log(err);
            if (err) {
              return res.status(500).json(err);
            }
            return res
              .status(200)
              .json({ message: "ship is added to the table" });
          }
        );
      }
    }
  );
});

//posting data to database with form
// http://localhost:3000/api/links
/* {
    "Alias": "uipputzuzt4p4t",
    "URL": "t4p444uztutzuiippt"
   }
*/
app.post("/api/links", (req, res) => {
  console.log(req.body);
  const { URL: url, Alias: alias } = req.body;
  const secretcode = Math.floor(Math.random() * 1000);

  var tzoffset = new Date().getTimezoneOffset() * 60000;
  const data = req.body;
  const timestamp =
    data?.timestamp ??
    new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

  if (!url) {
    return res.status(400).json({ error: "no data" });
  }
  if (!alias) {
    return res.status(400).json({ error: "no data" });
  }
  // Check if the submitted data is already in the database
  connection.query(
    `SELECT * FROM urlaliaser WHERE url = ? OR alias = ?`,
    [url, alias],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }
      // If the data is already in the database, return an error message
      if (rows.length > 0) {
        let error_message = "";
        for (const row of rows) {
          if (row.url === url) error_message = "Your url is already in use";
          if (row.alias === alias)
            error_message = "Your alias is already in use";
          if (row.alias === alias && row.url === url)
            error_message = "Your alias and url are already in use";
        }
        return res.status(400).json({ error: error_message });
      }
      // Otherwise, insert the data into the database
      connection.query(
        `INSERT INTO urlaliaser (url, alias, secretcode, timestamp) VALUES (?, ?, ?, ?)`,
        [url, alias, secretcode, timestamp],
        (err) => {
          if (err) {
            return res.status(500).json(err);
          }
          res.redirect("http://localhost:3000/");
          // postman -  res.status(200).json({ message: "new post added" });
        }
      );
    }
  );
});

//posting data with changeable body
// localhost:3000/api/arrays
app.post("/api/arrays", jsonParser, (req, res) => {
  let numbers = req.body.numbers;
  let what = req.body.what;

  if (what == undefined || numbers == undefined) {
    res.json({ error: "Please provide what to do with the numbers!" });
  }

  // body - {"what": "sum", "numbers": [1,2,5,10]}
  if (what === "sum") {
    let sum = 0;
    numbers.forEach((element) => {
      sum += element;
    });

    res.json({
      result: sum,
    });
  }

  // body - {"what": "multiply", "numbers": [1,2,5,10]}
  if (what === "multiply") {
    let sum = 1;
    numbers.forEach((element) => {
      sum *= element;
    });

    res.json({
      result: sum,
    });
  }

  // body - {"what": "double", "numbers": [1,2,5,10]}
  if (what === "double") {
    let double = [];
    numbers.forEach((element) => {
      double.push(element * 2);
    });

    res.json({
      result: double,
    });
  }
});

//insert some data to 2 different tables
// http://localhost:3000/api/book/sendData
app.post("/api/book/sendData", (req, res) => {
  console.log(req.body);
  const {
    Alias: alias,
    Category: category,
    Secretcode: secretcode,
    Publisher: publisher,
  } = req.body;

  connection.query(
    `INSERT INTO urlaliaser (alias, secretcode) VALUES (?, ?)`,
    [alias, secretcode],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      connection.query(
        `INSERT INTO newData (category, publisher) VALUES (?, ?)`,
        [category, publisher],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "data not inserted" });
          }
          res.status(200).json({ message: "Data inserted successfully" });
        }
      );
    }
  );
});

//delete all table
app.delete("/api/delTable", (req, res) => {
  connection.query(`DELETE FROM urlaliaser `, (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

//delete post with id
// http://localhost:3000/api/links/396
app.delete("/api/links/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Check if the record with the given id exists in the database
  connection.query(
    `SELECT * FROM urlaliaser WHERE id = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }

      // If the record doesn't exist, return a 404 status code
      if (rows.length === 0) {
        return res.status(400).json({ error: "wrong id" });
      }

      // If the secret code matches, delete the record from the database
      connection.query(`DELETE FROM urlaliaser WHERE id = ?`, [id], (err) => {
        if (err) {
          return res.status(500).json(err);
        }
        res.status(200).json({ message: "delete completed" });
      });
    }
  );
});

//delete post with secretcode
// http://localhost:3000/api/links/?secretcode=8808
app.delete("/api/links", (req, res) => {
  // Check if the record with the given id exists in the database
  const secretcode = parseInt(req.query.secretcode);

  connection.query(
    `SELECT * FROM urlaliaser WHERE secretcode = ?`,
    [secretcode],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }

      // If the record doesn't exist, return a 404 status code
      if (rows.length === 0) {
        return res.status(400).json({ error: "wrong code" });
      }

      // If the record exists, check if the secret code matches
      if (rows[0].secretcode !== secretcode) {
        return res.sendStatus(403);
      }

      // If the secret code matches, delete the record from the database
      connection.query(
        `DELETE FROM urlaliaser WHERE secretcode = ?`,
        [secretcode],
        (err) => {
          if (err) {
            return res.status(500).json(err);
          }
          res.status(200).json({ message: "delete completed" });
        }
      );
    }
  );
});

//delete post with id and secret code in body
// http://localhost:3000/api/delete/402
/* {
  "secretCode": 868
   }
*/
app.delete("/api/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const secretCode = req.body.secretCode;

  // Check if the record with the given id exists in the database
  connection.query(
    `SELECT * FROM urlaliaser WHERE id = ?`,
    [id],
    (err, rows) => {
      if (!secretCode) {
        return res.status(404).send({ message: "code was not provided." });
      }
      if (rows.length === 0) {
        return res.status(404).send({ message: "Id cannot be found." });
      }
      if (rows[0]["secretcode"] !== secretCode) {
        return res.status(401).send({ message: "Invalid secret code." });
      }
      // If the secret code matches, delete the record from the database
      connection.query(`DELETE FROM urlaliaser WHERE id = ?`, [id], (err) => {
        if (err) {
          return res.status(500).json(err);
        }
        res.status(200).send({ message: "Link deleted." });
      });
    }
  );
});

//update hitcount
// http://localhost:3000/api/links/update?alias=tttt
app.put("/api/links/update", (req, res) => {
  const alias = req.query.alias;
  connection.query(
    `UPDATE urlaliaser.urlaliaser SET hitcount = hitcount + 10  WHERE alias = ?`,
    [alias],
    (err, result) => {
      console.log(err);
      if (result.affectedRows === 0) {
        res.status(404).send({ message: "No matching alias found." });
      } else {
        res.status(200).json({ message: "hitcount updated" });
      }
    }
  );
});

//update some data with id
// http://localhost:3000/api/saveData/404
/* {
    "url": "UPD",
    "alias" : "with this bodhgfhfghfghy"
    
   }
*/
app.put("/api/saveData/:id", (req, res) => {
  const { url, alias } = req.body;
  const id = parseInt(req.params.id);

  if (!url) {
    return res.status(404).send({ message: "URL and Alias was not provided." });
  }
  connection.query(
    `UPDATE urlaliaser SET url = ?, alias = ? WHERE id = ?`,
    [url, alias, id],
    (err, data) => {
      if (data.affectedRows === 0) {
        res.status(404).send({ message: " wrong id." });
      } else {
        return res.status(200).json({ message: "post updated." });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
