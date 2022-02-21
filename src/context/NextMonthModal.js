import React, { useEffect, useState } from 'react';
import { fireStore, auth, functions } from '../firebase';
import firebase from 'firebase/app';
import { Row, Col, Button, message } from 'antd';
import moment from "moment";
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

let d = new Date();
let month = d.getMonth()
let year = d.getFullYear()

function NextMonthModal(props) {

    const [workDays, setWorkDays] = useState([])
    //const [daysSet, setDaysSet] = useState(false)
    const [nextMonth, setNextMonth] = useState(null)
    const [thisMonth, setThisMonth] = useState(null)
    const [lastWeekEnding, setLastWeekEnding] = useState(null)
    const [lastWeekId, setLastWeekId] = useState(null)

    useEffect(() => {
        setNextMonth(new Date(year, month + 1));
        setThisMonth(new Date(year, month))
        fireStore.collection("users").doc(props.dbKey).get().then((snap) => {
            setLastWeekEnding(snap.data().lastWeekEnding);
        })
    }, [])

    let handleDayClick = (day, { selected }) => {
        
            const selectedDays = workDays.concat();
            if (selected) {
                const selectedIndex = selectedDays.findIndex(selectedDay =>
                    DateUtils.isSameDay(selectedDay, day)
                );
                selectedDays.splice(selectedIndex, 1);
            } else {
                selectedDays.push(day);
            }

            selectedDays.sort(function (a, b) {
                return new Date(a) - new Date(b);
            });

            setWorkDays(selectedDays);
    }

                                        // ------------------- EMULATOR STUFF ----------------------------
                                        firebase.auth().useEmulator('http://localhost:9099/');
                                        functions.useEmulator("localhost", 5001);
                                        // ---

    let submitWorkDays = () => {
        if (workDays.length) {
            //console.log(Date.parse(moment(nextMonth).format('MMMMYYYY')))
            let docName = moment(nextMonth).format('MMMMYYYY')
            fireStore.collection('users').doc(props.dbKey).collection('quotaGraphs').doc(docName).set({
                current: false,
                id: docName,
                month: moment(nextMonth).format('MMMM'),  
                workingDays: workDays
            })
            fireStore.collection('users').doc(props.dbKey).update({
                setNextMonth: false
            })
            props.setNextMonthModal(false)
            let parsedWorkDays = []
            workDays.forEach((day) => {
                parsedWorkDays.push(Date.parse(day));
            })

            var monthEndingFunction = firebase.functions().httpsCallable('monthEndingFunction');
            monthEndingFunction({ dbKey: props.dbKey, workDays: parsedWorkDays, lastWeekEnding: lastWeekEnding, month: Date.parse(moment(nextMonth).format('MMMMYYYY')) });

        } else {
            message.error('Some days must be selected')
        }
    }

    return (
        <div className='nextMonthModal'>
           
           <div style={{ textAlign: 'center' }}><h2>Please Select Next Month's Work Days</h2></div>
            <div style={{  margin: '0 auto', display: 'table' }}>
                <DayPicker
                    selectedDays={workDays}
                    onDayClick={handleDayClick}
                    canChangeMonth={false}
                    month={nextMonth}
                />
            </div>
            <Button onClick={() => submitWorkDays()}>Submit</Button>

        </div>
    )
}

export default NextMonthModal;