import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Lectures from './pages/Lectures';
import CreateLecture from './pages/CreateLecture';
import LectureDetails from './pages/LectureDetails';
import DashboardLayout from './components/DashboardLayout';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Optional: Redirect root "/" to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes (Nested inside DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/create" element={<CreateLecture />} />
          <Route path="/lectures/:id" element={<LectureDetails />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;