import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sic, setSic] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState("");
  const [resume, setResume] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all the fields are filled
    if (
      !name ||
      !email ||
      !sic ||
      !age ||
      !address ||
      !branch ||
      !gender ||
      !skills.length ||
      !profile ||
      !resume ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all the fields");
      return;
    }

    // Check if password and confirm password are same
    if (password !== confirmPassword) {
      alert("Password and confirm password should be same");
      return;
    }

    // Check if password is of minimum 6 characters
    if (password.length < 6) {
      alert("Password should be of minimum 6 characters");
      return;
    }

    // Check if age is between 18 and 60
    if (age < 18 || age > 60) {
      alert("Age should be between 18 and 60");
      return;
    }

    // Check if SIC is of 8 characters
    if (sic.length !== 8) {
      alert("SIC should be of 8 characters");
      return;
    }

    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email is not valid");
      return;
    }

    // Check if skills are selected
    if (!skills.length) {
      alert("Please select skills");
      return;
    }

    console.log({
      name,
      email,
      sic,
      age,
      address,
      branch,
      gender,
      skills,
      profile,
      resume,
      password,
      confirmPassword,
    });

    const registerUser = async () => {
      try {
        const res = await axios.post(
          "https://egrad-server.onrender.com/api/users/register",
          {
            name,
            email,
            sic,
            age,
            address,
            branch,
            gender,
            skills,
            password,
          }
        );

        console.log(res.data);

        if (res.data.success) {
          const profileFormData = new FormData();
          profileFormData.append("profile", profile);
          profileFormData.append("user", res.data._id);
          // save the profile and resume in the database
          const profileRes = await axios.post(
            "https://egrad-server.onrender.com/api/users/profile",
            profileFormData
          );

          console.log(profileRes.data);

          if (profileRes.data.success) {
            const resumeFormData = new FormData();
            resumeFormData.append("resume", resume);
            resumeFormData.append("user", res.data._id);
            const resumeRes = await axios.post(
              "https://egrad-server.onrender.com/api/users/resume",
              resumeFormData
            );

            console.log(resumeRes.data);

            if (resumeRes.data.success) {
              alert("User registered successfully");
              navigate("/login");
            } else {
              alert("Something went wrong");
            }
          } else {
            alert("Something went wrong");
          }
        } else {
          alert("Something went wrong");
        }
      } catch (err) {
        console.log(err);

        if (err.message === "Network Error") {
          alert("Server is not running");
          return;
        }
        if (err.response.data.success === false) {
          alert(err.response.data.message);
          return;
        }
        alert("Something went wrong");
      }
    };
    registerUser();
  };

  return (
    <div className="container ">
      <h1 className="text-center mt-4 mb-4">Register</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  name="age"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="Address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="branch">Branch</label>
              <div className="form-group">
                <select
                  className="form-select"
                  id="branch"
                  name="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map((b) => (
                    <option id={b} key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="gender">Gender</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="male"
                  checked={gender === "Male" ? true : false}
                  onChange={(e) => setGender("Male")}
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="female"
                  checked={gender === "Female" ? true : false}
                  onChange={(e) => setGender("Female")}
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <label htmlFor="skills">Skills</label>
              <div>
                {["C", "C++", "Java", "Python", "JavaScript"].map((skill) => (
                  <div className="form-check form-check-inline" key={skill}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={skill}
                      value={skill}
                      checked={skills.includes(skill) ? true : false}
                      onChange={(e) => {
                        if (skills.includes(skill)) {
                          setSkills(skills.filter((s) => s !== skill));
                        } else {
                          setSkills([...skills, skill]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={skill}>
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="profile">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="profile"
                  name="profile"
                  onChange={(e) => {
                    setProfile(e.target.files[0]);
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="resume">Resume</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="form-control"
                  id="resume"
                  name="resume"
                  onChange={(e) => {
                    setResume(e.target.files[0]);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              Register
            </button>

            <button type="reset" className="btn btn-outline-danger mb-2">
              Reset
            </button>
          </div>

          <div className="row text-center mt-2">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
