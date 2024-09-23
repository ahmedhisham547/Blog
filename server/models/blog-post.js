const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: String,
  body: String,
  username: {
    type: String,
    required: true, // Associate the post with the username of the creator
  },
  categories: [String],
  // comments: [
  //   {
  //     user: String,
  //     comment: String,
  //     date: { type: Date, default: Date.now },
  //   },
  // ],
  // date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
