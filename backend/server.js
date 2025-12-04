const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/signup-db")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

// USER
const UserSchema = new Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

// POSTS
const PostSchema = new Schema({
  username: String,
  content: String,
  likes: { type: Number, default: 0 }
});
const Post = mongoose.model("Post", PostSchema);


// SIGNUP
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });

  await user.save();
  return res.json({ msg: "user created!" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.json({ msg: "no such user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ msg: "incorrect credentials" });

  return res.json({ msg: "logged in", username });
});

// CREATE POST
app.post("/create-post", async (req, res) => {
  const { username, content } = req.body;
  const post = new Post({ username, content });

  await post.save();
  return res.json({ msg: "post created" });
});

// GET ALL POSTS
app.get("/posts", async (req, res) => {
  const posts = await Post.find({});
  return res.json(posts);
});

// LIKE POST
app.post("/like-post/:id", async (req, res) => {
  const id = req.params.id;

  const post = await Post.findById(id);
  if (!post) return res.json({ msg: "post not found" });

  post.likes += 1;
  await post.save();

  return res.json({ msg: "liked!", likes: post.likes });
});


// SERVER
app.listen(5000, () => {
  console.log("server running on PORT 5000");
});
