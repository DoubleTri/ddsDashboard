import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Button, Col, Row, InputNumber, Input, Select } from 'antd';
import dateFormat from 'dateformat';

const { Option } = Select;

function InputStats(props) {

    const [statData, setStatData] = useState(null)
    const [dataData, setDataData] = useState(null)
    const [weekArr, setWeekArr] = useState(null)
    const [selectedWeek, setSelectedWeek] = useState(null)

    const [statInput, setStatInput] = useState(null)
    const [text, setText] = useState(null)
    //const [stats, setStats] = useState(null)
    const [fullStatData, setFullStatData] = useState([])


    useEffect(() => {

        setStatInput(null)
        setText(null)

        fireStore.collection('users').doc(props.dbKey).collection('stats').doc(props.statName).onSnapshot(async(snap) => {
            setDataData(snap.data().data)
            setStatData(snap.data().stats)
            let weekArrTemp = []
            await snap.data().stats.map((week) => {
                weekArrTemp.push(<Option value={week.name}>{dateFormat(week.name, "mm/d")}</Option>);
            })
            setWeekArr(weekArrTemp)
            setSelectedWeek(weekArrTemp[weekArrTemp.length - 1].props.value)
        })
    }, [props])

    let onInputChange = (e) => {
        setStatInput(e);
    }
    let onTextChange = (e) => {
        setText(e.target.value);
    }
    let handleChange = (value) => {
        setSelectedWeek(value)
      }

    let submitStat = () => {

        let stats = statData
        let notes = { date: new firebase.firestore.Timestamp.now(), statEntered: statInput, text: text, enteredBy: props.user.displayName }

        stats[stats.indexOf(stats.find(o => o.name === selectedWeek))].notes = stats[stats.indexOf(stats.find(o => o.name === selectedWeek))].notes.concat(notes)
        stats[stats.indexOf(stats.find(o => o.name === selectedWeek))].stat = stats[stats.indexOf(stats.find(o => o.name === selectedWeek))].stat + statInput

        fireStore.collection('users').doc(props.dbKey).collection('stats').doc(props.statName).update({ stats: stats })

        setStatInput(null)
        setText(null)

    }

    return (<div>


        <Row justify="center" style={{ padding: '2em' }}>

            <Col span={5}>
                <Select value={selectedWeek} style={{ width: 120 }} onChange={handleChange}>
                    {weekArr}
                </Select>
            </Col>
            <Col span={3}><InputNumber onChange={(e) => onInputChange(e)} placeholder="Stat" value={statInput} /></Col>
            <Col span={13}><Input onChange={onTextChange} placeholder="Enter any notes" value={text}></Input></Col>
            <Col span={1}><Button onClick={() => { submitStat() }} disabled={statInput ? false : true} >Submit</Button></Col>

        </Row>




    </div>)
}

export default InputStats