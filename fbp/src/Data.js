import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './internal.css';

function Data() {
  const navigate = useNavigate();
  const location = useLocation();
  // const userDetails = location.state.userDetails || [];
  const message = location.state.message || null;

  const [userDetails, setUserDetails] = useState(location.state.userDetails || []);
  const [uniqueEmployeeIds, setUniqueEmployeeIds] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [disabledRows, setDisabledRows] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState([]);
  const [checkedAccept, setCheckedAccept] = useState([]);
  const [checkedReject, setCheckedReject] = useState([]);
  const [customAmounts, setCustomAmounts] = useState(Array(userDetails.length).fill(''));
  const [remainingBills, setRemainingBills] = useState(userDetails.length);


  useEffect(() => {
    // Extract unique employee IDs
    const uniqueIds = [...new Set(userDetails.map((user) => user.employeer_id))];
    setUniqueEmployeeIds(uniqueIds);

    // Initialize disabledRows, approvalStatus, checkedAccept, and checkedReject based on the initial data
    const initialDisabledRows = Array(userDetails.length).fill(false);
    setDisabledRows(initialDisabledRows);

    const initialApprovalStatus = userDetails.map((user) => user.approved || null);
    setApprovalStatus(initialApprovalStatus);

    const initialCheckedAccept = Array(userDetails.length).fill(false);
    setCheckedAccept(initialCheckedAccept);

    const initialCheckedReject = Array(userDetails.length).fill(false);
    setCheckedReject(initialCheckedReject);
  }, [userDetails]);

  const handleCheckboxChange = (index, action, isChecked) => {
    if (action === 'ACCEPT') {
      setCheckedAccept((prevChecked) => {
        const newChecked = [...prevChecked];
        newChecked[index] = isChecked;
        // Uncheck the corresponding Reject checkbox if Accept is checked
        if (isChecked) {
          newChecked[index] = true;
          setCheckedReject((prevCheckedReject) => {
            const newCheckedReject = [...prevCheckedReject];
            newCheckedReject[index] = false;
            return newCheckedReject;
          });
        }
        return newChecked;
      });
    } else if (action === 'REJECT') {
      setCheckedReject((prevChecked) => {
        const newChecked = [...prevChecked];
        newChecked[index] = isChecked;
        // Uncheck the corresponding Accept checkbox if Reject is checked
        if (isChecked) {
          newChecked[index] = true;
          setCheckedAccept((prevCheckedAccept) => {
            const newCheckedAccept = [...prevCheckedAccept];
            newCheckedAccept[index] = false;
            return newCheckedAccept;
          });
        }
        return newChecked;
      });
    }
  };

  const handleSelectAllAccept = () => {
    const updatedCheckedAccept = [...checkedAccept];
    const updatedCheckedReject = [...checkedReject];
  
    userDetails.forEach((user, index) => {
      if (user.employeer_id === selectedEmployee && user.approved === null) {
        updatedCheckedAccept[index] = true;
        updatedCheckedReject[index] = false;
      }
    });
  
    setCheckedAccept(updatedCheckedAccept);
    setCheckedReject(updatedCheckedReject);
  };
  
  const handleSelectAllReject = () => {
    const updatedCheckedAccept = [...checkedAccept];
    const updatedCheckedReject = [...checkedReject];
  
    userDetails.forEach((user, index) => {
      if (user.employeer_id === selectedEmployee && user.approved === null) {
        updatedCheckedAccept[index] = false;
        updatedCheckedReject[index] = true;
      }
    });
  
    setCheckedAccept(updatedCheckedAccept);
    setCheckedReject(updatedCheckedReject);
  };  

  const fetchUpdatedBills = async () => {
    try {
      const updatedUserDetails = [];
      // Iterate over all unique employee IDs
      for (const employeeId of uniqueEmployeeIds) {
        // Make a request to fetch updated bills for each employee
        const response = await axios.post('http://localhost:8000/fetchUpdatedBills', {
          Employeer_Id: employeeId,
          fbp: userDetails.find(user => user.employeer_id === employeeId).fbp
        });
  
        if (response.data.success) {
          // Add the updated bills for this employee to the array
          updatedUserDetails.push(...response.data.userDetails);
        } else {
          console.error('Failed to fetch updated bills for employee ID:', employeeId);
        }
      }
      // Update the state with the updated list of bills for all employees
      setUserDetails(updatedUserDetails);
    } catch (error) {
      console.error('Error fetching updated bills:', error);
    }
  };
  
  

  const handleButtonClick = async () => {
    try {
      for (let i = 0; i < userDetails.length; i++) {
        const amountToSubmit = customAmounts[i] !== '' ? customAmounts[i] : userDetails[i].amount; // Use custom amount if provided, else use the pre-given amount
        if (checkedAccept[i]) {
          await updateApprovalStatus(i, 'ACCEPT', amountToSubmit);
        } else if (checkedReject[i]) {
          await updateApprovalStatus(i, 'REJECT', amountToSubmit);
        }
      }
      await fetchUpdatedBills();
      setRemainingBills(0);
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const handleCombinedButtonClick = async () => {
    try {
      await handleButtonClick(); // Call the existing function
      await sendEmail(); // Call the new email sending function
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendEmail = async () => {
    try {
      // Make an HTTP POST request to your backend endpoint
      const response = await axios.post('http://localhost:8000/sendEmail', {
        recipient: 'kanan07linkedin@gmail.com', // Change this to the actual recipient email address
        subject: 'Approval Status Update',
        body: 'The approval status has been updated for the bills.',
      });
      console.log('Email sent:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const updateApprovalStatus = async (index, action, amount) => {
    // Make your API call to update the 'approved' column in the backend
    try {
      const response = await axios.post('http://localhost:8000/updateApprovalStatus', {
        Bill: userDetails[index].bill_number,
        action: action === 'ACCEPT' ? 1 : 0,
        amount: amount
      });

      // Update the approvalStatus state and disable the buttons in the same row
      setApprovalStatus((prevApprovalStatus) => {
        const newApprovalStatus = [...prevApprovalStatus];
        newApprovalStatus[index] = response.data.approved;
        return newApprovalStatus;
      });

      setDisabledRows((prevDisabledRows) => {
        const newDisabledRows = [...prevDisabledRows];
        newDisabledRows[index] = true;
        return newDisabledRows;
      });
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const handleViewBills = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const handleAmountChange = (index, amount) => {
    const newCustomAmounts = [...customAmounts];
    newCustomAmounts[index] = amount;
    setCustomAmounts(newCustomAmounts);
  };

  return (
    <div className="center-container">
      {message && (
        <h1 style={{ backgroundColor: 'white', padding: '10px' }}>{message}</h1>
      )}
      {userDetails.length > 0 && (
        <table className="borderless-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {uniqueEmployeeIds.map((employeeId, index) => (
              <tr key={index}>
                <td style={{ color: 'black', padding: '30px' }}>{employeeId}</td>
                <td style={{ color: 'black', padding: '30px' }}>
                  <button onClick={() => handleViewBills(employeeId)} className="btn btn-info">View Bills</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEmployee && (
        <div className='seperated'>
          <h3 style={{ color: 'white' }}>Details for Employee ID: {selectedEmployee}</h3>
          <table className="borderless-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Accept</th>
                <th>Reject</th>
                <th>Amount Pass</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((user, index) => (
                user.approved === null && user.employeer_id === selectedEmployee && (
                  <tr key={index}>
                    <td style={{ color: 'black', padding: '30px' }}>{user.supplier_name}</td>
                    <td style={{ color: 'black', padding: '30px' }}>{user.bill_number}</td>
                    <td style={{ color: 'black', padding: '30px' }}>{user.date}</td>
                    <td style={{ color: 'black', padding: '30px' }}>{user.amount}</td>
                    <td style={{ color: 'black', padding: '10px', width: '60px' }}>
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheckboxChange(index, 'ACCEPT', e.target.checked)}
                          checked={checkedAccept[index]}
                          disabled={disabledRows[index]}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td style={{ color: 'white', padding: '10px', width: '60px' }}>
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheckboxChange(index, 'REJECT', e.target.checked)}
                          checked={checkedReject[index]}
                          disabled={disabledRows[index]}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td style={{ color: 'black', padding: '10px' }}>
                      <input
                        type="number"
                        value={customAmounts[index]}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        style={{ width: '80px' }}
                        disabled={disabledRows[index]}
                      />
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          <button onClick={handleCombinedButtonClick} className="btn btn-warning">Submit</button>
          <button onClick={handleSelectAllAccept} className="btn btn-warning" style={{marginLeft: '20px'}}>Accept All</button>
          <button onClick={handleSelectAllReject} className="btn btn-warning" style={{marginLeft: '20px'}}>Reject All</button>
        </div>
      )}
    </div>
  );
}

export default Data;
