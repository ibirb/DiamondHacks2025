// frontend/src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Attempting to login with:", username, password);
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            console.log("Response:", response);
            const data = await response.json();
            console.log("Data:", data);
            if (response.ok) {
                setMessage('Login successful!');
                setUsername('');
                setPassword('');
                // For now, we'll use a hardcoded user ID.
                // In a real app, you'd get this from the backend response.
                const loggedInUserId = data._id; // Assuming the backend sends back the user object with an _id
                onLogin(loggedInUserId); // Pass the user ID to handleLogin
                navigate('/dashboard'); // Redirect to the dashboard
            } else {
                console.log("Login failed:", data.error);
                setMessage(data.error || 'Login failed.');
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setMessage('An error occurred.');
        }
    };

    return (
      <div>
        <div className="login-form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>  
            <div className="form-group">
            <label htmlFor="username">Username:</label> 
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button >
        </form>
        <div>
          <button type="submit" className="sign-up-button">
            Create an Account
          </button>
        </div>
        {message && <div>{message}</div>}
      </div>
      </div>
    );
  }

export default LoginPage;
