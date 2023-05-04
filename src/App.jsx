import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MyWall from "./Pages/MyWall";
import ERepo from "./Pages/ERepo";
import OpenForum from "./Pages/OpenForum";
import EExam from "./Pages/EExam";
import ExamPage from "./Pages/ExamPage";
import ResultPage from "./Pages/ResultPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mywall" element={<MyWall />} />
        <Route path="/eRepo" element={<ERepo />} />
        <Route path="/eExam" element={<EExam />} />
        <Route path="/eExam/:category" element={<ExamPage />} />
        <Route path="/openforum" element={<OpenForum />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
