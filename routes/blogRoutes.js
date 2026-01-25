const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const requireAuth = require("../middlewares/requireAuth");
const requireBlogOwner = require("../middlewares/requireBlogOwner");

// All Blogs Page
router.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render("blogs", { blogs });
    } catch (err) {
        console.log(err);
        res.status(404).render("error", { message: "Blogs not found, refresh again 🤔" });
    }
});

// Show Single Blog
router.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author");
        if (!blog) return res.status(404).render("error", { message: "Blog not found 🤔" });

        res.render("show", { blog });
    } catch (err) {
        console.log(err);
        res.status(404).render("error", { message: "Blog not found 🤔" });
    }
});

// About Page
router.get("/about", (req, res) => {
    res.render("about");
});

// Create Blog Page
router.get("/create", requireAuth,(req, res) => {
    res.render("create");
});

// Edit Page
// router.get("/blogs/:id/edit", requireAuth,requireBlogOwner ,async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) return res.status(404).render("error", { message: "Blog not found" });

//         res.render("edit", { blog });
//     } catch (err) {
//         console.log(err);
//     }
// });
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
router.post("/blogs", requireAuth,async (req, res) => {
    try {
        await Blog.create({
            ...req.body,
            author: req.session.userId
        });
        res.redirect("/blogs");
    } catch (err) {
        console.log("Couldn't save data", err);
    }
});

// Delete
// router.delete("/blogs/:id", requireAuth, requireBlogOwner,async (req, res) => {
//     try {
//         await Blog.findByIdAndDelete(req.params.id);
//         res.redirect("/blogs");
//     } catch (err) {
//         res.status(500).send("Error deleting the blog");
//     }
// });
router.delete("/blogs/:id",
    requireAuth,
    requireBlogOwner,
    async (req, res) => {
        await req.blog.deleteOne();
        res.redirect("/blogs");
    }
);


module.exports = router;
