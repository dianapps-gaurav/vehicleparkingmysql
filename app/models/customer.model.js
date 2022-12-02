const sql = require("./db");
const util = require("util");
const query = util.promisify(sql.query).bind(sql);

const customer = function (customer) {
    this.name = customer.name;
    this.vehicleNumber = customer.vehicleNumber;
    this.vehicleType = customer.vehicleType;
    this.slotNumber = customer.slotNumber;

};

customer.fourWheelerQuery = async () =>{
    const fourWheelerCount = await query("select count(id) as counting from park where vehicleType = 4");
    
    return fourWheelerCount;
};
customer.twoWheelerQuery = async () =>{
    const twoWheelerCount = await query("select count(id) as counting from park where vehicleType = 2");
    
    return twoWheelerCount;
};
customer.allSlots = async () => {
    const findAllSlots = await query("select slotNumber  from park order by slotNumber");

    return findAllSlots;
};
customer.insertData = async (newCustomer) => {
    const insertedData = await query("insert into park SET ?",newCustomer);

    return insertedData;
};
customer.getDataById = async (id) => {

    const getData = await query (`select * from park where id = ${id}`);
    
    return getData;

};

customer.getDetails = async () => {

    const getAllData = await query ("select * from park");
    
    return getAllData;

};
customer.updateById = async (id,customer) => {

    const updateAllData = await query ("update park SET name = ?,vehicleNumber = ?,vehicleType = ? where id = ?",[ customer.name ,customer.vehicleNumber,customer.vehicleType,id ]);
    
    return updateAllData;

};
customer.deleteById = async (id) => {

    const deleteData = await query (`delete from park where id = ${id}`);
    
    return deleteData;

};
module.exports = customer;
