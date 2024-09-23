import React, { useState } from "react";
import axios from "axios";

const CreatePost = ({ authToken }) => {
  // Accept the authToken as a prop
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = { title, body };
    console.log(post);

    axios
      .post("http://localhost:5001/api/blog/create", post, {
        headers: { Authorization: `Bearer ${authToken}` }, // Include the token in the headers
      })
      .then((result) => {
        console.log(result);
        // Optionally clear the input fields after successful submission
        setTitle("");
        setBody("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
      ></textarea>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
