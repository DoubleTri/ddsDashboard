import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Col, Row, Modal } from 'antd';
import { AuthContext } from '../../context/Context';

import ManagementGraph from './ManagementGraph';

function Test(props) {

    const [statArr, setStatArr] = useState(null)
    const [keyStats, setKeyStats] = useState(null)

    const [allStatsModal, setAllStatsModal] = useState(false)
 
    useEffect( async () => {
        let tempStatArr = [];
        let tempKeyStats = []
        await fireStore.collection("users").doc(props.client).collection('stats').get().then((res) => {
            res.docs.map((item) => {
                if (item.data().data.name === "PRODUCTION" || item.data().data.name ===  "COLLECTIONS" || item.data().data.name ===  "GROSS INCOME" ) {
                    tempKeyStats.push(item.data().data.name);
                } 
                tempStatArr.push(item.data().data.name);
            });
            //console.log(tempKeyStats);
            setStatArr(tempStatArr)
            setKeyStats(tempKeyStats)
        })

        // fireStore.collection('users').doc(props.client).collection('stats').doc('COLLECTIONS').onSnapshot((snap) => {
        //     if (snap.data()) {
        //         console.log(snap.data().stats)
        //     }
        // })

    }, [props.client])

    return (
        <div>
            <Row className='test' justify="space-around">
                <Col span={21}><div style={{ cursor: 'pointer' }} onClick={() => setAllStatsModal(true)} >See All Stats</div></Col>
                {keyStats ? keyStats.map((stat, i) => {
                    return <Col span={7} key={i} style={{ marginBottom: '2em' }}>
                        <ManagementGraph key={i} dbKey={props.client} statName={stat} from='oicGraphs' />
                    </Col>
                })
                    : null}
            </Row>
        
        { statArr ? 
            <Modal
                visible={allStatsModal}
                onCancel={() => setAllStatsModal(false)}
                width={2000}
                footer={null}
            >
                <Row className='test' justify="space-around">
                    {statArr.map((stat, i) => {
                        return <Col span={7} key={i + 125} style={{ marginBottom: '2em' }}>
                            <ManagementGraph key={i + 125} dbKey={props.client} statName={stat} from='oicGraphs' />
                        </Col>
                    })}
                </Row>
            </Modal> 
        : null }

        </div>
    )
}

export default Test;