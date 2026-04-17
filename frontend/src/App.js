import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Lectures from './pages/Lectures';
import CreateLecture from './pages/CreateLecture';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Wrapped Routes */}
        <Route path="/dashboard" element={
          <DashboardLayout>
            <h1>Welcome back, Administrator</h1>
            <p>Overview of institutional academic scheduling...</p>
          </DashboardLayout>
        } />

        <Route path="/lectures" element={
          <DashboardLayout>
            <Lectures />
          </DashboardLayout>
        } />
        
        <Route path="/lectures/create" element={
          <DashboardLayout>
            <CreateLecture />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;