const customer = require("../models/customer.model");

module.exports.create = async (req,res) => {
    if (!req.body) {
        res.status(400).send({
            message: "content cannot be empty"
        });
    }

    let twoWheelerCount = 0,
        fourWheelerCount = 0,
        findAllSlots = 0;
    
    let actualCount = 0;
    
    const newCustomer = new customer ({
        name: req.body.name,
        vehicleNumber: req.body.vehicleNumber,
        vehicleType: req.body.vehicleType
    });
    
    const FourWheelerQuery = await customer.fourWheelerQuery();

    const twoWheelerQuery = await customer.twoWheelerQuery();

    fourWheelerCount = FourWheelerQuery[0].counting;
    twoWheelerCount = twoWheelerQuery[0].counting;
    let n = fourWheelerCount + twoWheelerCount;

    ++n;
    const totalCount = (n * (n + 1)) / 2;

    if (
        (newCustomer.vehicleType === 4 && fourWheelerCount < 300) ||
        (newCustomer.vehicleType === 2 && twoWheelerCount < 100)
    ) {
        findAllSlots = await customer.allSlots();
    }
    
    findAllSlots.forEach((element) =>{
        actualCount += element.slotNumber;
    });
    
    const i = totalCount - actualCount;

    if (i === 0 && actualCount === 0) {
        newCustomer.slotNumber = Number(i + 1);
     
    } else if (i === 0 && actualCount !== 0) {
        newCustomer.slotNumber = Number(n + 1);
    } else {
        newCustomer.slotNumber = Number(i);
    }
        
    const insertedData = await (customer.insertData(newCustomer));
        
    res.send({
        statusCode: 200,
        message: "data inserted successfully",
        data: insertedData
    });
    
};
    
module.exports.getData = async (req,res) => {
    
    const customerData = await (customer.getDataById(req.params.customerId));

    res.send({
        statusCode: 200,
        message: "data fetched successfully",
        data: customerData
    });
};

module.exports.getAllData = async (req,res) => {
    
    const allCustomerData = await (customer.getDetails());

    res.send({
        statusCode: 200,
        message: "all data fetched successfully",
        data: allCustomerData
    });
};

module.exports.updateData = async (req,res) => {
    
    const getUpdatedData = await (customer.updateById(req.params.id,new customer(req.body)));

    res.send({
        statusCode: 200,
        message: "data updated successfully",
        data: getUpdatedData
    });
};
module.exports.deleteData = async (req,res) => {
    
    const getDeletedData = await (customer.deleteById(req.params.id));

    res.send({
        statusCode: 200,
        message: "record deleted successfully",
        data: getDeletedData
    });
};
    