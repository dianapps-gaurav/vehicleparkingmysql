module.exports = (app) => {
    const customers = require("../controller/customer.controller");

    app.post("/customer",customers.create);
    app.get("/customer/:customerId", customers.getData);
    app.get("/customer/all/Details",customers.getAllData);
    app.put("/customer/update/:id",customers.updateData);
    app.delete("/customer/delete/:id",customers.deleteData);
};
