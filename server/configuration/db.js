const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URL;
async function connectToDb(){
    try{
        await mongoose.connect(url,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true
            }
        );
        console.log("Mongo database is connected");
    }
    catch(error){
        console.log("Failed to connected to database",error);
    }
}
module.exports = connectToDb;