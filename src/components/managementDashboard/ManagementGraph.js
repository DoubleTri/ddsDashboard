import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Modal, Button, Popconfirm } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import dateFormat from 'dateformat';

import InputStats from '../statSubmission/InputStats'

import { AuthContext } from '../../context/Context';

function ManagementGraph(props) {

    // const [clickedDot, setClickedDot] = useState(null)
    // const [openDataPoint, setOpenDataPoint] = useState(null)
    // const [dataEdit, setDataEdit] = useState(false)
    // const [editNumber, setEditNumber] = useState(null)
    const [graphModal, setGraphModal] = useState(false)
    const [statData, setStatData] = useState(null)
    const [fullStatData, setFullStatData] = useState(null)
    const [dataData, setDataData] = useState(null)

    const [dotModal, setDotModal] = useState(false)
    const [dotData, setDotData] = useState(null)

    const [helpBy, setHelpBy] = useState(null)
    const [postName, setPostName] = useState(null)

    const [inputModal, setInputModal] = useState(false)

    const { dbKey, userInfo, currentUser } = useContext(AuthContext);

    useEffect(() => {
            console.log(props);
            fireStore.collection('users').doc(props.dbKey).collection('stats').doc(props.statName).onSnapshot((snap) => {
                if (snap.data()) {
                    setDataData(snap.data().data)
                    setStatData(snap.data().stats.slice(snap.data().stats.length >= 12 ? snap.data().stats.length - 12 : 0, snap.data().stats.length))
                    setFullStatData(snap.data().stats)
                }
                if (snap.data() && snap.data().data.postData) {
                    setPostName(snap.data().data.postData.postName)
                    fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(snap.data().data.postData.postId).onSnapshot((snapshot) => {
                        if (snapshot.data() && snapshot.data().employee) {
                            setHelpBy({name: snapshot.data().employee.name, uid: snapshot.data().employee.uid})
                        }
                    })
                }
            })
    }, [props])

    // let editDataPoint = () => {
    //     setDataEdit(true)
    // }

    // let closeDot = () => {
    //     setOpenDataPoint(false)
    //     setClickedDot(null)
    // }

    let dot = (e) => {
        if (graphModal || props.from === 'statSubmission') {
            setDotData(e.payload);
            setDotModal(true)
            //setOpenDataPoint(true)
        }
    }
    let closeDotModal = () => {
        setDotModal(false)
        setDotData(null);
    }

    let closeInputModal = () => {
        setInputModal(false)
    }

    // ----- EDIT DATA POINT -------

    // let editNum = (e) => {
    //     setEditNumber(e)
    // }
    // let editTxt = (e) => {
    //     setEditText(e.target.value)
    // }
    // let submitEdit = (stats) => {
    //     setDataEdit(false)
    //     //let statLocation = '.stats'
    //     clickedDot.edit = { editBy: currentUser.displayName, editText: editText, editNumber: editNumber, editDate: new firebase.firestore.Timestamp.now(), oldStat: stats[stats.indexOf(stats.find(o => o.name === clickedDot.name))].stat }
    //     stats[stats.indexOf(stats.find(o => o.name === clickedDot.name))] = clickedDot
    //     stats[stats.indexOf(stats.find(o => o.name === clickedDot.name))].stat = editNumber
    //     fireStore.collection("users").doc(dbKey).collection(props.item.id).doc('stats').update({ stats : stats })
    // }

    // ----- EDIT DATA POINT -------

    let CustomizedDot = (e) => <svg x={e.cx} y={e.cy - 40} onClick={() => dot(e)} style={{ cursor: 'pointer'}}> 
        <text transform={`rotate(90)`} >{e.value}</text>
        </svg>
    

    let xAxisTickFormatter = (date) => {
        return dateFormat(date, "mm/d");
    }

    let customTooltipOnYourLine = (e) => {
        if (e.active && e.payload != null && e.payload[0] != null) {
            return (<div className="custom-tooltip" style={{ border: '1px, solid, gray', background: 'white', padding: '5px' }}>
                <p><b>STAT: {e.payload[0].payload.stat}</b></p>
                <p>{dateFormat(new Date(e.payload[0].payload.name), "mmmm dS")}</p>
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

    // let style = dataData && dataData.upsideDown ? 
    //     {boxShadow: statData[statData.length - 1].stat >= statData[statData.length - 2].stat ? 
    //         '0px 0px 4px 0px #a93c2d' : '0px 0px 4px 0px #22812e' } 
    //     :
    //     {boxShadow: statData[statData.length - 1].stat <= statData[statData.length - 2].stat ? 
    //         '12px 12px 25px #a93c2d, -10px -10px 25px #ffffff' : '12px 12px 25px #22812e, -10px -10px 25px #ffffff' } 

    let style = (item) => {
        return item ? { boxShadow: item[item.length - 1].stat <= item[item.length - 2].stat ? 
            '5px 5px 20px #a93c2d' : '5px 5px 20px green' } : null 
    }
 

// the styling is determined by className passed to this component (because it's called from multiple places)
    return <div className={props.from} style={props.from === 'oicGraphs' ? style(statData) : null } > 

        <div style={{ textAlign: 'center', padding: '15px' }}>
            {helpBy && props.from === 'oicGraphs' ? helpBy.name + ': ' : null}{postName ? postName : null}
            { console.log(props.from) }
        </div>

        <ResponsiveContainer width="100%" aspect={2}>
            <LineChart
                data={statData}
                margin={{
                    top: 40, right: 40, left: 10, bottom: 10,
                }}
                //className={props.from} 
                onClick={() => props.from !== 'statSubmission' ? setGraphModal(true) : null }
                isAnimationActive={false}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={xAxisTickFormatter} height={55} angle={90} dy={20} padding={{ left: -2, right: -2 }} />

                <YAxis type="number" dataKey="stat" />
                {/* <Tooltip content={customTooltipOnYourLine} /> */}

                <Legend />
                <Line
                    dot={CustomizedDot} 
                    type="linear" 
                    // activeDot={{ onClick: (e) => dot(e) }}
                    dataKey='stat' name={props.statName}
                    stroke="#000000"
                />
                
                {fullStatData && props.from === 'statSubmission' ?
                    <Brush
                        dataKey="name"
                        tickFormatter={xAxisTickFormatter}
                        stroke="#000000"
                        startIndex={fullStatData.length >= 12 ? fullStatData.length - 12 : 0}
                        endIndex={fullStatData.length - 1}
                    >

                        <LineChart
                            data={statData}
                        >
                            <YAxis hide={true} reversed={dataData.upsideDown} />
                            <Line dataKey="stat" stroke="#8884d8" label={false} />
                        </LineChart>

                    </Brush>
                    : null}

            </LineChart>
        </ResponsiveContainer>

        {dataData && fullStatData ?
            <Modal
                visible={graphModal}
                onCancel={() => setGraphModal(false)}
                width={'80%'}
                footer={null}
            >

                <ResponsiveContainer width="100%" aspect={2}>
                    <LineChart
                        data={fullStatData}
                        margin={{
                            top: 40, right: 40, left: 10, bottom: 10,
                        }}
                        //className={}
                        onClick={() => setGraphModal(true)}
                        style={style}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickFormatter={xAxisTickFormatter} height={55} angle={90} dy={20} padding={{ left: -2, right: -2 }} />

                        <YAxis type="number" dataKey="stat" />
                        <Tooltip content={customTooltipOnYourLine} />

                        <Legend />
                        <Line
                            dot={CustomizedDot} 
                            type="linear"
                            // activeDot={{ onClick: (e) => dot(e) }}
                            dataKey='stat' name={props.statName}
                            stroke="#7B98A1"
                        />

                        <Brush
                            dataKey="name"
                            tickFormatter={xAxisTickFormatter}
                            stroke="#000000"
                        startIndex={fullStatData.length >= 12 ? fullStatData.length - 12 : 0}
                        endIndex={fullStatData.length - 1}
                        >

                            <LineChart
                                data={statData}
                            >
                                <YAxis hide={true} reversed={dataData.upsideDown} />
                                <Line dataKey="stat" stroke="#8884d8" label={false} />
                            </LineChart>

                        </Brush>

                    </LineChart>
                </ResponsiveContainer>
                { props.from === 'post' && userInfo.admin ? 
                    <Popconfirm placement="leftTop" title={`Are you sure you want to delete ${props.statName}?`} onConfirm={() => [props.deleteStat(props.statName), setGraphModal(false)]} okText="Yes" cancelText="No">
                        <div style={{ color: 'red', float: 'right', cursor: 'pointer' }}>Delete</div>
                    </Popconfirm>
                : null }

            </Modal>
            : null}



{dotData ?
            <Modal
                visible={dotModal}
                onCancel={() => closeDotModal()}
                footer={null}
            >
        
            <div>
                <p>{props.statName}</p>
                <p><b>STAT: {dotData.stat}</b></p>
                <p>{dateFormat(new Date(dotData.name), "mmmm dS")}</p>
                <hr />
                {dotData.notes.map((note, i) => {
                    console.log(dateFormat(note.date.toDate(), "mmmm dS - hh:MM TT" ))
                    return <div key={i}>
                        <span style={{ color: 'gray' }}>
                            {note.enteredBy} {dateFormat(note.date.toDate(), "mmmm dS - hh:MM TT")} 
                        </span>: {note.text}
                    </div>
                })}
            </div> 


            </Modal>
            : null}

{/* <InputStats statName={graph} from='statSubmission' dbKey={dbKey} user={currentUser}/> */}

        <Modal
            visible={inputModal}
            onCancel={() => closeInputModal()}
            width={'50%'}
            footer={null}
        >

        <InputStats statName={props.statName} from='oic' dbKey={dbKey} user={currentUser}/>

        </Modal>

    </div>
  
}

export default ManagementGraph;