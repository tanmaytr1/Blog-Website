const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://tanmaytr1:test123@cluster0.k9uyvm0.mongodb.net/?appName=Cluster0";

const connectDB = async ()=>{
    try{
        await mongoose.connect(dbUrl);
        console.log("connected to MongoDB 🥹");
    }catch(err){
        console.log("MongoDB connection error 😭" , err)
    }
}

module.exports = connectDB;