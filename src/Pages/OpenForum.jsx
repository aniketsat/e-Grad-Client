import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import Nav from "../Components/Nav";
import { UserContext } from "../Context/userContext";
import axios from "axios";

const OpenForum = () => {
  const [user, setUser] = useState(null);
  const { getUserState, login } = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  const [replies, setReplies] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!getUserState().user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      login(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(getUserState().user);
    }
  }, []);

  useEffect(() => {
    const fetchPostsAndReplies = async () => {
      try {
        let res = await axios.get(
          "https://egrad-server.onrender.com/api/posts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(res.data);
        setPosts(res.data.data);

        res = await axios.get("https://egrad-server.onrender.com/api/replies", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(res.data);
        setReplies(res.data.data);

        setTitle("");
        setDescription("");
        setReply("");
      } catch (err) {
        console.log(err);
        setPosts([]);
        setReplies([]);
        alert("Something went wrong");
      }
    };

    fetchPostsAndReplies();
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      return alert("Please fill all the fields");
    }

    const res = await axios.post(
      "https://egrad-server.onrender.com/api/posts",
      {
        title,
        description,
        user: user._id,
        username: user.name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(res.data.data);
    setPosts([res.data.data, ...posts]);

    setTitle("");
    setDescription("");
  };

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(
        `https://egrad-server.onrender.com/api/posts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.log(err);
      if (err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const handleAddReply = async (postId) => {
    if (!reply) {
      return alert("Please fill all the fields");
    }

    try {
      const res = await axios.post(
        "https://egrad-server.onrender.com/api/replies",
        {
          reply,
          user: user._id,
          username: user.name,
          post: postId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data.data);
      setReplies([res.data.data, ...replies]);

      setReply("");
    } catch (err) {
      console.log(err);
      if (err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const deleteReply = async (replyId) => {
    try {
      const res = await axios.delete(
        `https://egrad-server.onrender.com/api/replies/${replyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data);
      setReplies(replies.filter((reply) => reply._id !== replyId));
    } catch (err) {
      console.log(err);
      if (err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <>
      <Nav />
      {!user ? (
        <div className="container">You need to login to view this page</div>
      ) : (
        <div
          className="container"
          style={{
            marginBottom: "100px",
          }}
        >
          <div
            className="forum-form container card"
            style={{
              marginTop: "20px",
            }}
          >
            <h3 className="text-center mt-2 mb-2">Create a new Post</h3>
            <form
              action=""
              style={{
                padding: "20px",
              }}
              onSubmit={handleAddPost}
            >
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-outline-success">
                Submit
              </button>
            </form>
          </div>
          <div className="container">
            {posts.map((post) => (
              <div
                key={post._id}
                className="card"
                style={{
                  marginTop: "20px",
                }}
              >
                <div className="card-body">
                  <div
                    className="card-head"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h5 className="card-title">{post.title}</h5>
                    <div className="forum-button-group">
                      <button onClick={() => deletePost(post._id)}>
                        <i className="fa-sharp fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <p className="card-text">{post.description}</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      Posted By : <b>{post.username}</b>
                    </span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="container">
                    <hr />
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        id="reply"
                        rows="2"
                        placeholder="Enter Reply"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      ></textarea>
                      <button
                        type="submit"
                        className="btn btn-ouyotline-success mt-2"
                        onClick={() => handleAddReply(post._id)}
                      >
                        Reply
                      </button>
                    </div>
                    <h5 className="mt-3">Replies</h5>
                    {replies.map((reply) =>
                      reply.post === post._id ? (
                        <div
                          key={reply._id}
                          className="card"
                          style={{
                            marginBottom: "8px",
                            padding: "5px 10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p className="card-text">{reply.reply}</p>
                            <div className="forum-button-group">
                              <button onClick={() => deleteReply(reply._id)}>
                                <i className="fa-sharp fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>
                              Replied By : <b>{reply.username}</b>
                            </span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OpenForum;
