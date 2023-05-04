import { createContext, useReducer } from "react";

export const ResultContext = createContext();

const initialState = {
  category: "",
  status: "",
  score: 0,
  percentage: 0,
  allQuestions: [],
  answers: [],
  totalQuestions: 0,
  attempted: 0,
};

const resultReducer = (state, action) => {
  switch (action.type) {
    case "SET_RESULT":
      return {
        ...state,
        category: action.payload.category,
        status: action.payload.status,
        score: action.payload.score,
        percentage: action.payload.percentage,
        allQuestions: action.payload.allQuestions,
        answers: action.payload.answers,
        totalQuestions: action.payload.totalQuestions,
        attempted: action.payload.attempted,
      };

    case "RESET_RESULT":
      return {
        ...state,
        category: "",
        status: "",
        score: 0,
        percentage: 0,
        allQuestions: [],
        answers: [],
        totalQuestions: 0,
        attempted: 0,
      };

    default:
      return state;
  }
};

export const ResultContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resultReducer, initialState);

  const resetResult = () => {
    dispatch({
      type: "RESET_RESULT",
    });
  };

  const setResult = (x) => {
    dispatch({
      type: "SET_RESULT",
      payload: {
        category: x.category,
        status: x.status,
        score: x.score,
        percentage: x.percentage,
        allQuestions: x.allQuestions,
        answers: x.answers,
        totalQuestions: x.totalQuestions,
        attempted: x.attempted,
      },
    });
  };

  return (
    <ResultContext.Provider
      value={{
        resultState: state,
        setResult,
        resetResult,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};
