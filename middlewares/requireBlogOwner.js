const Blog = require("../models/Blog");

module.exports = async (req,res,next)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        
        if(!blog){
            return res.status(404).render("error",{
                message: 'blog not found'
            });
        }

        if(blog.author.toString() != req.session.userId){
            return res.status(403).render("error",{
                message: 'You are not allowed to do this'
            });
        }
        req.blog = blog;
        next();
    } catch(err){
        console.log(err);
        res.status(500).render("error",{
            message: 'server error'
        })
    };
}