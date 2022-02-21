import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Modal, Button, Popconfirm, Radio } from 'antd';
import { ComposedChart, LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import dateFormat from 'dateformat';
import moment from "moment";

import WeekGraph from './WeekGraph';
import MonthGraph from './MonthGraph';
import QuotaGraph from './QuotaGraph';
import GraphModal from './GraphModal';

import { AuthContext } from '../../context/Context';

function TestStatWrapper(props) {

    const [data, setData] = useState(null)
    const [weeks, setWeeks] = useState(null)

    const [radioValue, setRadioValue] = useState('weeks')

    const [statModal, setStatModal] = useState(false)

    const { dbKey, currentUser } = useContext(AuthContext);

    useEffect(() => {
        setRadioValue('weeks')

        let d = new Date();
        let thisWeek = d.getTime() + 604800000
  
        if (dbKey) {
            fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).onSnapshot((snap) => {
                setData(snap.data())
            })
            fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('weeks').onSnapshot((snap) => {
                let weeksTemp = []
                snap.docs.map((week) => {
                    if (thisWeek > week.data().weekEnding) {
                        weeksTemp.push(week.data());
                    }
                })
                weeksTemp.sort(function (a, b) {
                    return new Date(a.weekEnding) - new Date(b.weekEnding);
                });
                setWeeks(weeksTemp)
                if (props.from === 'quotaGraphWrapper'){
                    setRadioValue('quota')
                } 
                 
            })
        }

    }, [dbKey, props.statName])

    let onRadioChange = (e) => {
        setRadioValue(e.target.value);
    }
    const radioStyle = {
        fontWeight: 'bold',
    };

    let cancelStatModal = () => {
        setStatModal(false)
    }
    
    let renderedGraph = () => {

        switch (radioValue) {

            case 'weeks':

                return <WeekGraph weeks={weeks} data={data} dbKey={dbKey} currentUser={currentUser} from={props.from} statName={props.statName} setStatModal={setStatModal} />

            case 'months':

                return <MonthGraph data={data} dbKey={dbKey} currentUser={currentUser} from={props.from} statName={props.statName} setStatModal={setStatModal} />

            case 'quota':

                return <QuotaGraph data={data} dbKey={dbKey} currentUser={currentUser} from={props.from} statName={props.statName} />

            default:
                return <h3>No Posts Assigned</h3>
        }
    }

    return (
        <div className='TestStatWrapper'>    

            {props.from === 'statSubmission' || props.from === 'modal' ?
                <div style={{ marginLeft: '2em' }}>
                    <Radio.Group onChange={(e) => onRadioChange(e)} value={radioValue}>
                        <Radio style={radioStyle} value={'weeks'}>Weeks</Radio>
                        <Radio style={radioStyle} value={'months'}>Months</Radio>
                        {data && data.quotaGraph ? <Radio style={radioStyle} value={'quota'}>Quota</Radio> : null}
                    </Radio.Group>
                    <hr />
                </div>
                : null}      
         
            {weeks && data ? renderedGraph() : null }

            <Modal
                visible={statModal}
                onCancel={() => cancelStatModal()}
                footer={null}
                width={'80%'}
            >
                <GraphModal statName={props.statName} deleteStat={props.deleteStat} cancelStatModal={cancelStatModal} delete={ props.from === 'post' ? true : false } />
            </Modal>


        </div>
    )
}

export default TestStatWrapper;