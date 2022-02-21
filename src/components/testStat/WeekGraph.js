import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Modal, Button, Popconfirm, Radio, Divider } from 'antd';
import { ComposedChart, LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import dateFormat from 'dateformat';
import moment from "moment";

import InputStats from './InputStats';

function WeekGraph(props) {

    const [statData, setStatData] = useState(null)
    const [fullStatData, setFullStatData] = useState(null)

    const [helpBy, setHelpBy] = useState(null)
    
    const [dotModal, setDotModal] = useState(false)
    const [dotData, setDotData] = useState(null)

    const [inputModal, setInputModal] = useState(false)

    useEffect(() => {

        setStatData(props.weeks.slice(props.weeks.length >= 12 ? props.weeks.length - 12 : 0, props.weeks.length))
        setFullStatData(props.weeks)

        fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(props.data.postData.postId).onSnapshot((snapshot) => {
            if (snapshot.data() && snapshot.data().multiEmployee) {
                setHelpBy(null)
            } else if (snapshot.data() && snapshot.data().employee) {
                setHelpBy({name: snapshot.data().employee.name, uid: snapshot.data().employee.uid})
            }
        })

    }, [props.weeks])


    let CustomizedDot = (e) => <svg x={e.cx} y={e.cy - 40} onClick={() => props.from === 'modal' || props.from === 'statSubmission' ? dot(e) : null } style={{ cursor: 'pointer' }}>
        <text transform={`rotate(90)`} >{e.value}</text>
    </svg>


    let xAxisTickFormatterWeeks = (date) => {
        return dateFormat(date, "mm/d");
    }

    let customTooltipOnYourLineWeek = (e) => {
        if (e.active && e.payload != null && e.payload[0] != null) {

            return (<div className="custom-tooltip" style={{ border: '1px, solid, gray', background: 'white', padding: '5px' }}>
                <p style={{ textAlign: 'center' }}><b>{e.payload[0].payload.total}</b></p>
                <p>Week Ending: {dateFormat(e.payload[0].payload.weekEnding, "mmmm dS")}</p>
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

    let style = (item) => {
        return item ? { boxShadow: item[item.length - 1].total <= item[item.length - 2].total ? 
            '5px 5px 20px #a93c2d' : '5px 5px 20px green' } : null 
    }

    return (
        <div className='WeekGraph' className={props.from} style={props.from === 'oicGraphs' ? style(statData) : null } >

            {helpBy && helpBy.uid === props.currentUser.uid && props.from === 'oicGraphs' ?
                <Button className='btnSecondary' style={{ float: 'right', margin: '5px' }} onClick={() => setInputModal(true)}>+</Button>
                : null}

            <div style={{ textAlign: 'center', padding: '15px' }}>

                {/* {dataData && dataData.quotaGraph ?
                    quotaActive ?
                        <Button className='btnSecondary' style={{ float: 'left' }} onClick={() => setQuotaActive(false)}>Weekly</Button>
                        :
                        <Button className='btnSecondary' style={{ float: 'left' }} onClick={() => setQuotaActive(true)}>Quota</Button>
                    : null} */}

            </div>

        { statData && fullStatData ? 
            <ResponsiveContainer width="100%" aspect={ props.from === 'oicGraphs' ? 1.5 : 2}>

                <ComposedChart
                    data={props.from === 'statSubmission' || props.from === 'modal' ? fullStatData : statData}
                    margin={{
                        top: 40, right: 40, left: 10, bottom: 10,
                    }}
                    onClick={ () => props.from !== 'modal' && props.from !== 'statSubmission' ? props.setStatModal(true) : null }
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey='weekEnding' tickFormatter={xAxisTickFormatterWeeks} height={55} angle={90} dy={20} padding={{ left: -2, right: -2 }} />

                    <YAxis type="number" dataKey="total" />
                    <Tooltip content={customTooltipOnYourLineWeek} />

                    <Legend show={false} />

                    <Line
                        dot={CustomizedDot}
                        type="linear"
                        // activeDot={{ onClick: (e) => dot(e) }}
                        dataKey='total' 
                        name={ props.from === 'oicGraphs' ? 
                        
                            <div>
                                <b>{props.data.name}</b><br /> {helpBy ? `Held by ${helpBy.name} at ${props.data.postData.postName} `: null} 
                            </div> 

                        : props.data.name }
                        stroke="#000000"
                    />

                        { props.from === 'statSubmission' || props.from === 'modal' ?
                            <Brush
                                dataKey="weekEnding"
                                tickFormatter={xAxisTickFormatterWeeks}
                                stroke="#000000"
                                startIndex={fullStatData.length >= 12 ? fullStatData.length - 12 : 0}
                                endIndex={fullStatData.length - 1}
                            >

                                <LineChart
                                    data={statData}
                                >
                                    <YAxis hide={true} reversed={false} />
                                    <Line dataKey="total" stroke="#8884d8" label={false} />
                                </LineChart>

                            </Brush>
                            : null}

                </ComposedChart>
            </ResponsiveContainer>
            : null}

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

            <Modal
                visible={inputModal}
                onCancel={() => setInputModal(false)}
                footer={null}
                width={'60%'}
            >
            <InputStats statName={props.statName} dbKey={props.dbKey} user={props.currentUser} setInputModal={setInputModal} from='inputModal' />
            </Modal>

        </div>
    )
}

export default WeekGraph;