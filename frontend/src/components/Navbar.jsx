import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthToken, setAuthToken } from '../api/api';

const Navbar = () => {
  const token = getAuthToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link to="/tasks">Task Manager</Link>
      </div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/tasks" className="hover:underline">Tasks</Link>
            <Link to="/insights" className="hover:underline">Insights</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
