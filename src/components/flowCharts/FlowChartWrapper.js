import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Modal, Input, Select, Row, Col } from 'antd';
import ReactFlow, { removeElements, addEdge, ReactFlowProvider } from 'react-flow-renderer';
import { AuthContext } from '../../context/Context';

import getPostTree from '../../functions/getPostTree';
import RandomId from '../../functions/RandomId'
import FlowChart from './FlowChart';
import CustomNode from './CustomNode';
import CustomNodeForm from './CustomNodeForm';
import './dnd.css';



let len = 10;
let pattern = 'aA0'

const snapGrid = [25, 25];
const nodeTypes = {
    selectorNode: CustomNode,
};

const { Search } = Input;
const { Option } = Select;

function FlowChartWrapper(props) {

    const [elements, setElements] = useState([]);

    const [nodeModal, setNodeModal] = useState(false)
    const [postTree, setPostTree] = useState(null)
    const [nodeSelected, setNodeSelected] = useState(null)

    const [edgeModal, setEdgeModal] = useState(false);
    const [newFlowChartModal, setNewFlowChartModal] = useState(false)

    const [flowCharts, setFlowCharts] = useState(null)
    const [flowChartName, setFlowChartName] = useState(null)
    const [selectedFlowChart, setSelectedFlowChart] = useState()

    const { userInfo, dbKey, allFlowCharts, setSelectedPostInFlowChart } = useContext(AuthContext);

    useEffect(() => {

        if (allFlowCharts) {
            let flowChartArr = []
            allFlowCharts.forEach((doc, i) => {
                    flowChartArr.push(<Option key={i} data={doc.data.name} >{doc.data.name}</Option>)
                })
                setFlowCharts(flowChartArr)
        }

        if (dbKey) {   
            let objArr = []
            fireStore.collection('users').doc(dbKey).collection('orgBoard').get().then((snapshot) => {
                snapshot.docs.map(doc => objArr.push(doc.data()))
            }).then(() => {
                getPostTree(objArr).then((res) => {
                    setPostTree(res);
                })
            }).then(() => {
                if(props.match.params.flowChartId) {
                    setSelectedFlowChart(props.match.params.flowChartId) 
                    setFlowChartName(props.match.params.flowChartId) 
                } else {
                    setSelectedFlowChart(null) 
                    setFlowChartName(null) 
                    setSelectedPostInFlowChart(null)
                }
            })
        }



    }, [dbKey, allFlowCharts, props.match.params.flowChartId])

    let selectChanged = (flowChart) => {
        setSelectedFlowChart(flowChart)
        setFlowChartName(flowChart)
        props.history.push(`/flow-charts/${flowChart}`)
    }

    let newFlowChartActivation = () => {
        setNewFlowChartModal(true)
    }

    let closeNewFlowChartModal = () => {
        setNewFlowChartModal(false)
    }
    let onNewFlowChart = (name) => {
        if (name) {
            setNewFlowChartModal(false)
            fireStore.collection("users").doc(dbKey).collection('flowCharts').doc(name).set({
                data: {name: name},
                elements: []
            }).then(() => {
                selectChanged(name)
            })
        }
    }

    return (
        <div style={{ margin: '2em' }}>

            <Row>
                <Col span={4}>
                    <Select
                        style={{ width: '100%', marginRight: '6px' }}
                        placeholder="Select Stat Group"
                        onChange={(e, data) => selectChanged(data.data)}
                        value={selectedFlowChart}
                    >
                        {flowCharts}
                    </Select>
                    { userInfo && !userInfo.kiosk ? <div className='linkText' style={{ marginTop: '1em', color: '#DDDDDD' }} onClick={() => newFlowChartActivation()}>Create New Flow Chart</div> : null }
                </Col>
       

                <Col span={24} style={{ textAlign: 'center' }}>
                    {flowChartName ? <div style={{ marginBottom: '3em' }}>
                        <h1 style={{ color: '#DDDDDD' }}>{flowChartName}</h1>
                    </div> : null}
                </Col>

            </Row>
            
            {selectedFlowChart ? 
            <FlowChart 
                selectedFlowChart={selectedFlowChart} 
                setSelectedFlowChart={setSelectedFlowChart} 
                setFlowChartName={setFlowChartName}
                postTree={postTree} 
                dbKey={dbKey} />
            : null}

            <Modal
                visible={newFlowChartModal}
                onCancel={() => closeNewFlowChartModal()}
                footer={null}
            >
                <b>Name Your New Flow Chart</b>
                <div>
                    <Search
                        placeholder="Flow Chart Name"
                        allowClear
                        enterButton="Submit"
                        size="large"
                        onSearch={(e) => onNewFlowChart(e)}
                    />
                </div>
            </Modal>

        </div>
    );
};

export default FlowChartWrapper;