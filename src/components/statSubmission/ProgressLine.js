import React, { useState, useEffect } from 'react';
import { fireStore } from '../../firebase';
import { Col, Row, Progress } from 'antd';

function ProgressLine(props) {

    const [statData, setStatData] = useState(null)

    useEffect(() => {
        fireStore.collection('users').doc(props.dbKey).collection('stats').doc(props.statName).onSnapshot((snap) => {
            setStatData(snap.data().stats)
        })
    }, [props])

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
            remaining = <span style={{ float: 'right', fontSize: '85%' }}><i>{'Currently: ' + currentWeek + '.  Upstat!'}</i></span>
        } else {
            remaining = <span style={{ float: 'right', fontSize: '85%'  }}><i>{'Currently: ' + currentWeek + '.  To be Upstat:  ' + (lastWeek - currentWeek + 1)}</i></span>
        }
        return remaining
    }

    return (
        <div className='progressLine'>
            {statData ?
                <Row justify="end">
                    <Col span={24} >
                        <Progress
                            id='currentWeekProgress'
                            strokeColor={percentCalculation(statData[statData.length - 2].stat, statData[statData.length - 1].stat) === 100 ? 'yellow'
                                : percentCalculation(statData[statData.length - 2].stat, statData[statData.length - 1].stat) > 100 ? 'green' : 'red'}
                            percent={percentCalculation(statData[statData.length - 2].stat, statData[statData.length - 1].stat)} showInfo={false}
                        />
                    </Col>
                    <Col span={24}>{remainingCalculation(statData[statData.length - 2].stat, statData[statData.length - 1].stat)}</Col>
                    <hr />
                </Row>
                : null}
        </div>
    )
}

export default ProgressLine;