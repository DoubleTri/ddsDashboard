import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { AuthContext } from '../../context/Context';

import Hatting from '../newHatting/Hatting';

function ProgressBoard(props) {

    const [allNonHfaPosts, setAllNonHfaPosts] = useState(null)
    const [allPosts, setAllPosts] = useState(null)

    const { dbKey } = useContext(AuthContext);

    useEffect(async () => {
       
        if (dbKey) {

            let allPostsTemp = []

            await fireStore.collection("users").doc(dbKey).collection('orgBoard').where('employee.uid', '==', props.employee.uid).where('employee.hfa', '==', false).onSnapshot((snapshot) => {
                snapshot.docs.forEach((doc, i) => {
                    allPostsTemp.push(doc.data())
                })
                fireStore.collection("users").doc(dbKey).collection('orgBoard').where('multiEmployeeArr', 'array-contains', {name: props.employee.name, uid: props.employee.uid}).get().then((snap) => {
                    snap.docs.forEach((doc, i) => {
                        allPostsTemp.push(doc.data());
                    })
                    setAllPosts(allPostsTemp)
                })
            })
        }
    }, [dbKey, props])

    return (
        <div className='progressBoard'>



            <div style={{ textAlign: 'center' }}><b>{props.employee.name}: </b></div>
            { allPosts ? <div>
                    {/* <div style={{ textAlign: 'center' }}>{ post.post }</div> */}
                    <Hatting allPosts={allPosts} dbKey={dbKey} userInfo={props.employee} from='progressBoard' /> 
                        < hr />
                    </div>
            : <div style={{ margin: '5em', textAlign: 'center' }}><h3 style={{ color: '#dddddd' }}>No posts are assigned to {props.employee.name}</h3></div>}

        </div>
    )
}

export default ProgressBoard;