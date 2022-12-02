const express = require("express");
const app = express();
// const util = require("util");

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
app.get("/", (req, res) => {
    res.json({ message: "Welcome to home page." });
});

require("./app/routes/customer.routes")(app);

app.listen(8080, () => {

    console.log("listening to port number 8080");

});
