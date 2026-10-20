import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import TodoApp from './components/TodoApp';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <nav style={{ padding: '15px', background: '#282c34', color: '#fff', marginBottom: '20px' }}>
        <span style={{ fontWeight: 'bold', marginRight: '20px' }}>To-Do App</span>
        {token ? (
          <>
            <Link to="/todos" style={{ color: '#61dafb', marginRight: '15px' }}>Todos</Link>
            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#61dafb', marginRight: '15px' }}>Login</Link>
            <Link to="/signup" style={{ color: '#61dafb' }}>Signup</Link>
          </>
        )}
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/todos"
            element={token ? <TodoApp token={token} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={token ? "/todos" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}
