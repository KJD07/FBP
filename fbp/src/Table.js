import './internal.css'; // Import your CSS file for styling
import React, { useState, useEffect } from 'react'
import './Tilcard.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import dog from './dog.webp';


function Table() {

    const [employeeID, setEmployeeID] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = location.state.userDetails || [];

    const filteredUserDetails = userDetails.filter(user => (user.typ === "FBP" || user.typ === "CAR") && user.fbp_val !== 0);

    // async function handleSubmit1(event) {
    //     event.preventDefault();
    //     try {
    //         navigate("/plans", {state: {userDetails}});
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async function handleSubmit2(event) {
    //     event.preventDefault();
    //     try {
    //         navigate("/plans", {state: {userDetails}});
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async function handleButtonClick(index,event) {
        // event.preventDefault();
        try {
            navigate("/plans", { state: { userDetails: [filteredUserDetails[index]] } });
            localStorage.setItem("userDetails", JSON.stringify(filteredUserDetails[index]));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="center-container bill">
            <table>
                <thead>
                    <tr>
                        <th>Master</th>
                        <th>Plans</th>
                    </tr>
                </thead>
                <tbody>
                {filteredUserDetails.map((user, index) => (
                        <tr key={index}>
                            <td style={{ color: 'black', padding: '30px' }}>
                                <strong>{user.typ === "FBP" ? "Clothes FBP" : "Car FBP"}</strong>
                            </td>
                            <td style={{ padding: '30px' }}>
                                <button className="btn btn-warning" onClick={() => handleButtonClick(index)}>Button {index + 1}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
