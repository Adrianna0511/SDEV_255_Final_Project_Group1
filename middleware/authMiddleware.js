const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'secret token message', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret token message', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Add a course to a user's schedule
const addCourse = (req, res, next) => {
  const token = req.cookies.jwt;
  const id = req.params.id.toString();
  console.log("Course ID: " + id); // temp

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'secret token message', async(err, decodedToken) => {
      let user = await User.findById(decodedToken.id);
      console.log(user); // temp
      if (isNaN(user.courses.indexOf(id))){
        user.courses.push(id); // Add the course ID if it isn't in the array
      } else {
        user.courses.splice(user.courses.indexOf(id), 1); // Remove the course ID if it is in the array
      }
      console.log("Schedule: " + user.courses); // temp
      User.findByIdAndUpdate(user.id, { courses: user.courses })
      .then((result) => {
        next();
      })
      .catch((err) => {
        console.log(err);
      });
    });
  } else {
    res.redirect('/login');
  }
};


module.exports = { requireAuth, checkUser, addCourse };