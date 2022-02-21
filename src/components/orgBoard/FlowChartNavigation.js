import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Context';
import { Row, Col } from 'antd';

function FlowChartNavigation(props) {

    const [node, setNode] = useState(props.flowChart.data)
    const [nextTerminals, setNextTerminals] = useState(null)
    const [lastArr, setLastArr] = useState([])

    const { setFlowChartNodeSelected, setFlowChartNodeSelectedData  } = useContext(AuthContext);


    useEffect(() => {
        props.flowChart.data.elements.map((item) => {
            if (item.data && item.data.startPoint) {
                flowChartNavigationNext(item)
            } 
        })
    }, [])

    const flowChartNavigationNext = (node) => {
        let lastArrTemp = lastArr
        lastArrTemp.push(node)
        setLastArr(lastArrTemp)

        setFlowChartNodeSelected(node.data.postId)
        

        setNode(node);
        let nextEdge = []
        props.flowChart.data.elements.map((item) => {
            if (item.source === node.id) {
                nextEdge.push(props.flowChart.data.elements.filter((e) => e.id === item.target)[0])
            }
            setNextTerminals(nextEdge)
        })
    }

    const flowChartNavigationLast = (node) => {

        let lastArrTemp = lastArr
        lastArrTemp.pop()
        setLastArr(lastArrTemp)

        setFlowChartNodeSelected(node.data.postId)

        setNode(node);
        let nextEdge = []
        props.flowChart.data.elements.map((item) => {
            if (item.source === node.id) {
                nextEdge.push(props.flowChart.data.elements.filter((e) => e.id === item.target)[0])
            }
            setNextTerminals(nextEdge)
        })
    }

    const goBack = () => {
        console.log(lastArr);
        flowChartNavigationLast(lastArr[lastArr.length - 2]);
    }
   
    return (
        <div className="flowChartNavigation">

            <div style={{ padding: '3em' }} >
                <div>{node.data.post}</div>
                <br />
                {nextTerminals ? nextTerminals.map((item, i) => {
                    return <div key={i} onClick={() => flowChartNavigationNext(item)}>{item.data.post}</div>
                }) : null
                }
                { lastArr.length > 1 ? <div onClick={() => goBack()}>Go Back</div> : null }
            </div>  

        </div>
    );
}

export default FlowChartNavigation; 