import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { AuthContext } from '../../context/Context';
import Test from './Test';

function ManagementDashboardWrapper() {

    const { logout } = useContext(AuthContext);

    const [clientList, setClientList] = useState([])

    useEffect( async () => {
        
        let clientArr = []
        await fireStore.collection("users").get().then((snapshot) => {
            snapshot.docs.map((doc) => {
                    if (doc.data().businessName) {
                        clientArr.push(doc.data().businessName)
                    }
                })
                setClientList(clientArr)
            })
    }, [])

    return (
        <div className='managementDashboardWrapper' style={{ marginTop: '3em' }}>
            <div onClick={() => logout()} style={{ cursor: 'pointer', color: '#dddddd', marginLeft: '2em' }}>logout</div>

            {clientList.length ? clientList.map((client, k) => {
                return <div key={k} style={{ marginBottom: '5em' }}>
                    <h1 style={{ color: '#dddddd', margin: '1em' }}>{client}</h1>
                    <Test client={client} />
                    </div>
            }) : null}

        </div>
    )
}

export default ManagementDashboardWrapper;