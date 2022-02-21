import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { DropTarget } from 'react-dnd';

import { AuthContext } from '../../context/Context';

import HatsSource from './HatsSource'
import hatUpdate from '../../functions/hatUpdate'
import EmployeeDnDTarget from './EmployeeDnDTarget';
import findHeldFromAboveOLD from '../../functions/findHeldFromAboveOLD'

const update = require('immutability-helper');

const collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem(),
        didDrop: monitor.didDrop()
    }
}


const movedUpWithinDept = async (dept, node, newIndex, dbKey) => {
    var batch = fireStore.batch();
    console.log('moved up');
    await batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(node.id), {
        position: newIndex
    })
    fireStore.collection("users").doc(dbKey).collection('orgBoard')
        .where("childOf", "==", dept.id).where("position", ">=", newIndex).where("position", "<", node.position).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().id !== node.id)
                    batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(doc.data().id), {
                        position: doc.data().position + 1 
                    })
            })
        }).then(() => {
            batch.commit().catch((error) => { console.log(error) })
        }).then(async() => {
            let nonHfaFromDb = []
            await fireStore.collection("users").doc(dbKey).collection('orgBoard')
                .where("employee.hfa", "==", false).get().then((res) => {
                    res.forEach((post) => {
                        nonHfaFromDb.push(post.data())
                    })
                })
            nonHfaFromDb.forEach((nonHfaPost) => { 
                findHeldFromAboveOLD(nonHfaPost, dbKey).then((res) => {
                    res.forEach((post) => {
                        let batchTwo = fireStore.batch();
                        if (post.id !== nonHfaPost.id && !post.isExect) {
                            console.log(post);
                            batchTwo.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(post.id), {
                                'employee': {
                                    name: nonHfaPost.employee.name,
                                    hfa: true,
                                    hfaAt: { post: nonHfaPost.post, uid: nonHfaPost.id },
                                    uid: nonHfaPost.employee.uid
                                }
                            })
                        }
                        console.log('batch fired');
                        batchTwo.commit().catch((error) => { console.log(error) })
                    })
                })
            })
        })
}

const movedDownWithinDept = async (dept, node, newIndex, dbKey) => {
    console.log('moved down');
    var batch = fireStore.batch();
    await batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(node.id), {
        position: newIndex
    })
    fireStore.collection("users").doc(dbKey).collection('orgBoard')
        .where("childOf", "==", dept.id).where("position", ">", node.position).where("position", "<=", newIndex).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().id !== node.id)
                    batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(doc.data().id), {
                        position: doc.data().position - 1
                    })
            })
        }).then(async() => {
            batch.commit().catch((error) => { console.log('BATCH ERROR!!', error.message) })
        }).then(async() => {
            let nonHfaFromDb = []
            await fireStore.collection("users").doc(dbKey).collection('orgBoard')
                .where("employee.hfa", "==", false).get().then((res) => {
                    res.forEach((post) => {
                        nonHfaFromDb.push(post.data())
                    })
                })
            nonHfaFromDb.forEach((nonHfaPost) => { 
                findHeldFromAboveOLD(nonHfaPost, dbKey).then((res) => {
                    res.forEach((post) => {
                        let batchTwo = fireStore.batch();
                        if (post.id !== nonHfaPost.id && !post.isExect) {
                            console.log(post);
                            batchTwo.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(post.id), {
                                'employee': {
                                    name: nonHfaPost.employee.name,
                                    hfa: true,
                                    hfaAt: { post: nonHfaPost.post, uid: nonHfaPost.id },
                                    uid: nonHfaPost.employee.uid
                                }
                            })
                        }
                        console.log('batch fired');
                        batchTwo.commit().catch((error) => { console.log(error) })
                    })
                })
            })
        })
}

