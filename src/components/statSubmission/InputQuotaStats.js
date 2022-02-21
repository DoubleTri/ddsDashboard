import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Button, Col, Row, InputNumber, Input, Select } from 'antd';
import dateFormat from 'dateformat';

import { AuthContext } from '../../context/Context';

const { Option } = Select;

function InputQuotaStats(props) {

    const [statData, setStatData] = useState(null)
    const [dataData, setDataData] = useState(null)
    const [weekArr, setWeekArr] = useState(null)
    const [dayArr, setDayArr] = useState(null)
    const [selectedDay, setSelectedDay] = useState(null)
    const [selectedDayData, setSelectedDayData] = useState(null)

    const [statInput, setStatInput] = useState(null)
    const [text, setText] = useState(null)
    //const [stats, setStats] = useState(null)
    const [fullStatData, setFullStatData] = useState([])

    const { dbKey, userInfo, currentUser, workingDays, activeMonth } = useContext(AuthContext);
    
    useEffect(() => {

        setStatInput(null)
        setText(null)

        if (workingDays) {
            let dayArrTemp = []
            workingDays.map((day, i) => {
                dayArrTemp.push(<Option data={day} value={i}>{dateFormat(day, "mmmm dS")}</Option>);
            })
            setDayArr(dayArrTemp)
        }

    }, [workingDays])

    let onInputChange = (e) => {
        setStatInput(e);
    }
    let onTextChange = (e) => {
        setText(e.target.value);
    }
    let handleChange = (value, data) => {
        setSelectedDay(value)
        setSelectedDayData(data.data)
      }

    let submitStat = () => {

        let stats = statData
        let data = { name: selectedDayData, index: selectedDay, date: new firebase.firestore.Timestamp.now(), statEntered: statInput, text: text, enteredBy: props.user.displayName }

        fireStore.collection('users').doc(props.dbKey).collection('stats').doc(props.statName).collection('quotaData').doc(activeMonth).update({
            'stats': firebase.firestore.FieldValue.arrayUnion(data)
        });
 

        setStatInput(null)
        setText(null)

    }

    return (<div>


        <Row justify="center" style={{ padding: '2em' }}>

            <Col span={5}>
                <Select value={selectedDay} style={{ width: 120 }} onChange={(value, data) => handleChange(value, data)}>
                    {dayArr}
                </Select>
            </Col>
            <Col span={3}><InputNumber onChange={(e) => onInputChange(e)} placeholder="Stat" value={statInput} /></Col>
            <Col span={13}><Input onChange={onTextChange} placeholder="Enter any notes" value={text}></Input></Col>
            <Col span={1}><Button onClick={() => { submitStat() }} disabled={statInput ? false : true} >Submit</Button></Col>

        </Row>




    </div>)
}

export default InputQuotaStats