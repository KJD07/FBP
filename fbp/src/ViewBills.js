import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './internal.css'

export default function ViewBills() {
    const location = useLocation();
    const Employeer_Id = location.state ? location.state.Employeer_Id : null;
    const typ = location.state ? location.state.typ : null;
    const [submittedBills, setSubmittedBills] = useState([]);
    const [acceptedBills, setAcceptedBills] = useState([]);
    const [rejectedBills, setRejectedBills] = useState([]);
    const [selectedTab, setSelectedTab] = useState('submitted');

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const responseSubmitted = await axios.post('http://localhost:8000/getSubmittedBills', { Employeer_Id,typ });
                setSubmittedBills(responseSubmitted.data.submittedBills);

                const responseAccepted = await axios.post('http://localhost:8000/getAcceptedBills', { Employeer_Id,typ });
                setAcceptedBills(responseAccepted.data.acceptedBills);

                const responseRejected = await axios.post('http://localhost:8000/getRejectedBills', { Employeer_Id,typ });
                setRejectedBills(responseRejected.data.rejectedBills);
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };

        fetchBills();
    }, [Employeer_Id]);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const renderBills = () => {
        const renderTable = (bills) => (
            <div style={{ textAlign: 'center' }}>
            <table className='bill1'>
                <thead>
                    <tr>
                        <th>Bill Number</th>
                        <th>Supplier Name</th>
                        <th>Date</th>
                        <th>Amount</th>
                        {/* Add other columns here based on your hbill table */}
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill) => (
                        <tr key={bill.bill_number}>
                            <td>{bill.bill_number}</td>
                            <td>{bill.supplier_name}</td>
                            <td>{bill.date}</td>
                            <td>{bill.amount}</td>
                            {/* Add other columns here based on your hbill table */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        );

        switch (selectedTab) {
            case 'submitted':
                return renderTable(submittedBills);
            case 'accepted':
                return renderTable(acceptedBills);
            case 'rejected':
                return renderTable(rejectedBills);
            default:
                return null;
        }
    };


    return (
        <div>
            <h2 style={{color: 'white'}}>View Bills</h2>

            <div>
                <button className='btn btn-warning' style={{ marginRight: '10px' }} onClick={() => handleTabClick('submitted')}>Submitted Bills</button>
                <button className='btn btn-warning' style={{ marginRight: '10px' }} onClick={() => handleTabClick('accepted')}>Accepted Bills</button>
                <button className='btn btn-warning' style={{ marginRight: '10px' }} onClick={() => handleTabClick('rejected')}>Rejected Bills</button>
            </div>

            <div>
                {renderBills()}
            </div>
        </div>
    );
}
