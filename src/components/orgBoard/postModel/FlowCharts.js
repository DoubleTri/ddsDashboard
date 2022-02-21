import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../../firebase'; 
import { withRouter } from 'react-router'; 
import { Row, Col } from 'antd';

import { AuthContext } from '../../../context/Context';

function FlowCharts(props) {

    const [postFlowChartData, setPostFlowChartData] = useState(null)

    const { setSelectedPostInFlowChart } = useContext(AuthContext);

    useEffect(() => {
        console.log(props.node);

        let postFlowChartDataTemp = []
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').onSnapshot((snap) => {
            snap.forEach((item) => {
                item.data().elements.map((element) => {
                    if (element.data && element.data.post === props.node.post) {
                        postFlowChartDataTemp.push({ element: element, flowChart: item.data() });
                    }
                })
            })
            setPostFlowChartData(postFlowChartDataTemp);
        })

    }, [props])

    let elementClicked = (element) => {
        console.log(element.flowChart.data.name);
        setSelectedPostInFlowChart(props.node.id)
        props.history.push(`/flow-charts/${element.flowChart.data.name}`)
    }


    return (
        <div>
            {postFlowChartData && postFlowChartData.length ? <div>  {postFlowChartData.map((element, i) => {
                return <div key={i} style={{ cursor: 'pointer' }} onClick={() => elementClicked(element)}><b>{element.flowChart.data.name}</b>: {element.element.data.change}</div>
            })} </div> : props.node.post + ' is not assigned to any flow chart'}
        </div>
    )
}

export default withRouter(FlowCharts);