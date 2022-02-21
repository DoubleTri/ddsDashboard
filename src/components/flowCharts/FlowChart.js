import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from "react-router-dom";
import { fireStore } from '../../firebase';
import { Modal, Input, Select, Button, Popconfirm } from 'antd';
import ReactFlow, { removeElements, addEdge, ReactFlowProvider } from 'react-flow-renderer';
import { AuthContext } from '../../context/Context';

import getPostTree from '../../functions/getPostTree';
import RandomId from '../../functions/RandomId'

import CustomNode from './CustomNode';
import OtherFlowChartNode from './OtherFlowChartNode'
import CustomNodeForm from './CustomNodeForm';
import NodeView from './NodeView';
import './dnd.css';



let len = 10;
let pattern = 'aA0'

const snapGrid = [25, 25];
const nodeTypes = {
    selectorNode: CustomNode,
    otherFlowChart: OtherFlowChartNode
};

const { Search } = Input;
const { Option } = Select;

function FlowChart(props) {

    const [elements, setElements] = useState([]);
    const [test, setTest] = useState(null)

    const [nodeModal, setNodeModal] = useState(false)
    const [nodeModalEdit, setNodeModalEdit] = useState(false)
    const [postTree, setPostTree] = useState(null)
    const [nodeSelected, setNodeSelected] = useState(null)

    const [edgeModal, setEdgeModal] = useState(false);
    const [edgeSelected, setEdgeSelected] = useState(null)

    const [flowCharts, setFlowCharts] = useState(null)
    const [selected, setSelected] = useState()

    const { userInfo, hattingMaterial, allFlowCharts } = useContext(AuthContext);

    useEffect(() => {
        setNodeModalEdit(false)
        setNodeModal(false)
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).onSnapshot((snap) => {
            if (snap.data() && snap.data().elements) {
                setElements(snap.data().elements) 
            } else {
                props.history.push('/flow-charts')
            }
        })
        console.log(userInfo.kiosk);
    }, [props])

    let onSubmit = () => {
        if  (!userInfo.kiosk) {
            fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).update({
                elements : elements
            })
        }
    }

    const onConnect = (params) => {
        params.type = 'smoothstep'
        params.arrowHeadType = 'arrowclosed'
        params.label = null
        params.style = { stroke: '#fff', strokeWidth: 3, cursor: 'pointer' }
        params.id = 'reactflow__edge-' + RandomId(len, pattern) + '-' + RandomId(len, pattern) + 'nodeHandle'
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).update({
            elements : elements.concat(params)
        })
    }

    const onAdd = () => {
        setNodeModalEdit(true)
    }

    let editActivated = () => {
        setNodeModal(false)
        setNodeModalEdit(true)
    }

    let closeNodeModalEdit = () => {
        setNodeModalEdit(false)
        setNodeSelected(null)
    }

 


    let onSelect = (event, element) => {

        if (element.type === 'smoothstep') {
            if ( userInfo && !userInfo.kiosk ) {
                setEdgeSelected(element)
                setEdgeModal(true)
            }
        } else if (element.type === 'otherFlowChart') {
            props.setSelectedFlowChart(element.data.flowChart)
            props.setFlowChartName(element.data.flowChart)
            props.history.push(`/flow-charts/${element.data.flowChart}`)
        } else {
            setNodeSelected(element)
            setNodeModal(true)
        }
    }


    let onNodeDragStop = (event, node) => {
        let elementsTemp = elements
        let effectedNodeIndex = elementsTemp.findIndex((obj => obj.id === node.id));
        elementsTemp[effectedNodeIndex].position = node.position
        setElements(elementsTemp)
        onSubmit()
    }

    let conditionalDataEntered = (e) => {
        let elementsTemp = elements
        let effectedNodeIndex = elementsTemp.findIndex((obj => obj.id === edgeSelected.id));
        elementsTemp[effectedNodeIndex].label = e
        elementsTemp[effectedNodeIndex].labelStyle = { fontSize: '125%' }
        setElements(elementsTemp)
        onSubmit()
        closeEdgeModal()
    }
    let closeEdgeModal = () => {
        setEdgeModal(false)
        setEdgeSelected(null)
    }

    let deleteLine = (e) => {
        let elementsTemp = elements
        let effectedNodeIndex = elementsTemp.findIndex((obj => obj.id === edgeSelected.id));
        elementsTemp.splice(effectedNodeIndex, 1)
        setElements(elementsTemp)
        onSubmit()
        closeEdgeModal()
    } 

    let onDelete = () => {
        props.setSelectedFlowChart(null) 
        props.setFlowChartName(null)
        props.history.push(`/flow-charts`)
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    let lineStyle = { stroke: '#fff', strokeWidth: 2, cursor: 'pointer' };

    return (
        <div className='flowChartBox' >

        { userInfo && !userInfo.kiosk ? <Button onClick={onAdd} style={{ margin: '1em' }}>Add A Step</Button> : null }
            {userInfo && !userInfo.kiosk ? <div style={{ float: 'right' }}>
                <Popconfirm
                    title={`Are you sure you want to delete ${props.selectedFlowChart}?`}
                    placement="bottom"
                    onConfirm={() => onDelete()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="danger" style={{ float: 'right' }}>
                        Delete
                    </Button>
                </Popconfirm></div> : null}

            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    //onElementsRemove={onElementsRemove}
                    style={{ height: '745px' }}
                    elementsSelectable={true}
                    onElementClick={onSelect}
                    onNodeDragStop={onNodeDragStop}
                    onConnect={onConnect}
                    snapToGrid={true}
                    snapGrid={snapGrid}
                    connectionLineType="smoothstep"
                    arrowHeadColor={"#fff"}
                    nodeTypes={nodeTypes}
                    connectionLineStyle= {lineStyle}
                    defaultZoom={-5}
                // onEdgeMouseEnter={(e, node) => {console.log("Node Mouse Enter",node)}}
                // onEdgeMouseLeave={(e, node) => {console.log("Node Mouse Leave",node)}}
                />
            </ReactFlowProvider>

            {edgeSelected ?
                <Modal
                    visible={edgeModal}
                    onCancel={() => closeEdgeModal()}
                    footer={null}
                >
                    <b>Enter Conditional Data</b>
                    <div style={{ padding: '1em' }}>
                        <Search
                            placeholder="Conditional Data"
                            defaultValue={elements[elements.indexOf(elements.find(o => o.id === edgeSelected.id))].label}
                            allowClear
                            enterButton="Submit"
                            size="large"
                            onSearch={(e) => conditionalDataEntered(e)}
                        />
                    </div>
                    <div onClick={() => deleteLine()}>Delete Line</div>
                </Modal>
                : null}

            <Modal
                visible={nodeModal}
                onCancel={() => [setNodeModal(false), setNodeSelected(null)]}
                footer={null}
            >
                <b></b>
                <div>
                    <NodeView nodeSelected={nodeSelected}/>
                </div>
                { userInfo && !userInfo.kiosk ? <Button onClick={() => editActivated()}>Edit</Button> : null }
            </Modal> 

            <Modal
                visible={nodeModalEdit}
                onCancel={() => closeNodeModalEdit()}
                footer={null}
                maskClosable={false}
            >
                <b>Enter Step Data</b>
                <div>
                    <CustomNodeForm
                        selectedFlowChart={props.selectedFlowChart}
                        postTree={props.postTree}
                        setElements={setElements}
                        elements={elements}
                        closeNodeModalEdit={closeNodeModalEdit}
                        nodeSelected={nodeSelected}
                        onSubmit={onSubmit}
                        dbKey={props.dbKey}
                        allFlowCharts={allFlowCharts}
                        hattingMaterial={hattingMaterial}
                    />
                </div>
            </Modal> 

        </div>
    );
};

export default withRouter(FlowChart);