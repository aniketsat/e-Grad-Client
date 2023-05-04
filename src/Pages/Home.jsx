import React from "react";
import Nav from "../Components/Nav";

const Home = () => {
  return (
    <>
      <Nav />
      <div className="container">
        <section
          className="jumbotron"
          style={{
            backgroundColor:
              "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('https://images.unsplash.com/photo-1581093458791-3b1c3b2c2b6e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXIlMjB3b3JsZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            color: "black",
            paddingTop: "20vh",
          }}
        >
          <h1 className="display-4">Welcome to the MERN Stack</h1>
          <p className="lead">
            This is a simple hero unit, a simple jumbotron-style component for
            calling extra attention to featured content or information.
          </p>
          <hr className="my-4" />

          <p>
            It uses utility classes for typography and spacing to space content
            out within the larger container.
          </p>

          <a className="btn btn-outline-dark btn-lg" href="#" role="button">
            Learn more
          </a>
        </section>
      </div>
    </>
  );
};

export default Home;
