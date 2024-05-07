import React, { useState,  useEffect } from 'react';
import './internal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [HRM, setHRM] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setHRM('');
    setPassword('');
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/loginAdmin', { HRM, Password });
      if (response.data.success) {
        // Store authentication token or flag in local storage
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/admintable');
      } else {
        console.log('Authentication Failed');
        setHRM('');
        setPassword('');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bill">
      <form className="px-3 py-3" onSubmit={handleSubmit}>
        <div className="form-group py-2">
          <h1>
            <strong>LOGIN</strong>
          </h1>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">HRM ID</label>
          <input type="text" className="form-control" placeholder="HRM Id" onChange={(e) => setHRM(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Password</label>
          <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <button className="btn btn-warning">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Admin;
