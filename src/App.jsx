
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Attendance from "./pages/Attendance";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Home from "./pages/Home";
import UsersPage from "./pages/UsersPage";
import AdminSchedule from "./pages/AdminNewSchedule";
import FamilyPage from "./pages/FamilyPage";
import AdminNewSchedule from "./pages/AdminNewSchedule";
import EventsPage from './pages/EventsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/events-page'
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/attendance'
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path='/schedule'
          element={
            <ProtectedRoute>
              <AdminNewSchedule />
            </ProtectedRoute>
          }
        />
          {/* <Route
          path='/newschedule'
          element={
            <ProtectedRoute>
              <AdminNewSchedule />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path='/users'
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/family'
          element={
            <ProtectedRoute>
              <FamilyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
