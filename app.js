const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Course = require("./models/course");

// Express app
const app = express();

// Connect to MongoDB database
const dbURI = "mongodb+srv://aheath44:FinalProject1@courses.qkd3m54.mongodb.net/test";
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

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Log In | Course Caller"
    });
});

// Course Routes
app.get("/courses", (req, res) => {
    Course.find().sort({courseID: -1})
        .then((result) => {
            res.render("courses", {title: "Courses | Course Caller", courses: result})
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/courses", (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then((result) => {
            res.redirect("/courses");
        })
        .catch((err) => {
            console.log(err);
        });

});

// The following pages are not complete yet
app.get("/courses/create", (req, res) => {
    res.render("create", {
        title: "Create New Course"
    });
});

app.get("/courses/:id", (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            res.render("details", {course: result, title: "Course Details"});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete("/courses/:id", (req, res) => {
    const id = req.params.id;
    Course.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: "/courses"});
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
});