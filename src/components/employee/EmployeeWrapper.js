import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router'; 
import firebase from 'firebase/app';
import { fireStore } from '../../firebase';
import { Form, Input, Switch, Button, message } from 'antd';

import EditEmployeeForm from './EditEmployeeForm';
import { AuthContext } from '../../context/Context';


function EmployeeWrapper(props) {

    const [employee, setEmployee] = useState(null)
    const [editMode, setEditMode] = useState(false)

    const { dbKey, userInfo } = useContext(AuthContext);

    useEffect(() => {
        if (dbKey) {
            fireStore.collection("users").doc(dbKey).collection('employees').doc(props.match.params.uid).onSnapshot((snap) => {
                if (snap.data()) {
                    setEmployee(snap.data())
                } else {
                    props.history.push('/org-board')
                }
            })
        }
    }, [dbKey])

    return (
        <div className='employeeWrapper'>
            {!editMode ? <div>
                <div style={{ textAlign: 'center', marginTop: '3em', marginBottom: '1em' }}><h1 style={{ color: '#dddddd' }}>{employee && employee.name ? employee.name : null}</h1></div>
                <div onClick={() => setEditMode(true)}>edit</div>
            </div>
                : <EditEmployeeForm employee={employee} setEditMode={setEditMode} userInfo={userInfo} />}
        </div>
    )
}

export default withRouter(EmployeeWrapper);