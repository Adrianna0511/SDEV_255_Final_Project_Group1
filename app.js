const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Course = require("./models/course");
const User = require("./models/User");
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, addCourse } = require('./middleware/authMiddleware');


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
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('*', checkUser);
app.get("/", (req, res) => {
    res.render("index", {
        title: "Home"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Us"
    });
});

app.use(authRoutes);

app.get("/schedule", requireAuth,(req, res) => {
    Course.find().sort({courseID: -1})
        .then((result) => {
            res.render("schedule", {title: "Your Schedule", courses: result})
        })
        .catch((err) => {
            console.log(err);
        });
});

// Course Routes
app.get("/courses", (req, res) => {
    Course.find().sort({courseID: -1})
        .then((result) => {
            res.render("courses", {title: "Courses", courses: result})
        })
        .catch((err) => {
            console.log(err);
        });
});

// Create new course
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

// Update existing course
app.post("/courses/:id", (req, res) => {
    const id = req.params.id;
    const course = req.body;
    Course.findByIdAndUpdate(id, course)
    .then((result) => {
        res.redirect("/courses/" + id);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Add a course to a user account
app.put("/courses/:id", requireAuth, addCourse, (req, res) => {
    const id = req.params.id;
    res.json({redirect: "/courses"});
})

app.get("/courses/create", requireAuth, (req, res) => {
    res.render("create", {
        title: "Create New Course"
    });
});

app.get("/courses/update/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            res.render("update", {course: result, title: "Edit Course"});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/courses/:id", (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            res.render("details", {course: result, title: "View Course"});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete("/courses/:id", requireAuth, (req, res) => {
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



