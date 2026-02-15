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
        const blog = await Blog.findById(req.params.id).populate("author");
        if (!blog) return res.status(404).render("error", { message: "Blog not found 🤔" });

        res.render("show", { blog });
    } catch (err) {
        console.log(err);
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
        console.log("Couldn't save data", err);
    }
};