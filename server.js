const express = require("express");
const app = express();
const mysql = require("mysql");
const util = require("util");
app.set("views", "ejs");
const { json, urlencoded } = require("body-parser");

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(
  json({
    extended: true,
  })
);

var connection = mysql.createConnection({
  host: "localhost",
  database: "vehicleparking",
  user: "root",
  password: "root",
});

connection.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("MySQL Database is connected Successfully");
  }
});

const query = util.promisify(connection.query).bind(connection);

app.get("/getdata", async (req, res) => {
  let fetchAllData = await query(`select * from park order by SLOTNUMBER`);
  
  res.send(fetchAllData);
});

app.post("/insert-data", async (req, res) => {
  let twoWheelerCount = 0,
    fourWheelerCount = 0,
    
    findAllSlots = 0;
  let slots = [];
  let name = req.body.name;

  let vehicleNumber = req.body.vehicleNumber;

  let vehicleType = req.body.vehicleType;
  let FourWheelerQuery = await query(
    `select count(ID) as counting from park where VEHICLETYPE = 4`
  );

  let twoWheelerQuery = await query(
    `select count(ID) as counting from park where VEHICLETYPE = 2`
  );
  fourWheelerCount = FourWheelerQuery[0].counting;
  twoWheelerCount = twoWheelerQuery[0].counting;

  let insertedData;

  if (
    (vehicleType == 4 && fourWheelerCount < 300) ||
    (vehicleType == 2 && twoWheelerCount < 100)
  ) {
    findAllSlots = await query(
      `select SLOTNUMBER  from park order by SLOTNUMBER`
    );

    findAllSlots.forEach((element) => {
      slots.push(element.SLOTNUMBER);
    });

    let i = 1;
    if (!slots.length) {
      insertedData = await query(`
	                                   INSERT INTO park 
	                            (NAME, VEHICLENUMBER, VEHICLETYPE, SLOTNUMBER) 
                               VALUES ("${name}", "${vehicleNumber}", "${vehicleType}", "${i}")`);
    } else {
      for (let element of slots) {
        if (element == i) i++;
        else break;
      }

      insertedData = await query(`
	                                   INSERT INTO park 
	                            (NAME, VEHICLENUMBER, VEHICLETYPE, SLOTNUMBER) 
                               VALUES ("${name}", "${vehicleNumber}", "${vehicleType}", "${i}")`);
    }
  }
  res.send({
    status: 200,
    message: "data saved",
    data: insertedData
  });
});

app.get("/getdetails/:id", async(req, res) => {
  let id = req.params.id;
  console.log("id-->", id);
  let showDetails = await query(`select * from park where ID = "${id}"`);
  res.send(showDetails);
  
});

app.put("/update/:id", async (req, res) => {
  let id = req.params.id;
  let name = req.body.name;
  let vehicleNumber = req.body.vehicleNumber;
  let vehicleType = req.body.vehicleType;

  let updateDetails = await query(`update park SET NAME = "${name}", VEHICLENUMBER = "${vehicleNumber}", VEHICLETYPE = "${vehicleType}" where ID="${id}"`);

  res.send(updateDetails);
});

app.delete("/delete/:id", async(req, res) => {
  let id = req.params.id;
  let deleteDetails =await query(`delete from park where ID = "${id}"`);
  res.send(deleteDetails);
  
});

app.listen(8080, () => {
  console.log("listening to port number 8080");
});
