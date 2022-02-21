import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Modal, Button, Popconfirm, Radio, Divider } from 'antd';
import { ComposedChart, LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import dateFormat from 'dateformat';
import moment from "moment";

import InputStats from './InputStats';

function MonthGraph(props) {

    const [months, setMonths] = useState(null)

    const [helpBy, setHelpBy] = useState(null)

    const [dotModal, setDotModal] = useState(false)
    const [dotData, setDotData] = useState(null)

    useEffect(() => {

        let monthsTemp=[]

        fireStore.collection('users').doc(props.dbKey).collection('brandNewStats').doc(props.statName).collection('months').onSnapshot((snap) => {
            snap.docs.map((week) => {
                monthsTemp.push(week.data());
            })
            monthsTemp.sort(function (a, b) {
                return new Date(a.month) - new Date(b.month);
            });
            setMonths(monthsTemp)
        })


        fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(props.data.postData.postId).onSnapshot((snapshot) => {
            if (snapshot.data() && snapshot.data().employee) {
                setHelpBy({name: snapshot.data().employee.name, uid: snapshot.data().employee.uid})
            }
        })

    }, [])

    let CustomizedDot = (e) => <svg x={e.cx} y={e.cy - 40} onClick={() => props.from === 'modal' || props.from === 'statSubmission' ? dot(e) : null } style={{ cursor: 'pointer' }}>
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

    let dot = (e) => {
        setDotModal(true)
        setDotData(e.payload);
    }
    let cancelDotModal = () => {
        setDotModal(false)
        setDotData(null); 
    }

    return (
        <div className='MonthGraph'>
            <ResponsiveContainer width="100%" aspect={ props.from === 'oicGraphs' ? 1.5 : 2}>
                   
                   <ComposedChart
                       data={months}
                       margin={{
                           top: 40, right: 40, left: 10, bottom: 10,
                       }}
                       onClick={ () => props.from !== 'modal' && props.from !== 'statSubmission' ? props.setStatModal(true) : null }
                   >
                       <CartesianGrid strokeDasharray="3 3" />
           
                       <XAxis dataKey='month' tickFormatter={xAxisTickFormatterMonths} height={55} angle={90} dy={20} padding={{ left: -2, right: -2 }} />
           
                       <YAxis type="number" dataKey="total" />
                       <Tooltip content={customTooltipOnYourLineMonth} />
           
                       <Legend />
           
                       <Line
                           dot={CustomizedDot}
                           type="linear"
                           // activeDot={{ onClick: (e) => dot(e) }}
                           dataKey='total' 
                           name={ helpBy && props.from === 'oicGraphs' ? <div>
                           <b>{props.data.name}</b><br /> Held by {helpBy.name} at {props.data.postData.postName}</div> 
                       : props.data.name }
                           stroke="#000000"
                       />
           
                   </ComposedChart>
               </ResponsiveContainer>

               { props.from === 'statSubmission' ? <InputStats statName={props.statName} dbKey={props.dbKey} user={props.currentUser}/> : null }

               {dotData ?
                <Modal
                    visible={dotModal}
                    onCancel={() => cancelDotModal()}
                    footer={null}
                >
                    <h3>Week Ending: {dateFormat(dotData.weekEnding, "mmmm dS")}</h3>
                    <h3>{props.statName}: {dotData.total}</h3>
                    <hr />
                    { dotData.stats.map((day, i) => {
                        
                        return <div key={i}> <Divider orientation="left">{dateFormat(day.date.toDate(), "mmmm dS")} - Total: {day.stat}</Divider>
                            <div>{day.notes.length ? day.notes.map((note, ii) => {
                                return <div style={{ padding: '5px' }}>
                                    <div style={{ paddingLeft: '1em' }}>{note.enteredBy} added {note.statEntered}</div>
                                    {note.text ? <div style={{ paddingLeft: '1em' }}>Note: {note.text}</div> : null }
                                    
                                </div>
                            })
                                
                                : null}</div>
                        </div>
                    }) }
                </Modal>
                : null}

        </div>
    )
}

export default MonthGraph;