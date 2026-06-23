import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminTaskList from './pages/AdminTaskList';
import AdminTaskForm from './pages/AdminTaskForm';
import AdminInternList from './pages/AdminInternList';
import InternDashboard from './pages/InternDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tasks" element={<AdminTaskList />} />
        <Route path="/admin/tasks/new" element={<AdminTaskForm />} />
        <Route path="/admin/interns" element={<AdminInternList />} />
        <Route path="/intern/:id" element={<InternDashboard />} />
      </Routes>
    </div>
  );
}
