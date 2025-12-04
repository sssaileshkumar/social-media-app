import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  const signup = async () => {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.msg);
  };

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.msg);

    if (data.msg === "logged in") {
      setLoggedUser(data.username);
    }
  };

  const createPost = async () => {
    const res = await fetch("http://localhost:5000/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loggedUser, content })
    });
    const data = await res.json();
    alert(data.msg);
    setContent("");
    loadPosts();
  };

  const loadPosts = async () => {
    const res = await fetch("http://localhost:5000/posts");
    const data = await res.json();
    setPosts(data);
  };

  const likePost = async (id) => {
    const res = await fetch(`http://localhost:5000/like-post/${id}`, {
      method: "POST"
    });
    const data = await res.json();
    alert(data.msg);
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Social Media App</h1><br></br>
      <h2>Signup / Login</h2>

      <input placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)} />

      <input placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>

      <hr />

      {loggedUser && (
        <>
          <h2>Create Post (Logged in as {loggedUser})</h2>
          <input
            placeholder="post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={createPost}>Post</button>
        </>
      )}

      <hr />

      <h2>All Posts</h2>
      {posts.map((p) => (
        <div key={p._id} style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
          <p><b>{p.username}</b>: {p.content}</p>
          <button onClick={() => likePost(p._id)}>Like ({p.likes})</button>
        </div>
      ))}
    </div>
  );
}

export default App;
