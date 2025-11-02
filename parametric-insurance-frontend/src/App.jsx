import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Web3Provider>
      <Router>
        <div className="App">
          {!isLoggedIn ? (
            <Login onLogin={handleLogin} />
          ) : (
            <>
              <Navbar onLogout={handleLogout} userRole={userRole} />
              <main className="main-content">
                <Dashboard userRole={userRole} onLogout={handleLogout} />
              </main>
            </>
          )}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;