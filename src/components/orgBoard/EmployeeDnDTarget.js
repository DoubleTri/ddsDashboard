import React, { useState, useContext, useEffect, useRef } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom'
import { Modal, Button, message, Popover, Divider, Row, Col } from 'antd'
import { DropTarget } from 'react-dnd';

import Hat from './postModel/Hat';
import Stats from './postModel/Stats';
import FlowCharts from './postModel/FlowCharts';
import SectionsForm from '../header/SectionsForm';
import FlowChartNavigation from '../orgBoard/FlowChartNavigation';
//import hatUpdate from '../../functions/hatUpdate';
import HeldFromAboveOLD from '../../functions/heldFromAboveOLD';
import findHeldFromAboveOLD from '../../functions/findHeldFromAboveOLD';

import { AuthContext } from '../../context/Context';

let len = 10;
let pattern = 'aA0'

let employeeObj;

const collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem(),
        didDrop: monitor.didDrop(),
        results: monitor.getDropResult()
    }
}

const multiEmployeeAddition = (dbKey, hat, employeeObj) => {
    fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(hat.id).update({
        'multiEmployeeArr': firebase.firestore.FieldValue.arrayUnion({
            name: employeeObj.name,
            uid: employeeObj.uid
        })
    })
}

const targetSpec = {
    drop(props, monitor, component) {
        employeeObj = monitor.getItem().item
        if (!props.hat.multiEmployee) {
            if (!props.hat.isExect) {
                //props.setLoading(true)
                employeeObj = monitor.getItem().item
                fireStore.collection("users").doc(props.dbKey).collection('orgBoard').where('type', '==', 'ed').get().then((res) => {
                    if (res.docs[0].data().employee || props.hat.type === 'ed' || props.hat.type === 'owner') {

                        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.hat.id).update({
                            employee: {
                                name: employeeObj.name,
                                hfa: false,
                                hfaAt: null,
                                uid: employeeObj.uid
                            }
                        }).then(() => {
                            let batch = fireStore.batch();
                            let alreadyFiredArr = [];
                            findHeldFromAboveOLD(props.hat, props.dbKey).then(async (res) => {
                                res.forEach((post) => {

                                    if (post.type === 'exect' || post.type === 'ed' || post.type === 'owner') {
                                        if (!alreadyFiredArr.some(e => e === post.id)) {
                                            alreadyFiredArr.push(post.id)
                                            fireStore.collection("users").doc(props.dbKey).collection('orgBoard').where('isExect', '==', post.id).get().then((snap) => {
                                                //console.log(snap.docs[0].data().id);
                                                fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(snap.docs[0].data().id).update({
                                                    'employee': {
                                                        name: employeeObj.name,
                                                        hfa: true,
                                                        hfaAt: { post: props.hat.post, uid: props.hat.id },
                                                        uid: employeeObj.uid
                                                    }
                                                })
                                            })
                                        }
                                    }
                                    if (post.id !== props.hat.id && !post.isExect) {
                                        batch.update(fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(post.id), {
                                            'employee': {
                                                name: employeeObj.name,
                                                hfa: true,
                                                hfaAt: { post: props.hat.post, uid: props.hat.id },
                                                uid: employeeObj.uid
                                            }
                                        })
                                    }
                                })
                            }).then(() => {
                                console.log('batch fired');
                                batch.commit().catch((error) => { console.log(error) })
                            })
                        })

                    } else {
                        message.error('Must post Office Manager')
                    }
                })
                message.success('updating database....')
            }
        } else {
            multiEmployeeAddition(props.dbKey, props.hat, employeeObj)
        }
    }
}


