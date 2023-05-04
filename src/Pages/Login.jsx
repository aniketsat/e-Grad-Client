import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/userContext";

const Login = () => {
  const [sic, setSic] = useState("");
  const [password, setPassword] = useState("");

  const { login, saveProfile, saveResume } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    console.log(sic, password);

    // check if theuy are empty
    if (!sic || !password) {
      alert("Please fill all the fields");
      return;
    }

    // check if the password is less than 6 characters
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const loginUser = async () => {
      try {
        const response = await axios.post(
          "https://egrad-server.onrender.com/api/users/login",
          {
            sic,
            password,
          }
        );

        console.log(response.data);
        if (response.data.success) {
          login(response.data.user, response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("token", response.data.token);

          // Fetch the profile and resume
          const profileResponse = await axios.get(
            "https://egrad-server.onrender.com/api/users/profile",
            {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
              },
            }
          );
          console.log(profileResponse.data);
          saveProfile(profileResponse.data.profile);

          const resumeResponse = await axios.get(
            "https://egrad-server.onrender.com/api/users/resume",
            {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
              },
            }
          );
          console.log(resumeResponse.data);
          saveResume(resumeResponse.data.resume);

          localStorage.setItem(
            "profile",
            JSON.stringify(profileResponse.data.profile)
          );
          localStorage.setItem(
            "resume",
            JSON.stringify(resumeResponse.data.resume)
          );

          navigate("/mywall");
        }
      } catch (err) {
        console.error(err);
        console.error(err.response.data);
        alert(err.response.data.message);
      }
    };

    loginUser();
  };
  return (
    <div className="container ">
      <h1 className="text-center mt-4 mb-4">Login</h1>
      <div className="form-container">
        <form onSubmit={handleLoginSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="sic">SIC</label>
                <input
                  type="text"
                  className="form-control"
                  id="sic"
                  name="sic"
                  placeholder="SIC"
                  value={sic}
                  onChange={(e) => setSic(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            className="row"
            style={{
              width: "100%",
              margin: "0 auto",
            }}
          >
            <button type="submit" className="btn btn-outline-success mb-2">
              Login
            </button>

            <button type="reset" className="btn btn-outline-danger mb-2">
              Reset
            </button>
          </div>

          <div className="row text-center mt-2">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
