import { Navigation } from "./components";
import { Route, Routes } from "react-router-dom";
import { Projects, Fundriser, Signup, Login } from "./pages";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/fundrisers" element={<Fundriser />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