function EmployeeDnDTarget(props) {

    const [sectionVisable, setSectionVisable] = useState(false)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState('Hat Info')

    const [sectionsArr, setSectionsArr] = useState(null)
    const [newSectionModal, setNewSectionModal] = useState(false)

    const [exect, setExect] = useState(null)

    const [hfa, setHfa] = useState(false)

    const { userInfo, flowChartNodeSelected, dbKey, node, nextTerminals, lastArr, goBack, flowChartNavigationNext } = useContext(AuthContext);

    const employeeRef = useRef();

    useEffect(() => {

    },[props])

    let hoverStyle = !props.hat.isExect ? {
        backgroundColor: '#e7e7e7',
        boxShadow: 'inset 0 0 10px gray, 0 0 10px gray',
        borderRadius: '5px',
    } : null

    let flowChartNodeSelectedStyle = {backgroundColor: 'white', boxShadow: 'inset 0 0 20px white, 0 0 20px white' }

    const {
        connectDropTarget,
        hovered,
    } = props;

    let style = flowChartNodeSelected === props.hat.id ? flowChartNodeSelectedStyle : {cursor: 'pointer'}

    let deputyStyle = { border: '1px solid black', margin: '5px',  borderRadius: '5px', cursor: 'pointer', backgroundColor: 'rgba(192,192,192,0.4)' }

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleRemove = () => {
        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.hat.id).update({
            childOf: null
        })
        setIsModalVisible(false);
    }


    const handleRemoveEmployee = async () => {
        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.hat.id).update({
            employee: null
        })
        setIsModalVisible(false);

        let nonHfaFromDb = []

        await fireStore.collection("users").doc(dbKey).collection('orgBoard')
            .where("employee.hfa", "==", false).get().then((res) => {
                res.forEach((post) => {
                    nonHfaFromDb.push(post.data())
                })
            }).then(() => {
                console.log(nonHfaFromDb);
            })

        let postArr = []
        let exectArr = []

        nonHfaFromDb.forEach((nonHfaPost) => { 
            findHeldFromAboveOLD(nonHfaPost, dbKey).then((res) => {
                let batchTwo = fireStore.batch();
                res.forEach((post) => {
                    if (post.type === 'exect' || post.type === 'ed' || post.type === 'owner') {
                        if (!exectArr.some(e => e.postId === post.id)) {
                            exectArr.push({ postId: post.id, postData: nonHfaPost })
                        }
                    }
                    if (post.id !== nonHfaPost.id && !post.isExect) {
                        postArr.push({ postId: post.id, postData: nonHfaPost })
                    }
                })
                postArr.forEach((post) => {
                    
                        batchTwo.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(post.postId), {
                            'employee': {
                                name: post.postData.employee.name,
                                hfa: true,
                                hfaAt: { post: post.postData.post, uid: post.postData.id },
                                uid: post.postData.employee.uid
                            }
                        })
                })
                batchTwo.commit().catch((error) => { console.log(error) })

                exectArr.forEach((exect) => {
                    fireStore.collection("users").doc(props.dbKey).collection('orgBoard').where('isExect', '==', exect.postId).get().then((snap) => {
                        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(snap.docs[0].data().id).update({
                            'employee': {
                                name: exect.postData.employee.name,
                                hfa: true,
                                hfaAt: { post: exect.postData.post, uid: exect.postData.id },
                                uid: exect.postData.employee.uid
                            }
                        })
                    })
                })
            })
        })
        message.success('updating database....')
    }

    let editSection = () => {
        setNewSectionModal(true)
    }

    let popoverContent = () => {
        if (node) {
            return <div>
            <div>{node.data.change}</div>
            <hr style={{ padding: '1px' }} />
            {nextTerminals ? nextTerminals.map((item, i) => {
                return <div key={i} onClick={() => flowChartNavigationNext(item)} style={{ cursor: 'pointer' }}>
                    {item.label ? <span style={{ fontWeight: 'bold' }}>{item.label} - </span> : null }
                    <span>{ nextTerminals.length === 1 && !item.label ? <span style={{ fontWeight: 'bold' }}>Next: {item.data.post}</span> : item.data.post }</span>
                    { item.type === 'otherFlowChart' ? 'Next Flow Chart: ' + item.data.flowChart : null }
                    </div>
            }) : null
            }
            {lastArr.length > 1 ? <div style={{ textAlign: 'right', color: 'gray', cursor: 'pointer' }} onClick={() => goBack()}>Previous</div> : null}
        </div> 
        }
    }

    return connectDropTarget(
        // className of assigned so that you could add a style to org board nodes that are assigned to current user.  
        // this feature was not used in 1.0       
     
        <div style={ props.hat.type === 'deputy' ? deputyStyle : style} className={props.hat.post}>

            <Popover
                content={ flowChartNodeSelected ? popoverContent : null} 
                title={node ? <h2><b>{node.data.post}</b></h2> : null}
                trigger="click"
                visible={flowChartNodeSelected === props.hat.id}
                overlayStyle={{
                    width: "20vw"
                  }}
            //onVisibleChange={console.log('change')}
            >
                {props.hat.section ?

                    <div className='container section' style={{ textAlign: 'left', height: '100%', width: '100%', ...hovered ? hoverStyle : null}} >
                        <div onClick={() => setSectionVisable(!sectionVisable)} >
                            <b>{props.hat.post}</b>

                            <div className='employee' ref={employeeRef} style={{ textAlign: 'center' }}>
                                {/* { props.hat.employee ? props.hat.employee.name : null } */}
                                <HeldFromAboveOLD node={props.hat} hfa={hfa} />
                            </div>
                        </div>
                        <div style={{ display: sectionVisable ? null : 'none' }}>
                            <hr style={{ border: '1px solid gray', width: '70%' }} />
                            {props.hat.functions ? props.hat.functions.map((duty, i) => {
                                return <li key={i}>{duty}</li>
                            }) : null}
                            { !userInfo.kiosk ? <div onClick={() => editSection()} style={{ textAlign: 'right' }}>Edit</div> : null }
                        </div>

                        < hr style={{ border: '1px solid #484848' }}/>

                    </div>

                    :


                    <div className={props.modal ? "modalEmployeeTarget" : "employeeDnDTarget"} id={props.hat.id} style={hovered ? hoverStyle : null} onClick={showModal} >

                        {props.hat.type === 'divs' && props.hat.division !== 'Division Seven' ?
                            
                            <div className='container' id={props.hat.id} style={{ textAlign: 'center', minHeight: props.hat.division === 'Division One' || props.hat.division === 'Division Five' ? '6.5em' : '5.5em', }}>
                            
                                <b>{props.hat.division}
                                    <h3 style={{ fontWeight: '900' }}>{props.hat.post}</h3></b>
                                <p className='employee' style={{ fontSize: '.7em' }} ref={employeeRef}>
                                    {/* { props.hat.employee ? props.hat.employee.name : null } */}
                                    <HeldFromAboveOLD node={props.hat} hfa={hfa} />

                                </p>



                            </div>
                            :
                            props.hat.division === 'Division Seven' ?
                                <div className='container' style={{ textAlign: 'center', minHeight: '5.5em' }}>

                                    <b>{props.hat.division}
                                        <h3 style={{ fontWeight: '900' }}>{props.hat.post}</h3></b>
                                    <p className='employee' style={{ fontSize: '.7em' }} ref={employeeRef}>
                                        {/* { props.hat.employee ? props.hat.employee.name : null } */}
                                        <HeldFromAboveOLD node={props.hat} hfa={hfa} />


                                    </p>



                                </div>
                                :
                                <div className='container' style={{ textAlign: 'center', minHeight: '3em' }} >

                                    <div style={!props.hat.employee ? { paddingBottom: '.3em', fontWeight: '600' } : { fontWeight: '600' }}>{props.hat.post}</div>

                                    <p className='employee' style={{ fontSize: '.7em' }} ref={employeeRef}>
                                       

                                        {props.hat.isExect ?
                                            props.hat.employee ? props.hat.employee.name : null
                                            :
                                                props.hat.multiEmployee ? props.hat.multiEmployeeArr.map((employee, i) => {
                                                    return <div>{employee.name}</div>
                                                })
                                                :
                                                props.hat.employee ? <div style={ props.hat.employee && !props.hat.employee.hfa ? { fontWeight: 'bold', textDecoration: 'underline' } : null }>{props.hat.employee.name}</div>: null
                                        }

                                    </p>

                                </div>
                        }

                    </div>
                } </Popover>



            <Modal
                title={props.hat.post}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={ '45%' }
                footer={null}
            >
     
                    <Row type="flex" justify="space-around" align="middle" > 
                        <Col className='linkText' span={5} onClick={() => setSelectedData('Hat Info')} style={ selectedData === 'Hat Info' ? { fontWeight: 'bold', textDecoration: 'underline' } : null } >Hat Info</Col>
                        <Col className='linkText' span={5} onClick={() => setSelectedData('Stats')} style={ selectedData === 'Stats' ? { fontWeight: 'bold', textDecoration: 'underline'  } : null } >Stats</Col>
                        <Col className='linkText' span={5} onClick={() => setSelectedData('Flow Charts')} style={ selectedData === 'Flow Charts' ? { fontWeight: 'bold', textDecoration: 'underline'  } : null } >Flow Charts</Col>
                    </Row>

                <hr style={{ border: '1px solid #484848' }}/>

                    { selectedData === 'Stats' ? <Stats node={props.hat} /> : selectedData === 'Flow Charts' ? <FlowCharts dbKey={dbKey} node={props.hat} /> : <Hat node={props.hat} /> }
                    
                    {/* HERE IS WHERE WE ADD LOGIC TO REMOVE POST FROM ORG BOARD, REMOVE EMPLOYEE, ETC... */}

                <hr style={{ border: '1px solid #484848' }}/>

                <Button onClick={handleCancel} >close</Button>

                { userInfo && !userInfo.kiosk ? <span>

                { props.hat.type === 'hat' ? <Button style={{ float: 'right' }} onClick={handleRemove} >Remove From Org Board</Button> : null }

                {props.hat.employee && !props.hat.employee.hfa && !props.hat.multiEmployee && props.hat.type !== 'ed' && props.hat.type !== 'owner' ? 
                    <Button style={{ float: 'right' }} onClick={handleRemoveEmployee} >Remove {props.hat.employee.name}</Button> : 
                null }

                <Link style={{ float: 'right' }} id='hatLink' className='linkText' to={`/post/${props.hat.id}`}>
                    <Button>edit</Button>
                </Link> </span>
                
                : null }
                        
            </Modal>

            <Modal
                visible={newSectionModal}
                onCancel={() => setNewSectionModal(false)}
                footer={null}
            >

                <SectionsForm setNewSectionModal={setNewSectionModal} node={props.hat} dbKey={dbKey} />
                {props.hat.employee && !props.hat.employee.hfa && !props.hat.multiEmployee ? 
                    <Button onClick={handleRemoveEmployee} >Remove {props.hat.employee.name}</Button> : 
                null }

            </Modal>


        </div>
    );
}

export default DropTarget('hatTarget', targetSpec, collect)(EmployeeDnDTarget);