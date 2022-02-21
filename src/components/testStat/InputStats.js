import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Button, Col, Row, InputNumber, Input, Select } from 'antd';
import dateFormat from 'dateformat';

import { AuthContext } from '../../context/Context';

const { Option } = Select;

function InputStats(props) {

    const [statData, setStatData] = useState(null)
    const [dataData, setDataData] = useState(null)
    const [dayArr, setDayArr] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)

    const [statInput, setStatInput] = useState(null)
    const [text, setText] = useState(null)
    //const [stats, setStats] = useState(null)
    const [fullStatData, setFullStatData] = useState([])

    const { dbKey, currentUser } = useContext(AuthContext);

    useEffect(() => {

        setStatInput(null)
        setText(null)

        let dayArrTemp = []

        if (dbKey) {

                fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('days').onSnapshot(async (snap) => {

                    var d = new Date();
                    d.setUTCHours(23,59,0,0);
                    var n = d.getTime();

                    let allDays = []
                    snap.docs.map((day) => {
     
                        if (n > day.data().name) {
                            allDays.push(day.data())
                        }
                    })
                    allDays.sort(function (a, b) {
                        return new Date(a.name) - new Date(b.name);
                    });

                    let limitedDays = allDays.slice(Math.max(allDays.length - 14, 0))

                    await limitedDays.map((day) => {
                        
                            dayArrTemp.push(<Option id={day.id} value={day.name}>{dateFormat(day.name, "mm/d")}</Option>);
                        
                    })
                   
                    setSelectedDate({ value: limitedDays[13].name, data: limitedDays[13] }) 
                    
                    setDayArr(dayArrTemp.reverse())
                })
        } 

    }, [dbKey, props])

    let onInputChange = (e) => {
        setStatInput(e);
    }
    let onTextChange = (e) => {
        setText(e.target.value);
    }
    let handleChange = (value, data) => {
        setSelectedDate({value: value, data: data})
      }

    let submitStat = () => {

        let notes = { date: new firebase.firestore.Timestamp.now(), statEntered: statInput, text: text, enteredBy: props.user.displayName }
       
        fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('days').where('id', '==', selectedDate.data.id).get().then((snap) => {
            let dayObj = snap.docs[0].data()
            fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('days').doc(dayObj.id).update({ 
                date: dayObj.date,
                id: dayObj.id,
                name: dayObj.name, 
                notes: dayObj.notes.concat(notes),
                stat: dayObj.stat + statInput
            })
        })
        fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('weeks').where('dayIdArr',  "array-contains", selectedDate.data.id).get().then((snap) => {
            let weekObj = snap.docs[0].data() 
            let selectedDay = weekObj.stats[weekObj.stats.indexOf(weekObj.stats.find(o => o.id === selectedDate.data.id))]
            let selectedDayIndex = weekObj.stats.indexOf(weekObj.stats.find(o => o.id === selectedDate.data.id))
            weekObj.stats[selectedDayIndex] = {
                date: selectedDay.date,
                id: selectedDay.id,
                name: selectedDay.name, 
                notes: selectedDay.notes.concat(notes),
                stat: selectedDay.stat + statInput
            }
            weekObj.total = weekObj.total + statInput
            fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('weeks').doc(weekObj.id).update({
                dayIdArr: weekObj.dayIdArr,
                id: weekObj.id,
                stats: weekObj.stats,
                total: weekObj.total,
                weekEnding: weekObj.weekEnding, 
                //weekEndingString: weekObj.weekEndingString 
            })

        })
        fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('months').where('dayIdArr',  "array-contains", selectedDate.data.id).get().then((snap) => {
            let monthObj = snap.docs[0].data() 
            let selectedDay = monthObj.stats[monthObj.stats.indexOf(monthObj.stats.find(o => o.id === selectedDate.data.id))]
            let selectedDayIndex = monthObj.stats.indexOf(monthObj.stats.find(o => o.id === selectedDate.data.id))
            monthObj.stats[selectedDayIndex] = {
                date: selectedDay.date,
                id: selectedDay.id,
                name: selectedDay.name, 
                notes: selectedDay.notes.concat(notes),
                stat: selectedDay.stat + statInput
            }
            fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(props.statName).collection('months').doc(monthObj.id).update({
                dayIdArr: monthObj.dayIdArr,
                id: monthObj.id,
                month: monthObj.month,
                stats: monthObj.stats,
                total: monthObj.total + statInput
            })

        })

        setStatInput(null)
        setText(null)

        if (props.from === 'inputModal') {
            props.setInputModal(false)
        } 

    }

    return (<div>


        <Row justify="center" style={{ padding: '2em' }}>

        { props.from === 'inputModal' ? <Col span={24} style={{ textAlign: 'center', marginBottom: '2em' }}><b>{props.statName}</b> </Col>: null }

            <Col span={5}>
                <Select value={selectedDate ? selectedDate.value : null} style={{ width: 120 }} onChange={handleChange} dropdownAlign={'bottom'}>
                    {dayArr}
                </Select>
            </Col>
            <Col span={3}><InputNumber onChange={(e) => onInputChange(e)} placeholder="Stat" value={statInput} /></Col>
            <Col span={13}><Input onChange={onTextChange} placeholder="Enter any notes" value={text}></Input></Col>
            <Col span={1}><Button onClick={() => { submitStat() }} disabled={statInput ? false : true} >Submit</Button></Col>

        </Row>




    </div>)
}

export default InputStats