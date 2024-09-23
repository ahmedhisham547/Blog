const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const BlogPost = require("../models/blog-post");
const User = require("../models/users");
require("dotenv").config();

// Create new blog post
router.post("/create", authenticateToken, async (req, res) => {
  console.log(req.body);
  const newPost = new BlogPost({ ...req.body, username: req.user.username });
  console.log("User creating post:", req.user);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all blog posts
router.get("/get", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.status(200).json(posts);
    console.log(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update post
router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    // Check if the logged-in user is the creator of the post
    if (post.username !== req.user.username) {
      return res.status(403).json("You can only update your own posts");
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete post
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    // Check if the logged-in user is the creator of the post
    if (post.username !== req.user.username) {
      return res.status(403).json("You can only delete your own posts");
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
// Register new user
router.post("/register", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create a new user
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    // Save the user
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json(err);
  }
});

// Login route (find user by username and password)
router.post("/login", async (req, res) => {
  try {
    // Log the request body for debugging
    console.log("Login request body:", req.body);

    // Check if both username and password are provided
    if (!req.body.username || !req.body.password) {
      return res.status(400).json("Username and password are required");
    }

    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Compare password with hashed password howa tl3 by hash mn nfso msh 3arf ezay
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // const validPassword = req.body.password === user.password;
    if (!validPassword) {
      return res.status(400).json("Invalid password");
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { username: user.username }, // Include only relevant user data
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("Login error:", err); // Log any server errors
    res.status(500).json(err);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Auth Header:", authHeader); // Log the Authorization header
  console.log("Token:", token); // Log the extracted token
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("Authenticated User:", user); // Log the authenticated user
    next();
  });
}

module.exports = router;
