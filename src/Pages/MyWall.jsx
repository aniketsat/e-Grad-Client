import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import Nav from "../Components/Nav";
import { UserContext } from "../Context/userContext";

const MyWall = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const { getUserState, login, saveProfile, saveResume } =
    useContext(UserContext);

  useEffect(() => {
    if (!getUserState().user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      login(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(getUserState().user);
    }

    if (!getUserState().profile) {
      setProfile(JSON.parse(localStorage.getItem("profile")));
      saveProfile(JSON.parse(localStorage.getItem("profile")));
    } else {
      setProfile(getUserState().profile);
    }

    if (!getUserState().resume) {
      setResume(JSON.parse(localStorage.getItem("resume")));
      saveResume(JSON.parse(localStorage.getItem("resume")));
    } else {
      setResume(getUserState().resume);
    }
  }, []);

  // convert buffer array to image
  const convertBufferToImage = (buffer) => {
    const base64String = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64String;
  };

  const downloadPDF = (buffer) => {
    // convert buffer to base64
    const base64String = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    // create a link
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64String}`;
    link.download = "resume.pdf";
    link.click();

    // remove the link
    link.remove();

    window.open(`data:application/pdf;base64,${base64String}`);
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
          <h1 className="text-center mt-4 mb-4">My Wall</h1>
          <div className="my-wall-container row">
            <div
              className="my-wall-left col-md-4"
              style={{
                display: "flex",
              }}
            >
              <img
                src={`data:image/*;base64,${convertBufferToImage(
                  profile.data.data
                )} `}
                alt=""
                style={{
                  width: "250px",
                  height: "250px",
                  maxWidth: "100%",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderRadius: "50%",
                  margin: "auto",
                }}
              />
            </div>
            <div
              className="my-wall-right col-md-6"
              style={{
                display: "flex",
                margin: "auto",
              }}
            >
              <table
                className="table table-responsive table-hover align-middle"
                style={{
                  margin: "auto",
                  marginTop: "50px",
                  display: "table",
                }}
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{user.name}</td>
                  </tr>
                  <tr>
                    <th>Age</th>
                    <td>{user.age}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <th>SIC</th>
                    <td>{user.sic}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{user.address}</td>
                  </tr>
                  <tr>
                    <th>Branch</th>
                    <td>{user.branch}</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>{user.gender}</td>
                  </tr>
                  <tr>
                    <th>Skills</th>
                    <td>
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="badge bg-secondary text-light"
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </td>
                  </tr>

                  <tr>
                    <th>Resume</th>
                    <td>
                      <input
                        type="button"
                        className="btn btn-primary"
                        value="Download"
                        onClick={() => downloadPDF(resume.data.data)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyWall;
