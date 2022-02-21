import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Button, message } from 'antd';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import QuotaGrpahs from '../quotaGraphs/QuotaGraph';
import { InfoCircleOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/Context';

function HomePageQuotaGraphs() {

    const [currrentMonth, setCurrentMonth] = useState(null)
    const [workDays, setWorkDays] = useState([])
    const [daysSet, setDaysSet] = useState(false)
    const [statSelected, setStatSelected] = useState(null)
    const [changed, setChanged] = useState(null)
    const [statAdded, setStatAdded] = useState(null)

    const [quotaGraphSelected, setQuotaGraphSelected] = useState('COLLECTIONS')
    const [graphData, setGraphData] = useState()

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
                        tempQuotas.push({ stat: doc.id, quota: doc.data().data.quota, stats: doc.data().stats, total: doc.data().total })
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

    let style = (quotaItem) => {
        return {textAlign: 'center', 
            cursor: 'pointer',
            fontWeight: quotaGraphSelected === quotaItem.stat ? 'bold' : null, 
            textDecoration: quotaGraphSelected === quotaItem.stat ? 'underline' : null 
        }
    }

    let selectGraph = (quotaItem) => {
        setQuotaGraphSelected(quotaItem.stat)
        setGraphData(quotaItem)
    }

    return (
        <div>

            {daysSet && statSelected ? <Row justify="center" align="top" >

                {quotasFromDb ? quotasFromDb.map((quotaItem, i) => {
                    return <Col span={8} key={i}>
                        <div style={style(quotaItem)} onClick={() => selectGraph(quotaItem)}>{quotaItem.stat}</div>
                        { !graphData ? selectGraph(quotasFromDb[0]) : null} 
                    </Col>
                }) : null}
                {graphData ?
                    <Col span={24} >
                        <QuotaGrpahs
                            currrentMonth={currrentMonth}
                            workDays={workDays}
                            statSelected={graphData}
                            quota={graphData.quota}
                            dbKey={dbKey}
                            setChanged={setChanged}
                            setStatAdded={setStatAdded}
                            from='homePage'
                        /></Col> : null}
                
            </Row>

                : null}
        </div>
    );
}

export default HomePageQuotaGraphs; 