const handleOtherPostsInDept = (dept, node, dbKey) => {

    var batch = fireStore.batch();
    fireStore.collection("users").doc(dbKey).collection('orgBoard')
        .where("childOf", "==", node.childOf).where("position", ">", node.position).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(doc.data().id), {
                    position: doc.data().position - 1
                })
            })
        }).then(() => {
            batch.commit().catch((error) => { console.log('BATCH ERROR!!', error.message) })
        }).then(async() => {
            let nonHfaFromDb = []
            await fireStore.collection("users").doc(dbKey).collection('orgBoard')
                .where("employee.hfa", "==", false).get().then((res) => {
                    res.forEach((post) => {
                        nonHfaFromDb.push(post.data())
                    })
                })
            nonHfaFromDb.forEach((nonHfaPost) => { 
                findHeldFromAboveOLD(nonHfaPost, dbKey).then((res) => {
                    res.forEach((post) => {
                        let batchTwo = fireStore.batch();
                        if (post.id !== nonHfaPost.id && !post.isExect) {
                            console.log(post);
                            batchTwo.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(post.id), {
                                'employee': {
                                    name: nonHfaPost.employee.name,
                                    hfa: true,
                                    hfaAt: { post: nonHfaPost.post, uid: nonHfaPost.id },
                                    uid: nonHfaPost.employee.uid
                                }
                            })
                        }
                        console.log('batch fired');
                        batchTwo.commit().catch((error) => { console.log(error) })
                    })
                })
            })
        })
}

const hfaPosting = (node, dbKey) => {
    console.log('HFA POSTING FIRED!!', node);
    console.log('FIRE FIND HFA FUNCTION');
    var batch = fireStore.batch();
    let idArr = []
    fireStore.collection("users").doc(dbKey).collection('orgBoard').where('employee', '!=', null).get().then((snapshot) => {
        idArr = []
        snapshot.forEach((doc) => findHeldFromAboveOLD(doc.data(), dbKey).then((res) => {
            res.forEach((post) => {
                if (!post.employee) {
                    idArr.push(post.id)
                }
            })
        }).then(() => {
            idArr.forEach((id) => {
                // console.log(id);
                // batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(id), {
                //     'employee': {
                //         name: employeeObj.name,
                //         hfa: true,
                //         hfaAt: props.hat.type,
                //         uid: employeeObj.uid
                //     }
                // })
            })
        }).then(() => {
            //batch.commit().catch((error) => { console.log(error) })
        })
        )
    });


    // if (node.position === 0) {
    //     // get employee of the dept
    //     fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(node.childOf).get().then((snapshot) => {
    //             hatUpdate(node, snapshot.data().employee, dbKey); 
    //     })
    // } else {
    //     // get the employee in the position above (node.position -1)
    //     fireStore.collection("users").doc(dbKey).collection('orgBoard')
    //     .where("childOf", "==", node.childOf).where("position", "==", node.position-1).get().then((snapshot) => {
    //             hatUpdate(node, snapshot.docs[0].data().employee, dbKey);
    //     })
    // }

}

