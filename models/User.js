const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {isEmail} = require("validator");

userSchema = new Schema({
    username:{
        type:String,
        required: [true, 'username is required'],
        unique: [true, 'username already exists'],
    }, 
    email:{
        type:String,
        required: [true, 'email is required'],
        unique: [true, 'this email is already in use'],
        validate : [isEmail,'please enter a valid email adress']    
    },
    password:{
        type: String,
        require:[true, 'password is required'],
        minlength: [6 , 'password should be min 6 letters long'],
    } 
}); 

module.exports = mongoose.model("User", userSchema);