import React, { useState, useEffect } from 'react'
import './internal.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Card(props) {

  const Employee_Id = props.Employeer_Id;
  const navigate = useNavigate();

  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  

  const openform = ()=>{
    navigate("/bills", { state: {
      Employeer_Name: props.Employeer_Name,
      Department_Name: props.Department_Name,
      Department: props.Department,
      Employeer_Id: props.Employeer_Id,
      FBP_VALUE: props.FBP_VALUE,
      Grade: props.Grade,
      FbpValue: props.FbpValue,
      Pic1: props.Pic1,
      typ: props.typ
    } });
  }

  const viewBills = () => {
    navigate("/view-bills", { state: { Employeer_Id: props.Employeer_Id, typ: props.typ } });
  };
  
  useEffect(() => {
    const fetchFbpValue = async () => {
      try {
        const response = await axios.post('http://localhost:8000/fetchCurrentValue', { Employee_Id });
        const currentFbpValue = response.data.currentFbpValue;
        const currentFbpValue1 = response.data.currentFbpValue1;

        // If FBP value is 0, disable the submit button
        if (currentFbpValue === false) {
          setSubmitDisabled(true);
        }else if(currentFbpValue === true){
          setSubmitDisabled(false);
        }
        
        if (currentFbpValue1 === false) {
          setSubmitDisabled(true);
        }else if(currentFbpValue1 === true){
          setSubmitDisabled(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFbpValue();
  }, [Employee_Id]);

  useEffect(() => {
    // Fetch the currentFbpValue here and update isButtonsDisabled accordingly
    const fetchCurrentFbpValue = async () => {
      try {
        const response = await axios.post('http://localhost:8000/fetchCurrentFbpValue', { Employee_Id });
        const currentFbpValue = response.data.currentFbpValue;
        const currentFbpValue1 = response.data.currentFbpValue1;

        // Update isButtonsDisabled based on the value of currentFbpValue
        setIsButtonsDisabled(currentFbpValue !== null);
        setIsButtonsDisabled(currentFbpValue1 !== null);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentFbpValue();
  }, [Employee_Id]);

  async function handleSubmit1(event) {
    event.preventDefault();
    const buttonValue = event.nativeEvent.submitter.name;

    if (buttonValue === '1') {
      console.log('Button 1 clicked');
      const ans = 1;

      try {
        const response = await axios.post('http://localhost:8000/changePlans', { Employee_Id, ans });
        if (response.data.success) {
          const userDetails = response.data.userDetails;
          console.log(userDetails);
          navigate("/accept", { state: { userDetails } });
        } else {
          console.log("Authentication Failed");
        }
      } catch (error) {
        console.log(error);
      }

    } else if (buttonValue === '2') {
      // Handle submission for Button 2
      console.log('Button 2 clicked');
      const ans = 0;
      try {
        const response = await axios.post('http://localhost:8000/changePlans', { Employee_Id, ans });
        if (response.data.success) {
          const userDetails = response.data.userDetails;
          console.log(userDetails);
          navigate("/reject", { state: { userDetails } });
        } else {
          console.log("Authentication Failed");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (buttonValue === '3') {
      // Handle submission for Button 3
      console.log('Button 3 clicked');
      const ans = 1;
      try {
        const response = await axios.post('http://localhost:8000/changePlansCar', { Employee_Id, ans });
        if (response.data.success) {
          const userDetails = response.data.userDetails;
          console.log(userDetails);
          navigate("/accept", { state: { userDetails } });
        } else {
          console.log("Authentication Failed");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (buttonValue === '4') {
      // Handle submission for Button 4
      console.log('Button 4 clicked');
      const ans = 0;
      try {
        const response = await axios.post('http://localhost:8000/changePlansCar', { Employee_Id, ans });
        if (response.data.success) {
          const userDetails = response.data.userDetails;
          console.log(userDetails);
          navigate("/reject", { state: { userDetails } });
        } else {
          console.log("Authentication Failed");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit1}>
      <div className="card round" style={{ width: "20rem" }}>
        <img src={props.Pic1} className="round" alt="..." />
        <div className="card-body">
          <h5 className="card-title"><strong>Name:</strong> {props.Employeer_Name}</h5>
          <p className="card-text"><strong>Department Name:</strong> {props.Department_Name}</p>
          <p className="card-text"><strong>Designation:</strong> {props.Department}</p>
          <p className="card-text"><strong>Grade:</strong> {props.Grade}</p>
          <p className="card-text"><strong>{`${props.typ !=='CAR' ? 'Clothes' : 'Car'}`} FBP:</strong> Rs.{props.FbpValue}</p>
          <div className='same'>
            <button type='submit' id='button1' className='btn btn-success mx-1' name={props.buttonValues[0]} disabled={isButtonsDisabled}>Accept</button>
            <button type='submit' id='button2' className='btn btn-danger mx-1' name={props.buttonValues[1]} disabled={isButtonsDisabled}>Reject</button>
          </div>
          <button onClick={openform} className='btn btn-warning w-100' disabled={submitDisabled}>Submit Bills</button>
          <button onClick={viewBills} className='btn btn-info w-100 mt-2'>View Bills</button>
        </div>
      </div>
    </form>

  )
}
