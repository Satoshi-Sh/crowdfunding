import { Navigation } from "./components";
import { Route, Routes } from "react-router-dom";
import { SingleProject, Projects, CreateProject, Signup, Login } from "./pages";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project/:id" element={<SingleProject />} />
      </Routes>
    </div>
  );
}

export default App;
