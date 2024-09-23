import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./createPost";
import { BsFillTrashFill } from "react-icons/bs";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false); // To toggle login form
  const [showSignupForm, setShowSignupForm] = useState(false); // To toggle signup form
  const [username, setUsername] = useState(""); // For login/signup form
  const [password, setPassword] = useState(""); // For login/signup form
  const [loggedIn, setLoggedIn] = useState(false); // Track if user is logged in
  const [authToken, setAuthToken] = useState(null); // Store JWT token

  useEffect(() => {
    const fetchPosts = () => {
      axios
        .get("http://localhost:5001/api/blog/get")
        .then((result) => setPosts(result.data))
        .catch((err) => console.log(err));
    };
    fetchPosts();
  }, []);

  const handleEditSubmit = (id) => {
    console.log(authToken);
    axios
      .put(
        "http://localhost:5001/api/blog/update/" + id,
        {
          title: editTitle,
          body: editBody,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }, // Include token
        }
      )
      .then((result) => {
        console.log(result);
        setEditPostId(null);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    console.log(authToken);
    axios
      .delete("http://localhost:5001/api/blog/delete/" + id, {
        headers: { Authorization: `Bearer ${authToken}` }, // Include token
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Login
  const handleLogin = () => {
    console.log("Attempting login with:", { username, password });

    axios
      .post("http://localhost:5001/api/blog/login", { username, password })
      .then((result) => {
        console.log("Login successful:", result.data);
        setLoggedIn(true);
        setAuthToken(result.data.accessToken); // Store token
        console.log(authToken);
        console.log(result.data.accessToken);
        setShowLoginForm(false); // Hide login form
      })
      .catch((err) => {
        console.error(
          "Login error:",
          err.response ? err.response.data : err.message
        );
      });
  };

  // Handle Signup
  const handleSignup = () => {
    axios
      .post("http://localhost:5001/api/blog/register", { username, password })
      .then((result) => {
        console.log("Signup successful:", result.data);
        setShowSignupForm(false); // Hide signup form
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <CreatePost authToken={authToken} />
      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPosts.map((post) => (
          <div key={post._id}>
            {editPostId === post._id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="New Title"
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  placeholder="New Body"
                />
                <button onClick={() => handleEditSubmit(post._id)}>Save</button>
                <button onClick={() => setEditPostId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>{post.title}</h2>
                <h3>{post.username}</h3>
                <p>{post.body}</p>
                <div>
                  {loggedIn && (
                    <>
                      <button
                        onClick={() => {
                          setEditPostId(post._id);
                          setEditTitle(post.title);
                          setEditBody(post.body);
                        }}
                      >
                        Edit
                      </button>
                      <BsFillTrashFill
                        className="icon"
                        onClick={() => handleDelete(post._id)}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Login/Signup Toggle */}
      {!loggedIn && (
        <div>
          <button onClick={() => setShowLoginForm(!showLoginForm)}>
            {showLoginForm ? "Cancel Login" : "Login"}
          </button>
          <button onClick={() => setShowSignupForm(!showSignupForm)}>
            {showSignupForm ? "Cancel Signup" : "Sign Up"}
          </button>
        </div>
      )}

      {/* Login Form */}
      {showLoginForm && (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {/* Signup Form */}
      {showSignupForm && (
        <div>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      )}

      {/* Logout */}
      {loggedIn && (
        <div>
          <button
            onClick={() => {
              setLoggedIn(false);
              setAuthToken(null);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
