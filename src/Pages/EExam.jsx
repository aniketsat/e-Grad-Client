import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import Nav from "../Components/Nav";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import { Link } from "react-router-dom";

const EExam = () => {
  const [user, setUser] = useState(null);
  const { getUserState, login } = useContext(UserContext);

  const [questions, setQuestions] = useState([]);
  const [questionCategories, setQuestionCategories] = useState([]);

  useEffect(() => {
    if (!getUserState().user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      login(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(getUserState().user);
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("https://egrad-server.onrender.com/api/questions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res.data);

        setQuestions(res.data.data);
        // add distinct categories to questionCategories
        const categories = res.data.data.map((question) => question.category);
        const distinctCategories = [...new Set(categories)];
        setQuestionCategories(distinctCategories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <>
      <Nav />
      {!user ? (
        <div className="container">You need to login to view this page</div>
      ) : (
        <div className="container text-center">
          <h1>e-Exam Portal</h1>
          <div>
            <h6>Select any of the following subjects to appear the exam</h6>
            {questionCategories.map((category) => (
              <div key={category} className="category-card">
                <div className="category-card-title">{category}</div>
                <div className="category-card-questions">
                  No. of Questions:{" "}
                  {
                    questions.filter(
                      (question) => question.category === category
                    ).length
                  }
                </div>
                <div className="category-card-time">
                  Time:{" "}
                  {questions
                    .filter((question) => question.category === category)
                    .reduce(
                      (acc, question) => acc + question.timeToAnswer,
                      0
                    )}{" "}
                  seconds
                </div>
                <Link
                  to={`/eExam/${category}`}
                  className="category-card-button"
                >
                  Appear
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default EExam;
