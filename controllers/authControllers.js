const express = require("express");
const Blog = require("../models/Blog");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports.signup_get = (req,res)=>{
    res.render("auth/signup.ejs");
}


module.exports.signup_post = async (req,res)=>{
    try{
        const { username, email, password} = req.body;
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        console.log("user created", user);

        res.redirect("/login");
    } catch(err){
        console.log(err);
        res.status(400).render("error",{
            message: "signup failed,try again"
        })
    }
}


module.exports.login_get = (req,res)=>{
    res.render("auth/login.ejs");
}


module.exports.login_post = async (req,res)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).render("error", {
                message : "Invalid username or password",
            });
        }

        const auth = await bcrypt.compare(password, user.password);
        if(!auth){
            return res.status(400).render("error",{
                message:"invalid password"
            });
        }


        req.session.userId = user._id;
        res.redirect("/blogs");

        
    } catch(error){
        console.log(error);
        res.status(500).render("error",{
            message: "login failed due to server issue"
        });
    }
}

module.exports.logout_post = (req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err);
            return res.status(500).render("error",{
                message: "Logout Failed"
            })
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    })
}