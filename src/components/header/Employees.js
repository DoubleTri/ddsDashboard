import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/Context';

import {
    PlusCircleOutlined
  } from '@ant-design/icons';

import DragEmployee from '../orgBoard/DragEmployee';

function Employees(props) {

    const [employeeArr, setEmployeeArr] = useState(null)

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {
        let employeeTempArr = []
        if (dbKey) {
            fireStore.collection("users").doc(dbKey).collection('employees').get().then((res) => {
                res.forEach((employee) => {
                    employeeTempArr.push(employee.data());
                })
            }).then(() => {
                setEmployeeArr(employeeTempArr)
            })
        }
    }, [dbKey])
    
    return (
        <div className="Employees">

            <p> <b>Employees</b> <Link className='linkText' to='/add-employee' onClick={props.onClose}><PlusCircleOutlined /></Link></p>

            {employeeArr ?
                employeeArr.map((item, i) => {
                    if (item.id !== 'kiosk') {
                        return <div key={i}>
                            <DragEmployee
                                item={item}
                                onClose={props.onClose}
                                admin={true}
                                dbKey={dbKey}
                            />
                        </div>
                    }
                })
                : 'loading...'}

        </div>
    );
}

export default Employees; 

