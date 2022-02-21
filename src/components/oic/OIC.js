import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Select, Checkbox, Button, Input, Modal, message, Popconfirm } from 'antd';
import { AuthContext } from '../../context/Context';
import OICQuotaGraphs from './OICQuotaGraphs';
import Graph from '../graphs/Graph';
import TestStatWrapper from '../testStat/TestStatWrapper';

const { Option } = Select;
const { Search } = Input;

function OIC() {

    const { selectedStatGroup, setSelectedStatGroup, dbKey, userInfo } = useContext(AuthContext);

    const [statGroups, setStatGroups] = useState(null)
    const [selected, setSelected] = useState()
    const [createGroup, setCreateGroup] = useState(false)
    const [newGroupNameModal, setNewGroupNameModal] = useState(false)

    const [newGroupName, setNewGroupName] = useState(null)
    const [newGroupArr, setNewGroupArr] = useState([])

    const [editMode, setEditMode] = useState(false)
    const [statGroupOnHold, setStatGroupOnHold] = useState(null)

    const [quotaGraphs, setQuotaGraphs] = useState(false)

    useEffect(() => {
        let statGroupObjArr = []
        if (dbKey) {
            fireStore.collection('users').doc(dbKey).collection('statGroup').onSnapshot(async (snapshot) => {
                statGroupObjArr = []
                await snapshot.docs.map((doc, i) => {
                    statGroupObjArr.push(<Option key={i} data={doc.data()} >{doc.data().name}</Option>)
                })
                setStatGroups(statGroupObjArr)
            })
        }
    }, [dbKey])

    let selectChanged = (statGroup) => {
        statGroup.name === 'Quota Graphs' ? setQuotaGraphs(true) : setQuotaGraphs(false)
        setCreateGroup(false)
        setSelected(statGroup.name)
        setNewGroupName(null)
        setSelectedStatGroup(statGroup);
    }

    let newGroupActivation = () => {
        setStatGroupOnHold(selectedStatGroup)
        setCreateGroup(true)
        setSelected(null)
        setNewGroupNameModal(true)
        setSelectedStatGroup(statGroups[0].props.data);
        setQuotaGraphs(false)
    }

    let nameCreated = (name) => {
        if (name) {
            setNewGroupName(name)
            setNewGroupNameModal(false)
        } 
    }

    let newGroup = (checked, graph) => {
        if (checked) {
            setNewGroupArr(newGroupArr => [...newGroupArr, graph])
        } else {
            let filteredArr = newGroupArr.filter(e => e !== graph)
            setNewGroupArr(filteredArr)
        }
    }

    let cancelModal = () => {
        setCreateGroup(false)
        setNewGroupName(null)
        setNewGroupNameModal(false)
        statGroupOnHold.name === 'Quota Graphs' ? setQuotaGraphs(true) : setQuotaGraphs(false)
        setSelectedStatGroup(statGroupOnHold)
        setStatGroupOnHold(null)
    }

    let submit = () => {
        if (newGroupArr.length) {
            // Add to the database
        fireStore.collection("users").doc(dbKey).collection('statGroup').doc(newGroupName).set({ name: newGroupName, statArr: newGroupArr, editable: true }).then(() => {
            // Clear out state data    
                setNewGroupName(null)
                setNewGroupArr([])
                setEditMode(false)
                setStatGroupOnHold(null)
            }).then(() => {
            // Show the newly creted stat group on the OIC board
                setCreateGroup(false)
                setSelected(newGroupName)
                setNewGroupName(null)
                setSelectedStatGroup({name: newGroupName, statArr: newGroupArr, editable: true });
            })
        } else {
            message.error('Please select a graph.  A stat group cannot be empty');
        }

    }

    let editStatGroup = (statGroup) => {
        setQuotaGraphs(false)
        setEditMode(true)
        setStatGroupOnHold(statGroup)
        setNewGroupArr(statGroup.statArr)   
        setCreateGroup(true)
        setNewGroupName(statGroup.name)
        setSelectedStatGroup(statGroups[0].props.data);
    }
    let exitEditMode = () => {
        setEditMode(false)
        setCreateGroup(false)
        setNewGroupName(null)
        setSelectedStatGroup(statGroupOnHold);
        setStatGroupOnHold(null)
    }

    let deleteStatGroup = () => {
        console.log(selectedStatGroup);
        fireStore.collection("users").doc(dbKey).collection('statGroup').doc(statGroupOnHold.name).delete().then(() => {
            console.log("Document successfully deleted!");
            setEditMode(false)
            setCreateGroup(false)
            setNewGroupName(null)
            setSelected(null)
            setSelectedStatGroup(statGroups[0].props.data);
            setStatGroupOnHold(null)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <div className="oic" style={{ margin: '2em' }}>
            <Row>
                <Col span={4}>
                    <Select
                        style={{ width: '100%', marginRight: '6px' }}
                        placeholder="Select Stat Group"
                        onChange={(e, data) => selectChanged(data.data)}
                        value={selected}
                    >
                        {statGroups}
                    </Select>
                    { userInfo && !userInfo.kiosk ? <div className='linkText' style={{ marginTop: '1em', color: '#dddddd' }} onClick={() => newGroupActivation()} >Create New Stat Group</div> : null } 
                </Col>
            </Row>

            <Row justify="space-around">
                <Col span={24} style={{ textAlign: 'center' }}>
                    {newGroupName ? <div style={{ marginBottom: '3em', color: '#dddddd' }}>
                        <h1>{newGroupName}</h1>
                        Select stats for <b>{newGroupName}</b> and click "submit" at the bottom
                        </div> : null}
                </Col>

                <Col span={24} style={{ textAlign: 'center' }}>

                    {selectedStatGroup && !newGroupName ? <div>
                        <h1 style={{ color: '#dddddd' }}>{selectedStatGroup.name}</h1>
                        { userInfo.admin && selectedStatGroup.editable ? <span className='linkText' style={{ float: 'right' }} onClick={() => editStatGroup(selectedStatGroup)}>Edit</span> : null }
                    </div> : null}

                    { editMode ? <div style={{ float: 'right' }}>
                    <span className='linkText' onClick={() => exitEditMode()}>Exit Edit Mode</span>
                    <br/>
                        <Popconfirm placement="leftTop" title={`Are you sure you want to delete ${selectedStatGroup.name}?`} onConfirm={deleteStatGroup} okText="Yes" cancelText="No">
                            <span className='deleteText' style={{ color: '#dddddd' }}>Delete</span>
                        </Popconfirm>
                    </div>: null}
                    

                </Col>

                    {selectedStatGroup && !quotaGraphs ? selectedStatGroup.statArr.map((graph, i) => {
                        return <Col span={7} key={i} style={{ marginBottom: '2em' }}>
                            {createGroup ? <Checkbox onChange={(e) => newGroup(e.target.checked, graph)} defaultChecked={editMode && newGroupArr.includes(graph) ? true : false} /> : null}
                            {/* <TestStatWrapper key={i} statName={graph} from='oicGraphs' /> */}
                            <Graph key={i} statName={graph} from='oicGraphs' />
                        </Col>
                    }) : null}
                
                {createGroup ? <Button onClick={() => submit()}>Submit</Button>: null}

                {selectedStatGroup && quotaGraphs ? <OICQuotaGraphs /> : null}

            </Row>


            <Modal
                visible={newGroupNameModal}
                onCancel={() => cancelModal()}
                footer={null}
            >
                <b>Name Your New Stat Group</b>
                <div>
                    <Search
                        placeholder="Stat Group Name"
                        allowClear
                        enterButton="Submit"
                        size="large"
                        onSearch={(e) => nameCreated(e)}
                    />
                </div>
            </Modal>

        </div>
    );
}

export default OIC; 