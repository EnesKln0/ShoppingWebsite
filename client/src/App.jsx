import { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ToggleDarkMode from "./components/ToggleDarkMode.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import SingleItem from "./components/SingleItem.jsx";
import SearchedItems from "./components/SearchedItems.jsx";
function App() {
  const renderCount = useRef(0); // Create a ref to store the number of renders
  useEffect(() => {
    renderCount.current += 1; // Increment the render count
    console.log(`Render Count of APP Component: ${renderCount.current}`); // Log the current render count
  });

  return (
    <>
      <ToggleDarkMode />
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/items/:id" element={<SingleItem />} />
        <Route path="/search" element={<SearchedItems />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
