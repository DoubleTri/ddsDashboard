import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Modal, Button, Popconfirm, Radio, InputNumber } from 'antd';
import { ComposedChart, LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import dateFormat from 'dateformat';
import moment from "moment";

import InputStats from './InputStats';

import { AuthContext } from '../../context/Context';

function QuotaGraph(props) {

    const [quotaData, setQuotaData] = useState(null)
    const [workingDays, setWorkingDays] = useState(null)
    const [monthId, setMonthId] = useState(null)

    const [quota, setQuota] = useState(null)
    const [bonus, setBonus] = useState(null)
    const [editMode, setEditMode] = useState(false)

    //const { workingDays } = useContext(AuthContext);

    useEffect(() => {

        let monthsTemp = []
            
            fireStore.collection('users').doc(props.dbKey).collection('brandNewStats').doc(props.statName).collection('months').onSnapshot((snap) => {
                snap.docs.map((week) => {
                    monthsTemp.push(week.data());
                })
                monthsTemp.sort(function (a, b) {
                    return new Date(a.month) - new Date(b.month);
                });
          
                if (monthsTemp[monthsTemp.length - 1].quota || monthsTemp[monthsTemp.length - 1].quota === 0) {
                    setMonthId(monthsTemp[monthsTemp.length - 1].id);
                    monthsTemp[monthsTemp.length - 1].stats.sort(function (a, b) {
                        return new Date(a.name) - new Date(b.name);
                    });

                    //setCurrentMonth(monthsTemp[monthsTemp.length - 1])
                    let workDaysId = dateFormat(monthsTemp[monthsTemp.length - 1].month, "mmmmyyyy")
                   
                    let tempData = []
                    let monthData = 0
                    fireStore.collection('users').doc(props.dbKey).collection('quotaGraphs').doc(workDaysId).get().then((snap) => {
                        setWorkingDays(snap.data().workingDays)
                        setQuota(monthsTemp[monthsTemp.length - 1].quota)
                        setBonus(monthsTemp[monthsTemp.length - 1].bonus)
                        snap.data().workingDays.map((day, i) => {

                            let quota = parseInt(((i + 1) * ((monthsTemp[monthsTemp.length - 1].quota) / (snap.data().workingDays.length))).toFixed(2))
                            let bonus = parseInt(((i + 1) * ((monthsTemp[monthsTemp.length - 1].bonus) / (snap.data().workingDays.length))).toFixed(2))
                            tempData.push({
                                name: moment(day.toDate()).format('MM/DD'),
                                Day: null,
                                Month: null,
                                Quota: quota,
                                Bonus: bonus,
                                amt: 0,
                                index: i
                            })
                        })
                        tempData.map((day) => {

                            monthsTemp[monthsTemp.length - 1].stats.map((statObj) => {
                                if (dateFormat(statObj.name, "mm/dd") === day.name) {
                                    monthData = monthData + statObj.stat
                                    day.Day = statObj.stat
                                    day.Month = monthData
                                }
                            })
                        })
                        //console.log(tempData);
                        setQuotaData(tempData);
                    })
                }
            })

    }, [props])

    let dot = (e) => {
        console.log((e.payload));
    }

    let CustomizedDot = (e) => <svg x={e.cx} y={e.cy - 40} onClick={() => dot(e)} style={{ cursor: 'pointer' }}>
        <text transform={`rotate(90)`} >{e.value}</text>
    </svg>

    let xAxisTickFormatterMonths = (date) => {
        return dateFormat(date, "mmmm yy");
        
    }

    let customTooltipOnYourLineMonth = (e) => {
        if (e.active && e.payload != null && e.payload[0] != null) {

            return (<div className="custom-tooltip" style={{ border: '1px, solid, gray', background: 'white', padding: '5px' }}>
                <p><b>STAT: {e.payload[0].payload.total}</b></p>
                <p>{dateFormat(e.payload[0].payload.month, "mmmm yyyy")}</p>
                {/* <hr />
                {e.payload[0].payload.notes.map((note, i) => {
                    console.log(dateFormat(note.date.toDate(), "mmmm dS" ))
                    return <div key={i}>{note.text}</div>
                })} */}
            </div>);
        }
        else {
            return "";
        }
    }

    let onQuotaChange = (e) => {
        setQuota(e)
    }
    let onBonusChange = (e) => {
        setBonus(e)
    }

    let submitQuota = () => {
      
        fireStore.collection('users').doc(props.dbKey).collection('brandNewStats').doc(props.statName).collection('months').doc(monthId).update({
            'quota': quota,
            'bonus': bonus
        })
        //props.setChanged(props.statSelected)
        setEditMode(false)
    }

    let pStyle = { backgroundColor: '#ffffff85', boxShadow: '4px 4px 12px 4px #888888', borderRadius: '5px' }

    return (
        <div className='QuotaGraph'>

            {editMode ?
                <Col className="quotaGraph" span={16} style={{ display: 'flex', justifyContent: 'center', marginTop: '1em', ...pStyle }}>
                    Month's Quota: <InputNumber onChange={onQuotaChange} placeholder={quota} /><span style={{marginRight: '2em'}}> </span> Month's Bonus: <InputNumber onChange={onBonusChange} placeholder={bonus} /><Button className='linkText' style={{ textAlign: 'right' }} onClick={() => submitQuota()}>Submit</Button>
                </Col>
                : null}


            {!editMode ? <div>
                <div style={{ float: 'right' }}>Quota: {quota ? quota : null}</div>
                <br />
                <div style={{ float: 'right' }}>Bonus: {bonus ? bonus : null}</div>
                <br />
                { props.from === 'quotaGraphWrapper' ? <div className='linkText' style={{ textAlign: 'right' }} onClick={() => setEditMode(true)}>edit</div> : null }
            </div>
                : null}


            <ResponsiveContainer className='quotaGraph' width="100%" aspect={ props.from === 'oicGraphs' ? 1.5 : 2}>
                <ComposedChart
                    data={quotaData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={75} angle={90} dy={20} onClick={(data) => console.log(data)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Area type="monotone" dataKey="Quota" stroke="black" fill="#e0e0e0" />
                    <Area type="monotone" dataKey="Bonus" stroke="green" fill="#e0e0e0" />
                    <Line type="monotone" dataKey="Day" type="linear" stroke="blue" strokeWidth={4} />
                    <Line type="monotone" dataKey="Month" type="linear" stroke="purple" strokeWidth={4} />

                </ComposedChart>
            </ResponsiveContainer>
    
            { props.from === 'statSubmission' || props.from === 'quotaGraphWrapper' ? <InputStats statName={props.statName} workingDays={workingDays} dbKey={props.dbKey} user={props.currentUser}/> : null }

        </div>
    )
}

export default QuotaGraph;