import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { AuthContext } from '../../context/Context';

import Hatting from './Hatting';

function HattingWrapper(props) {

    const [allNonHfaPosts, setAllNonHfaPosts] = useState(null)
    const [multiEmployeePosts, setMultiEmployeePosts] = useState(null)

    const { dbKey, userInfo, currentUser } = useContext(AuthContext);

    useEffect(async () => {
       
        if (dbKey && userInfo) {
            let allNonHfaPostsTemp = []
            fireStore.collection("users").doc(dbKey).collection('orgBoard').where('employee.uid', '==', userInfo.uid).where('employee.hfa', '==', false).onSnapshot((snapshot) => {
                snapshot.docs.forEach((doc, i) => {
                    allNonHfaPostsTemp.push(doc.data())
                })
                setAllNonHfaPosts(allNonHfaPostsTemp)
            })
            let multiEmployeePostsTemp = []
            fireStore.collection("users").doc(dbKey).collection('orgBoard').where('multiEmployeeArr', 'array-contains', {name: userInfo.name, uid: userInfo.uid}).get().then((snap) => {
                snap.docs.forEach((doc, i) => {
                    multiEmployeePostsTemp.push(doc.data());
                })
                setMultiEmployeePosts(multiEmployeePostsTemp)
            })
        }
    }, [dbKey, userInfo])

    return (
        <div className='hattingWrapper'>

            {!allNonHfaPosts && !multiEmployeePosts ? <div style={{ margin: '5em' }}><h3 style={props.from !== 'homePage' ? { color: '#dddddd' } : null}>No posts are assigned to {currentUser.displayName}</h3></div> : <div>

                {(allNonHfaPosts && allNonHfaPosts.length) ? allNonHfaPosts.map((post, i) => {
                    return <Hatting key={i} nonHfaPost={post} dbKey={dbKey} userInfo={userInfo} from={props.from} />
                }) : null}

                {multiEmployeePosts && multiEmployeePosts.length ? multiEmployeePosts.map((post, i) => {
                    return <Hatting key={i} nonHfaPost={post} dbKey={dbKey} userInfo={userInfo} from={props.from} />
                }) : null}

            </div>}

        </div>
    )
}

export default HattingWrapper;

