const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const requireAuth = require("../middlewares/requireAuth");
const requireBlogOwner = require("../middlewares/requireBlogOwner");
const blogControllers = require("../controllers/blogControllers");
const User = require("../models/User");

// All Blogs Page
router.get("/blogs", blogControllers.get_all_blogs);
// Show Single Blog
router.get("/blogs/:id", blogControllers.get_blog);
// About Page
router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/profile/:id", async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).render("error", { message: "User not found" });

        // Find all blogs belonging to this user
        const blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 });

        res.render("profile", { user, blogs });
    } catch (err) {
        console.log(err);
        res.status(500).render("error", { message: "Error loading profile" });
    }
})
// Create Blog Page
router.get("/create", requireAuth,(req, res) => {
    res.render("create");
});

router.get("/blogs/:id/edit",
    requireAuth,
    requireBlogOwner,
    (req, res) => {
        res.render("edit", { blog: req.blog });
    }
);

// Update (PUT)
router.put("/blogs/:id",
    requireAuth,
    requireBlogOwner,
    async (req, res) => {
        await req.blog.updateOne(req.body);
        res.redirect(`/blogs/${req.blog._id}`);
    }
);

// Create (POST)
router.post("/blogs", requireAuth, blogControllers.create_blog);

router.delete("/blogs/:id",
    requireAuth,
    requireBlogOwner,
    async (req, res) => {
        await req.blog.deleteOne();
        res.redirect("/blogs");
    }
);


module.exports = router;
