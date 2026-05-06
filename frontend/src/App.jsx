import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import TeamManagement from './pages/TeamManagement';
import Profile from './pages/Profile';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects/create" element={<RoleBasedRoute role="ADMIN"><CreateProject /></RoleBasedRoute>} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/create" element={<RoleBasedRoute role="ADMIN"><CreateTask /></RoleBasedRoute>} />
        <Route path="/team" element={<RoleBasedRoute role="ADMIN"><TeamManagement /></RoleBasedRoute>} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
