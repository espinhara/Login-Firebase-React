import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import SignUp from './SignUp';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
);

export default App;
