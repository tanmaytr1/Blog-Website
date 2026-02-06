const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URI;


const connectDB = async ()=>{
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI not defined in .env");
    }

    try{
        await mongoose.connect(dbUrl);
        console.log("connected to MongoDB 🥹");
    }catch(err){
        console.log("MongoDB connection error 😭" , err)
    }
}

module.exports = connectDB;