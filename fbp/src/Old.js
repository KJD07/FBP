import React, { useState } from 'react'
import './Tilcard.css'
import Tilt from 'react-parallax-tilt';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import dog from './dog.webp';

export default function Old() {
    const [employeeID, setEmployeeID] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // function handleSubmit(event){
    //     event.preventDefault();
    //     axios.post('http://localhost:8000/saveUser', {employeeID, password})
    //     .then(function redirect(){
    //         navigate("/plans");
    //     })
    //     .catch(err => console.log(err))
    // }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/saveUser', { employeeID, password });
            if (response.data.success) {
                const userDetails = response.data.userDetails;
                console.log(userDetails);
                navigate("/table", {state: {userDetails}});
            } else {
                console.log("Authentication Failed");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Tilt>
            <div className='box'>
                <div className='elements name'>
                    <h1><strong>Login Page</strong></h1>
                </div>
                {/* <Tilt> */}
                <div className='elements banner'>
                    <a href='https://portfolio-website07.vercel.app/'><img src={dog} /></a>
                </div>
                {/* </Tilt> */}
                <Tilt>
                    <div className='tiltcard'>
                        <div className='elements content'>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="fullName" className="form-label"><strong>Employee ID</strong></label>
                                <input type="text" onChange={e => setEmployeeID(e.target.value)} />

                                <label htmlFor="fullName" className="form-label"><strong>Password</strong></label>
                                <input type="password" onChange={e => setPassword(e.target.value)} /><br></br>
                                <button>Login</button>
                            </form>

                        </div>
                    </div>
                </Tilt>
            </div>
        </Tilt>
    )
}
