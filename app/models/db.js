const mysql = require("mysql");
const dbconfig = require("../config/db.config");

const connection = mysql.createConnection({
    host: dbconfig.host,
    database: dbconfig.database,
    user: dbconfig.user,
    password: dbconfig.password,
});

connection.connect(error => {
    if (error) {
        throw error;
    }
    console.log("Successfully connected to the database.");
});

const createCustomer = "create table if not exists park(id INT(3) NOT NULL PRIMARY KEY AUTO_INCREMENT,name VARCHAR(10),vehicleNumber VARCHAR(10),vehicleType INT(1),slotNumber INT(3))";

connection.query(createCustomer, function(err) {
    if (err) {
        console.log(err.message);
    }
});

module.exports = connection;

