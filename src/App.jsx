import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Attendance from "./pages/Attendance";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Home from "./pages/Home";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
