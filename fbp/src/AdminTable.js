import './internal.css'
import React, { useState } from 'react'
import './Tilcard.css'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTable() {

  const navigate = useNavigate();
  const location = useLocation();

  const cellStyle = {
    padding: '10px',
    border: 'none', // No border
  }; 

  async function handleSubmit1(index, event) {
    try {
      const response = await axios.post('http://localhost:8000/listClothes');
      console.log('List Clothes response:', response.data);
      if (response.data.success) {
        const userDetails = response.data.userDetails;
        console.log(userDetails);
        if (userDetails.length === 0) {
          navigate("/data", { state: { message: "No Bills remaining" } });
        } else {
          navigate("/data", { state: { userDetails } });
        }
      } else {
        console.log("List Clothes request failed:", response.data.msg);
        navigate("/data", { state: { message: "No Bills remaining" } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit2(index, event) {
    try {
      const response = await axios.post('http://localhost:8000/listCar');
      console.log('List Car response:', response.data);
      if (response.data.success) {
        const userDetails = response.data.userDetails;
        console.log(userDetails);
        if (userDetails.length === 0) {
          navigate("/data", { state: { message: "No Bills remaining" } });
        } else {
          navigate("/data", { state: { userDetails } });
        }
      } else {
        console.log("List Car request failed:", response.data.msg);
        navigate("/data", { state: { message: "No Bills remaining" } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <table style={{ borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px' }}>
      <tbody>
        <tr className='flex'>
          <td style={cellStyle} className='tdtext'><strong>Clothes</strong></td>
          <td style={cellStyle}><button className='btn btn-warning btn-sm' onClick={handleSubmit1}>Get List</button></td>
        </tr>
        <tr>
          <td style={cellStyle} className='tdtext'><strong>Car</strong></td>
          <td style={cellStyle}><button className='btn btn-warning btn-sm' onClick={handleSubmit2}>Get List</button></td>
        </tr>
      </tbody>
    </table>
  );
}

export default AdminTable
