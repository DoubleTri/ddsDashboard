import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { fireStore } from '../../firebase';
import { Button, Col, Collapse, Row, Progress, Modal } from 'antd';

import { AuthContext } from '../../context/Context';

function StatHeader(props) {

    const [stats, setStats] = useState(null)
    const [fullStatData, setFullStatData] = useState(null)

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {

        let tempStatArr = []
        props.item.statIdArr.map((stat) => {
            fireStore.collection("users").doc(dbKey).collection('stats').doc(stat).get().then((snapshot) => {
                tempStatArr.push(snapshot.data());
            }).then(() => {
                setFullStatData(tempStatArr)
            })
        })
        

    }, [props])

    // useEffect(() => {
    //     let tempStatArr = []
    //     props.item.statIdArr.map((stat) => {
    //         fireStore.collection("users").doc(dbKey).collection(stat).doc('stats').get().then((doc) => {
    //             tempStatArr.push(doc.data())
    //         }).then(() => {
    //             setFullStatData(tempStatArr)
    //         })
    //     })
    // }, [props])

    let percentCalculation = (lastWeek, currentWeek) => {

        let percent;

        if (lastWeek !== 0) {
            percent = ((currentWeek / lastWeek) * 100).toFixed(2)
        } else {
            percent = (currentWeek * 100).toFixed(2)
        }
        return isNaN(percent) ? 0 : Number(percent)
    }
    let percentCalculationUpsideDown = (lastWeek, currentWeek) => {
        if (lastWeek === 0 && currentWeek === 0) {
            return (100) 
        } 
        return ((lastWeek / currentWeek) * 100).toFixed()
    }

    let remainingCalculation = (lastWeek, currentWeek) => { 
        let remaining;

        if (lastWeek < currentWeek) {
            remaining = 'Upstat!'
        } else {
            remaining = lastWeek - currentWeek + 1 + ' To be Upstat'
        }
        return remaining
    }

    let headerStyle = (i) => {
        // This dims the other header progress bars thus making the open pannel easier to read
        return props.openPannel ? parseInt(props.openPannel) === i ? { display: 'none' } : { opacity: '0.5' } : null
    }

    return (
        <Row><Col span={24}>{props.item.id === props.post ? <h3><b>{props.item.post}</b></h3> : <b>{props.item.post}</b>}</Col>

            {fullStatData && fullStatData.length ? <div>
                {fullStatData.map((data, i) => {
                    // return data.data.upsideDown ?
                    //     <Row key={i} justify="end" style={headerStyle(props.i)}>
                    //         <Col span={4}>{data.data.name}</Col>
                    //         <Col span={12}>
                    //             <Progress
                    //                 style={headerStyle(props.i)}
                    //                 id='currentWeekProgress'
                    //                 strokeColor={percentCalculationUpsideDown(data.stats[data.stats.length - 2].stat, data.stats[data.stats.length - 1].stat) >= 100 ? '#12820d' : '#ce2121'}
                    //                 percent={percentCalculationUpsideDown(data.stats[data.stats.length - 2].stat, data.stats[data.stats.length - 1].stat)} showInfo={true} />
                    //         </Col>
                    //     </Row>
                    //     :
                        // return <Row key={i} justify="end" style={headerStyle(props.i)}>
                        //     <Col span={4} offset={2}>{data.data.name}</Col>
                        //     <Col span={12} >
                        //         <Progress
                        //             id='currentWeekProgress'
                        //             strokeColor={percentCalculation(data.stats[data.stats.length - 2].stat, data.stats[data.stats.length - 1].stat) === 100 ? 'yellow'
                        //                 : percentCalculation(data.stats[data.stats.length - 2].stat, data.stats[data.stats.length - 1].stat) > 100 ? '#12820d' : '#ce2121'}
                        //             percent={percentCalculation(data.stats[data.stats.length - 2].stat, data.stats[data.stats.length - 1].stat)} showInfo={false}
                        //         />
                        //     </Col>
                        //     <Col span={4}>{remainingCalculation(data.stats[data.stats.length - 2].stat, data.stats[data.stats.length - 1].stat)}</Col>
                        // </Row>
                    return <Row>
                        <Col span={4}>four</Col>
                        <Col span={12}>twelve</Col>
                        <Col span={4}>four</Col>
                    </Row>
                })}

            </div>
                : null}
        </Row>

    )
}

export default StatHeader;