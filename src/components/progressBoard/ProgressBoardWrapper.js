import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { AuthContext } from '../../context/Context';

import Hatting from '../hatting/Hatting';
import ProgressBoard from './ProgressBoard';

function ProgressBoardWrapper(props) {

    const [allEmployees, setAllEmployees] = useState(null)

    const { dbKey, userInfo, currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (dbKey) {
            let allEmployeeTemp = []
            fireStore.collection("users").doc(dbKey).collection('employees').get().then((snapshot) => {
                snapshot.forEach((employee) => {
                    if (employee.data().id !== 'kiosk') {
                        allEmployeeTemp.push(employee.data())
                    }
                })
                setAllEmployees(allEmployeeTemp)
            })
        }
    }, [dbKey])

    return (
        <div className='progressBoardWrapper' style={{ color: '#DDDDDD', marginTop: '3em' }}>
            {allEmployees ? allEmployees.map((employee) => {
                return <div>
                    <ProgressBoard employee={employee} />
                </div>
                //return console.log(employee.name);
            }) : null}
        </div>
    )
}

export default ProgressBoardWrapper;