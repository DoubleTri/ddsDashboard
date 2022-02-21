import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router'; 
import { Row, Col } from 'antd';

import { AuthContext } from '../../../context/Context';

function FlowCharts(props) {

    const { setSelectedPostInFlowChart } = useContext(AuthContext);

    useEffect(() => {

    }, [props])

    let elementClicked = (element) => {
        setSelectedPostInFlowChart(props.postId)
        props.history.push(`/flow-charts/${element.flowChart.data.name}`)
    }

    let pStyle = { backgroundColor: '#DDDDDD', borderRadius: '5px', padding: '1em', margin: '2em', minHeight: '15em', textAlign: 'left' }

    return (
        <Row className='flowCharts' justify="center" align="middle" style={{ marginTop: '3em' }} >

            <Col span={24} style={ pStyle }>
                {props.postFlowChartData && props.postFlowChartData.length ? props.postFlowChartData.map((element, i) => {
                    return <div key={i} style={{ cursor: 'pointer', color: 'black' }} onClick={() => elementClicked(element)}><b>{element.flowChart.data.name}</b>:{element.element.data.change} <hr/></div>
                }) : <div style={{ color: 'black' }}>Not currently assigned to any flow charts</div>}
            </Col>

        </Row>
    )
}

export default withRouter(FlowCharts);