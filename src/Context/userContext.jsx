// import
import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  user: null,
  token: null,
  profile: null,
  resume: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        profile: null,
        resume: null,
      };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload.profile,
      };
    case "SET_RESUME":
      return {
        ...state,
        resume: action.payload.resume,
      };

    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = (user, token) => {
    dispatch({
      type: "LOGIN",
      payload: {
        user,
        token,
      },
    });
  };

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  const getUserState = () => {
    return state;
  };

  const saveProfile = (profile) => {
    dispatch({
      type: "SET_PROFILE",
      payload: {
        profile,
      },
    });
  };

  const saveResume = (resume) => {
    dispatch({
      type: "SET_RESUME",
      payload: {
        resume,
      },
    });
  };

  return (
    <UserContext.Provider
      value={{ login, logout, getUserState, saveProfile, saveResume }}
    >
      {children}
    </UserContext.Provider>
  );
};
