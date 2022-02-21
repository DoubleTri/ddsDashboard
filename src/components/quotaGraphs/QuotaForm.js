import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Button, message } from 'antd';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from "moment";
import QuotaInput from './QuotaInput';
import { InfoCircleOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/Context';

function QuotaForm() {

    const [thisMonth, setThisMonth] = useState(null)

    const [currrentMonth, setCurrentMonth] = useState(null)
    const [workDays, setWorkDays] = useState([])
    const [daysSet, setDaysSet] = useState(false)
    const [statSelected, setStatSelected] = useState(null)
    const [changed, setChanged] = useState(null)
    const [statAdded, setStatAdded] = useState(null)

    const [quotasFromDb, setQuotasFromDb] = useState()

    const { dbKey } = useContext(AuthContext);

    let d = new Date();
    let currentMonth = d.getMonth()
    let year = d.getFullYear()

    useEffect(() => {
   
        if (dbKey) {
            let allData;
            let month;
            let formattedDates = []
            let tempQuotas = []

            let workingDaysTemp = []

            fireStore.collection('users').doc(dbKey).collection('quotaGraphs').get().then(async(snapshot) => {
                await snapshot.docs.map(doc => {

                    doc.data().workingDays.forEach((workDay) => {
                        workingDaysTemp.push(workDay.toDate())
                    })

                    if (doc.data().id === moment(new Date(year, currentMonth)).format('MMMMYYYY')) {
                        allData = doc.data()
                        month = doc.data().id
                        setCurrentMonth(doc.data().id);
                    } 
                })

            }).then(() => {

                fireStore.collection('users').doc(dbKey).collection('brandNewStats').get().then((snapshot) => {
                    snapshot.docs.map((doc) => {
                        if (doc.data().quotaGraph) {
                            tempQuotas.push({ stat: doc.data().id })
                            // fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(doc.data().id).collection('months').get().then(async (snapshotTwo) => {
                            //     snapshotTwo.docs.forEach((doc) => {
                            //         console.log(doc.data());
                            //     })
                            // })
                        }
                    })
                    setQuotasFromDb(tempQuotas);
                    changeStat(changed ? changed : tempQuotas[0])
                })

                // fireStore.collection('users').doc(dbKey).collection('quotaGraphs').doc(month).collection('stats').get().then(async(snapshot) => {
                //     await snapshot.docs.map(doc => {
                //         tempQuotas.push({ stat: doc.id, quota: doc.data().data.quota, stats: doc.data().stats, total: doc.data().total })
                //     })
                //     setQuotasFromDb(tempQuotas);
                //     changeStat(changed ? changed : tempQuotas[0])
                    
                // })
            }).then(async() => {
                if (allData.workingDays.length) {
                    await allData.workingDays.map((date) => {
                        formattedDates.push(new Date(date.toDate()));
                    })
                    setWorkDays(workingDaysTemp)
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

    let submitWorkDays = () => {
        console.log(workDays);
        fireStore.collection('users').doc(dbKey).collection('quotaGraphs').doc(currrentMonth).update({
            workingDays: workDays
        })
        setDaysSet(true)
    }

    let changeStat = (stat) => {
        console.log(stat);
        setStatSelected(stat)
    }
 

    let pStyle = { backgroundColor: '#ffffff85', boxShadow: '4px 4px 12px 4px #888888', borderRadius: '5px' }

    return (
        <Row justify='center' align="top" style={{ margin: '3em' }}>

            

                <Col className="quotaGraph" span={6} style={{ display: 'flex', justifyContent: 'center', ...pStyle }}>
                    <div style={{ justifyContent: 'center' }} >
                        <DayPicker
                            selectedDays={workDays}
                            onDayClick={handleDayClick}
                            canChangeMonth={false}
                        />
                        {/* {daysSet ?
                            <p className='linkText' style={{ textAlign: 'right' }} onClick={() => setDaysSet(false)}>Edit Work Days</p>
                            :
                            <Button className='linkText' style={{ textAlign: 'right'}} onClick={() => submitWorkDays()}>Submit</Button>
                        } */}
                    </div>
                </Col>

    

            { statSelected ? <Col span={16} >

                <div className="quotaGraphSelectContainer">{ quotasFromDb ? quotasFromDb.map((quotaItem, i) => {
                     return <div key={i} className='linkText quotaStatOption' onClick={() => changeStat(quotaItem)} style={statSelected.stat === quotaItem.stat ? { textDecoration: 'underline', fontWeight: 'bold', color: '#dddddd' } : {color: '#dddddd'} } > {quotaItem.stat}</div>
                }) : null }</div>

                <QuotaInput 
                    statSelected={statSelected} 
                    workDays={workDays} 
                    dbKey={dbKey} 
                    currrentMonth={currrentMonth} 
                    setStatAdded={setStatAdded}
                    setChanged={setChanged}
                    />
                </Col>
                
                : null}
        </Row>
    );
}

export default QuotaForm; 