const targetSpec = {
    drop(props, monitor) {
 
//props.setDeptLoading(props.node.id)

            if (monitor.getItemType() === 'card') {
                console.log('POST DROP!!!!', props.node.id, monitor.getItem().hat.hat.childOf);
// IF props.node.id IS DIFFERENT THEN CURRENT props.node.id, THE POST HAS MOVED DEPARTMENTS
                if (props.node.id !== monitor.getItem().hat.hat.childOf) {
                    handleOtherPostsInDept(props.node, monitor.getItem().hat.hat, props.dbKey)  // MAKE SURE THE POSTS LEFT IN A DEPT (if a post has left a dept) ARE READJUSTED CORRECTLY 
                    if (monitor.getItem().hat.hat.employee && !monitor.getItem().hat.hat.employee.hfa) {
                        findHeldFromAboveOLD(monitor.getItem().hat.hat, props.dbKey) 
                    }
                    fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(monitor.getItem().id).update({
                        childOf: props.node.id,
                        position: props.node.hats.length
                    })
                } else {
                    console.log('SAME!!!!!');
// IF props.node.id IS THE SAME, ONLY NEED CHANGE POSITION --- AND POSITION OF OTHER POSTS IN DIVISION BELOW IT
                    if (monitor.getItem().index < monitor.getItem().hat.hat.position) {
                        movedUpWithinDept(props.node, monitor.getItem().hat.hat, monitor.getItem().index, props.dbKey)
                    } else {
                        movedDownWithinDept(props.node, monitor.getItem().hat.hat, monitor.getItem().index, props.dbKey)
                    }
                }

// NEW POST ADDED TO A DEPT

            } else if (monitor.getItemType() === 'hat') {
                console.log('NEW POST ADDED', monitor.getItem());

                let thisHat = monitor.getItem().item
                
                // get the post above it to find it's employee
                fireStore.collection("users").doc(props.dbKey).collection('orgBoard').where('childOf', '==', props.node.id).where('position', '==', props.node.hats.length-1).get().then((snap) => {
                    if(snap.docs[0] && snap.docs[0].data() && snap.docs[0].data().employee) {
                        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(thisHat.id).update({
                            childOf: props.node.id,
                            position: props.node.hats.length,
                            employee: {
                                name: snap.docs[0].data().employee.name,
                                hfa: true,
                                hfaAt: snap.docs[0].data().employee.hfaAt,
                                uid: snap.docs[0].data().employee.uid
                            }
                        })
                    } else {
                        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(thisHat.id).update({
                            childOf: props.node.id,
                            position: props.node.hats.length,
                        })
                    }
                })



                

            }
        }
    };

function TargetDivision(props) {

    const [stateHatArr, setStateHatArr] = useState(props.node.hats)
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        let hatArr = []
        stateHatArr.forEach((hat, i) => {
            hatArr.push(hat)
        })
        hatArr.sort((a, b) => { return a.position - b.position })
        setStateHatArr(hatArr)
    }, [])

    let moveCard = (dragIndex, hoverIndex, source, target) => {

        const dragCard = stateHatArr[dragIndex]
        setStateHatArr(
            update(stateHatArr, {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
            }),
        )
    }

    let hoverStyle = {
        boxShadow: 'inset 0 0 10px white',
        height: '100%',
        borderTop: `4px solid ${props.backgroundColor}`,
        //backgroundColor: '#e7e7e7'
    }

    let noneHoverStyle = {
        height: '100%',
        borderTop: `4px solid ${props.backgroundColor}`,
    }

    const {
        connectDropTarget,
        hovered,
    } = props;

    return connectDropTarget(
        <div>
            <div className="targetDept" id={props.node.id + 'targetDept'}
                style={hovered ? hoverStyle : noneHoverStyle} >
                <div style={{ marginBottom: '0.75em' }}><EmployeeDnDTarget hat={props.node} dbKey={props.dbKey} type={props.type} mode={props.mode} modal={props.modal} dbObj={props.dbObj} /></div>
                <hr style={{ border: '1px solid #484848' }} />
                <div className="card-container">
                    {stateHatArr ?
                        stateHatArr.map((card, i) => (
                            <HatsSource
                                key={card.id}
                                hat={card}
                                dbKey={props.dbKey}
                                index={i}
                                id={card.id}
                                text={card.post}
                                moveCard={moveCard}
                                type={props.type}
                                mode={props.mode}
                                modal={props.modal}
                                dbObj={props.dbObj}
                                userInfo={userInfo}
                            />
                        )) : 'loading....'}
                </div>
            </div>
            <div style={{ height: props.node.product ? (props.node.product.split(' ').length * .3) > 4 ? (props.node.product.split(' ').length * .05) + 'em' : '3.5em' : '3.5em' }} ></div>
            <div className='deptVFP' id='deptVFP'><div className='vfpContainer'>{props.node.product ? `VFP: ${props.node.product}` : null }</div></div>
        </div>
    );
}

export default DropTarget(['hat', 'card'], targetSpec, collect)(TargetDivision);