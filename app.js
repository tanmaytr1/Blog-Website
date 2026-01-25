const express = require('express');
const app = express();
const connectDB = require("./config/db");
const methodOverride = require("method-override");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const session = require("express-session");
const User = require("./models/User");


//connection to mongodb
connectDB();

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));

app.use(
    session({
        secret: "super-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
);

app.use(async(req,res,next)=>{
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.locals.currentUser = user;
    }
    else{
        res.locals.currentUser= null;
    }
    next();
});

app.locals.timeAgo = function (date){
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (let unit in intervals) {
        const value = Math.floor(seconds / intervals[unit]);
        if (value >= 1) {
            return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}


//routes
app.use('/',blogRoutes);
app.use('/',authRoutes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

