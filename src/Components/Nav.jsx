import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/userContext";

const Nav = () => {
  const [user, setUser] = useState(null);
  const { getUserState, login, logout } = useContext(UserContext);

  useEffect(() => {
    if (!getUserState().user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      login(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(getUserState().user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    localStorage.removeItem("resume");

    logout();

    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand nav-heading">
          e-Grad Portal
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/mywall"
                className="nav-link active nav-subheading"
                aria-current="page"
              >
                My Wall
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/eExam"
                className="nav-link active nav-subheading"
                aria-current="page"
              >
                e-Exam
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/openforum"
                className="nav-link active nav-subheading"
                aria-current="page"
              >
                Open Forum
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/eRepo"
                state={{
                  path: "/",
                }}
                className="nav-link active nav-subheading"
                aria-current="page"
                href="#"
              >
                e-Repo
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            {!user ? (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="nav-link active nav-subheading"
                    aria-current="page"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="nav-link active nav-subheading"
                    aria-current="page"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <button
                    className="nav-link active nav-subheading"
                    aria-current="page"
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
