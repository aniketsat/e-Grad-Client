import React, { useContext } from "react";
import { ResultContext } from "../Context/resultContext";
import { useNavigate } from "react-router-dom";

const ResultPage = () => {
  const { resultState } = useContext(ResultContext);
  console.log(resultState);

  const navigate = useNavigate();

  return (
    <>
      {resultState.category === "" ? (
        <>
          <h1 className="container text-center mb-4 mt-4">Result</h1>
          <hr />
          <div className="container text-center">
            <h2>Please attempt the exam first</h2>
            <button
              className="btn btn-outline-dark"
              style={{
                width: "fit-content",
                height: "50px",
                fontSize: "20px",
                padding: "10px",
              }}
              onClick={() => navigate("/eExam")}
            >
              Attempt Exam
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="container text-center mb-4 mt-4">Result</h1>
          <hr />
          {resultState.status == "pass" ? (
            <div>
              <h2 className="container text-center">
                Congratulations! You have passed the exam
              </h2>
              <h3 className="container text-center">
                Your score is: {parseFloat(resultState.percentage).toFixed(2)}%
              </h3>

              <h4 className="container text-center">
                {console.log(resultState.attempted)}
                Attempted Questions: {resultState.attempted}{" "}
              </h4>

              <h4 className="container">Correct Answers</h4>
              <div className="container">
                {resultState.allQuestions.map((question, idx) => (
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
                            checked={
                              option == resultState.answers[question._id]
                            }
                            disabled
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    </div>
                    <hr
                      style={{
                        backgroundColor:
                          question.correctAnswer ==
                          resultState.answers[question._id]
                            ? "green"
                            : "red",

                        height: 2.5,
                      }}
                    />
                    <div className="correct-answer">
                      <p
                        style={{
                          color:
                            question.correctAnswer ==
                            resultState.answers[question._id]
                              ? "green"
                              : "red",
                        }}
                      >
                        Correct Answer: {question.correctAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="container text-center mt-4 mb-4">
                <button
                  className="btn btn-outline-dark"
                  style={{
                    width: "fit-content",
                    height: "50px",
                    fontSize: "20px",
                    padding: "10px",
                  }}
                  onClick={() => {
                    navigate("/eExam");
                  }}
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="container text-center">
                Congratulations! You have passed the exam
              </h2>
              <h3 className="container text-center">
                Your score is: {parseFloat(resultState.percentage).toFixed(2)}%
              </h3>

              <h4 className="container text-center">
                {console.log(resultState.attempted)}
                Attempted Questions: {resultState.attempted}{" "}
              </h4>

              <div className="container text-center mt-4 mb-4">
                <button
                  className="btn btn-outline-dark"
                  style={{
                    width: "fit-content",
                    height: "50px",
                    fontSize: "20px",
                    padding: "10px",
                  }}
                  onClick={() => {
                    navigate("/eExam");
                  }}
                >
                  Reattempt
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ResultPage;
