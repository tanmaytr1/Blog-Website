const Blog = require("../models/Blog");

module.exports.get_all_blogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render("blogs", { blogs });
    } catch (err) {
        console.log(err);
        res.status(404).render("error", { message: "Blogs not found, refresh again 🤔" });
    }
};

module.exports.get_blog = async (req, res) => {
    try {
        // This populates the Blog author AND the author of every comment
        const blog = await Blog.findById(req.params.id)
            .populate("author")
            .populate("comments.author"); 

        if (!blog) return res.status(404).render("error", { message: "Blog not found 🤔" });

        res.render("show", { blog });
    } catch (err) {
        res.status(404).render("error", { message: "Blog not found 🤔" });
    }
}

module.exports.create_blog = async (req, res) => {
    try {
        await Blog.create({
            ...req.body,
            author: req.session.userId
        });
        res.redirect("/blogs");
    } catch (err) {
        res.status(500).render("error", { message: "Failed to create the blog" });;
    }
};

module.exports.make_comment = async (req, res) => {
    try {
        // 1. Find the blog (No need to populate comments here, they are part of the doc)
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) return res.status(404).render("error", { message: "Blog not found" });

        // 2. Create the comment object
        const newComment = {
            body: req.body.body,
            author: req.session.userId 
        };

        // 3. Push and Save
        blog.comments.push(newComment);
        await blog.save();

        // 4. Redirect back to the show page
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.status(500).render("error", { message: "Failed to add comment" });
    }
};