import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Button, message } from 'antd';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import QuotaGrpahs from '../quotaGraphs/QuotaGraph';
import { InfoCircleOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/Context';

function OICQuotaGraphs() {

    const [currrentMonth, setCurrentMonth] = useState(null)
    const [workDays, setWorkDays] = useState([])
    const [daysSet, setDaysSet] = useState(false)
    const [statSelected, setStatSelected] = useState(null)
    const [changed, setChanged] = useState(null)
    const [statAdded, setStatAdded] = useState(null)

    const [quotasFromDb, setQuotasFromDb] = useState()

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {
   
        if (dbKey) {
            let allData;
            let month;
            let formattedDates = []
            let tempQuotas = []
            fireStore.collection('users').doc(dbKey).collection('quotaGraphs').get().then(async(snapshot) => {
                await snapshot.docs.map(doc => {
                    if (doc.data().current) {
                        allData = doc.data()
                        month = doc.data().id
                        setCurrentMonth(doc.data().id);
                    } 
                })
            }).then(() => {
                fireStore.collection('users').doc(dbKey).collection('quotaGraphs').doc(month).collection('stats').get().then(async(snapshot) => {
                    await snapshot.docs.map(doc => {
                        tempQuotas.push({ stat: doc.id, quota: doc.data().data.quota, stats: doc.data().stats, total: doc.data().total})
                    })
                    setQuotasFromDb(tempQuotas);
                    changeStat(changed ? changed : tempQuotas[0])
                    
                })
            }).then(async() => {
                if (allData.workingDays.length) {
                    await allData.workingDays.map((date) => {
                        formattedDates.push(new Date(date.toDate()));
                    })
                    setWorkDays(formattedDates)
                    setDaysSet(true)
                }
            })
        }
    }, [dbKey, changed, statAdded])


    let handleDayClick = (day, { selected }) => {
        if (!daysSet) {
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
        } else {
            message.error('work days are set')
        }
    }

    let changeStat = (stat) => {
        setStatSelected(stat)
    }
 

    return (
        <Row justify='center' align="top" style={{ marginTop: '3em' }}>

            {daysSet && statSelected ? <Row justify='space-between' align="top" >

                {quotasFromDb ? quotasFromDb.map((quotaItem, i) => {
                    console.log(quotaItem);
                    return <Col span={8} key={i} className='oicGraphs' style={{ padding: '1em' }}>
                        <div style={{ textAlign: 'center' }}>{quotaItem.stat}</div>
                        <QuotaGrpahs
                            currrentMonth={currrentMonth}
                            workDays={workDays}
                            statSelected={quotaItem}
                            quota={quotaItem.quota}
                            dbKey={dbKey}
                            setChanged={setChanged}
                            setStatAdded={setStatAdded}
                        /></Col>
                }) : null}
                
            </Row>

                : null}
        </Row>
    );
}

export default OICQuotaGraphs; 