import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Import statements...

function Bills() {
    const [rows, setRows] = useState([{ Supplier: "", Bill: "", Date: "", Amount: "" }]);
    const navigate = useNavigate();
    const location = useLocation();
    const { Employeer_Id, typ } = location.state || {};
    const userDetailsArray = location.state.userDetails || [];

    const userDetails = Array.isArray(userDetailsArray) ? userDetailsArray[0] : {};

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, { Supplier: "", Bill: "", Date: "", Amount: "" }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isAnyFieldEmpty = rows.some((row) =>
        Object.values(row).some((value) => value === "")
    );

    if (isAnyFieldEmpty) {
        console.log("Please fill in all fields before submitting.");
        return;
    }

        try {
            // let userdetails = [];
            const promises = rows.map(async (row) => {
                const response = await axios.post('http://localhost:8000/submitBill', {
                    ...row,
                    Employeer_Id,
                    typ
                });
                const userDetails = response.data.userDetails;
                if(response.data.success){
                    navigate("/table", { state: { userDetails } });
                }else {
                    console.log("Some submissions failed");
                }
                
                return response.data;
            });

            const results = await Promise.all(promises);

            const success = results.every((result) => result.success);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='bill'>
            <form className='px-3 py-3' onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th>Supplier Name</th>
                            <th>Bill Number</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        value={row.Supplier}
                                        onChange={(e) => handleRowChange(index, 'Supplier', e.target.value)}
                                        style={{ color: 'black' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.Bill}
                                        onChange={(e) => handleRowChange(index, 'Bill', e.target.value)}
                                        style={{ color: 'black' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={row.Date}
                                        onChange={(e) => handleRowChange(index, 'Date', e.target.value)}
                                        style={{ color: 'black' }}
                                        placeholder='DD/MM/YYYY'
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.Amount}
                                        onChange={(e) => handleRowChange(index, 'Amount', e.target.value)}
                                        style={{ color: 'black' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="form-group">
                    <button type="button" onClick={addRow} className='btn btn-info'>
                        Add Row
                    </button>
                </div>
                <div className="form-group">
                    <button className='btn btn-warning'>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default Bills;
