const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

// Express app
const app = express();

// Connect to MongoDB database
const dbURI = "mongodb+srv://[REDACTED]@nodetutorial.uyarppy.mongodb.net/nodetut?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// Register ViewEngine
app.set("view engine", "ejs");
// app.set("views", "folder name"); When the views folder isn't called "views"

// Middleware & static files
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("index", {
        title: "Home | Course Caller"
    });
});

app.use((req, res, next) => {
    console.log("Carrying on...");
    next(); // Server continues down the document
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Us | Course Caller"
    });
});


// Blog routes (Replace with course routes when possible)
app.get("/blogs", (req, res) => {
    Blog.find().sort({createdAt: -1})
        .then((result) => {
            res.render("index", {title: "All Blogs", blogs: result})
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/blogs", (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect("/blogs");
        })
        .catch((err) => {
            console.log(err);
        });

});

app.get("/blogs/create", (req, res) => {
    res.render("create", {
        title: "Create New Blog"
    });
});

app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render("details", {blog: result, title: "Blog Details"});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: "/blogs"});
    })
    .catch((err) => {
        console.log(err);
    });
});


// 404 Page
app.use((req, res) => {
    res.status(404).render("404", {
        title: "404 | Course Caller"
    });
}); // Express method set to run on every request. Because it is at the bottom of the document, it will only run if nothing above it runs first.