const express = require("express");
const router = express.Router();
const User = require("../src/models/User");
const authorization = require("../src/middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


router.get("/home", (req, res) => {
  res.render("home");
});
 
router.get("/signup", async (req, res) => {
  var token = req.cookies.authorization;
 
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) console.log(err);
      else req.user = user;
      // console.log(user);
      // res.render("signup", { user: user, found: finduser });
      res.redirect("/user/home");
    });
  }
   else res.render("signup", { user: req.user});
});
//
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    user = await User.findOne({ name });
    if (user) return res.status(400).send({ error: "Username already exists" });

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    
    user = new User({
      email: email,
      password: password,
      name: name,
      date: today,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    console.log("user registered");
    res.redirect("/user/login");
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.get("/login", (req, res) => {
  var token = req.cookies.authorization;
 
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) console.log(err);
      else req.user = user;
      // console.log(user);
      // res.render("login", { user: user, found: finduser });
      res.redirect("/user/home");
    });
  }
   else res.render("login", { user: req.user});
  // res.render("login");
});


router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("User with email doesnt exist");
    return;
  }
  const checkPassword = await bcrypt.compare(req.body.password, user.password);
  if (!checkPassword) {
    console.log("password doesnt match");
    res.redirect("/user/login");
    return;
  }
  const token = jwt.sign(//sign stands for  signature, basically token creates a unique id by use of name ,email
    // unique id, and save it personally, bt when we sign up next time this token compare with the saved cookies token
    // in browser , and then redirect.
    {
      name: user.name,
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  res.cookie("authorization", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
  });
  console.log("user logged in");
  res.redirect("/user/home");
});

//get route for logging out user
router.get("/logout", function (req, res) {
  res.clearCookie("authorization");
  console.log("You are successfully logged out");
  res.redirect("/");
});

//Export
module.exports = router;
