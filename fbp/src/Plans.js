import React from 'react'
import Card from './Card'
import Pic1 from './Developer.jpg'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Plans() {
    const location = useLocation();
    const userDetails = location.state.userDetails || [];
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="justify-content-center">
          {userDetails.map((user, index) => (
            user.fbp_val !==0 && (<div key={index} className= "col-md-4 my-4 mb-3 mx-5">
              <Card
                Employeer_Name={user.EMP_NM}
                Department_Name={user.DEPT_NM}
                Department={user.DESIG_nM}
                Employeer_Id={user.EMP_CD}
                FBP_VALUE={user.FBP_VALUE}
                Grade={user.grade}
                FbpValue={user.fbp_val}
                Pic1={Pic1}
                typ={user.typ}
                buttonValues={[index * 2 + 1, index * 2 + 2]}
              />
            </div>
            )
          ))}
        </div>
        </div>
      );

}
