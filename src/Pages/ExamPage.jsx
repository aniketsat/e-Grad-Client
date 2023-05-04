import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./style.css";
import Nav from "../Components/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ResultContext } from "../Context/resultContext";

const ExamPage = () => {
  const { category } = useParams();

  const [questions, setQuestions] = useState([]);

  const [totalTime, setTotalTime] = useState(0);

  const [answers, setAnswers] = useState({});

  const navigate = useNavigate();

  const { setResult } = useContext(ResultContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://egrad-server.onrender.com/api/questions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data);

        // set questions according to category
        const categoryQuestions = res.data.data.filter(
          (question) => question.category === category
        );
        setQuestions(categoryQuestions);

        // set total time
        const totalTime = categoryQuestions.reduce(
          (totalTime, question) => totalTime + question.timeToAnswer,
          0
        );
        setTotalTime(totalTime);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(totalTime - 1);

      if (totalTime === 0) {
        clearInterval(interval);
        displayAnswers();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [totalTime]);

  // set padding to time
  const pad = (time) => {
    return time.toString().padStart(2, "0");
  };

  const displayAnswers = () => {
    console.log(answers);

    let score = 0;

    questions.forEach((question) => {
      if (question.correctAnswer === answers[question._id]) {
        console.log("correct");
        score += 1;
      } else {
        console.log("incorrect");
      }
    });

    console.log(score);

    const x = {
      category: category,
      status: score / questions.length >= 0.7 ? "pass" : "fail",
      score: score,
      percentage: (score / questions.length) * 100,
      allQuestions: questions,
      answers: answers,
      totalQuestions: questions.length,
      attempted: Object.keys(answers).length,
    };

    setResult(x);

    navigate("/result");
  };

  return (
    <>
      <Nav />
      <div className="container timer">
        Time Left:{" "}
        <span className="hour">{pad(parseInt(totalTime / 3600))}</span>
        {":"}
        <span className="hour">{pad(parseInt((totalTime % 3600) / 60))}</span>
        {":"}
        <span className="hour">{pad(parseInt((totalTime % 3600) % 60))}</span>
      </div>
      <div className="container text-center">
        <h3>{category}</h3>
        <div className="questions">
          {questions.map((question, idx) => (
            <div key={idx} className="question">
              <div className="question-text">
                <p>Question {idx + 1}</p>
                <p>{question.question}</p>
              </div>
              <div className="question-options">
                {question.answerOptions.map((option, idx2) => (
                  <div key={idx2} className="question-option">
                    <input
                      type="radio"
                      name={question._id}
                      id={option}
                      onChange={(e) => {
                        setAnswers({
                          ...answers,
                          [question._id]: option,
                        });
                      }}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container exam-submit-button">
        <button className="btn btn-outline-dark" onClick={displayAnswers}>
          Submit
        </button>
      </div>
    </>
  );
};

export default ExamPage;
