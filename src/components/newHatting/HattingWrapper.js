import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { AuthContext } from '../../context/Context';

import Hatting from './Hatting';

function HattingWrapper(props) {

    const [allNonHfaPosts, setAllNonHfaPosts] = useState(null)
    const [multiEmployeePosts, setMultiEmployeePosts] = useState(null)

    const [allPosts, setAllPosts] = useState(null)

    const { dbKey, userInfo, currentUser } = useContext(AuthContext);

    useEffect(async () => {
        console.log(props.from);
        if (dbKey && userInfo) {
            
            let allPostsTemp = []

            await fireStore.collection("users").doc(dbKey).collection('orgBoard').where('employee.uid', '==', userInfo.uid).where('employee.hfa', '==', false).onSnapshot((snapshot) => {
                snapshot.docs.forEach((doc, i) => {
                    allPostsTemp.push(doc.data())
                })
                fireStore.collection("users").doc(dbKey).collection('orgBoard').where('multiEmployeeArr', 'array-contains', {name: userInfo.name, uid: userInfo.uid}).get().then((snap) => {
                    snap.docs.forEach((doc, i) => {
                        allPostsTemp.push(doc.data());
                    })
                    setAllPosts(allPostsTemp)
                    console.log(allPostsTemp);
                })
            })
        }
    }, [dbKey, userInfo])

    return (
        <div className='hattingWrapper'>

            { allPosts ? <Hatting allPosts={allPosts} dbKey={dbKey} userInfo={userInfo} from={props.from} /> : null }

        </div>
    )
}

export default HattingWrapper;

