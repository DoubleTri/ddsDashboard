//import "./styles.css";
import React, {useState, useEffect} from "react";
import { Modal, Button, Input, Row, Col } from 'antd'
import { fireStore } from '../../firebase';
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import moment from "moment";

import TestStatWrapper from '../testStat/TestStatWrapper'


function QuotaGraph(props) {

    const [data, setData] = useState(null)
    const [statModelOpen, setStatModelOpen] = useState(false)
    const [dayData, setDayData] = useState(null)
    const [stat, setStat] = useState(null)
    const [total, setTotal] = useState(null)
    const [daysRemaining, setDaysRemaining] = useState(null)

    useEffect(() => {
        // //console.log(props.statSelected);
        // if (props.statSelected.stats.length) {
        //     setData(props.statSelected.stats)
        //     setDaysRemaining(props.statSelected.stats.filter(e => e['Day'] ===  null).length);
        //     setTotal(props.statSelected.total);
        // } else {
        //     let tempData = []
        //     props.workDays.map((workDay, i) => {
        //         let quota = parseInt(((i + 1) * ( (props.quota)/(props.workDays.length) )).toFixed(2))
        //         let bonus = parseInt( (( (i + 1) * ((props.quota)/(props.workDays.length)) ) * 1.25 ).toFixed(2))
        //         tempData.push({
        //             name: moment(workDay).format('MM/DD'),
        //             Day: null,
        //             Month: null,
        //             Quota: quota,
        //             Bonus: bonus,
        //             amt: 0,
        //             index: i
        //         })
        //     })
        //     setData(tempData)
        // }
    }, [props])

    let openModel = (data) => {
        setDayData(data)
        setStatModelOpen(true)
    }
    let closeModel = () => {
        setStatModelOpen(false) 
        setDayData(null)
    }
    let onChangeStat = (e) => {
        setStat(e.target.value);
    }
    let submit = () => {
        let tempData = data;
        tempData[dayData.index].Day = stat
        let newTotal = 0

        tempData.map((dataPoint) => {
            if (dataPoint.index !== 0 && dataPoint.Day) {
                let currentStat = parseInt(dataPoint.Day)
                let yesteday = parseInt(tempData[dataPoint.index - 1].Month)
                dataPoint.Month = currentStat + yesteday
                setTotal(currentStat + yesteday)
                newTotal = currentStat + yesteday
            } else if (dataPoint.Day) {
                dataPoint.Month = parseInt(dataPoint.Day)
                setTotal(parseInt(dataPoint.Day))
            } 
        })
        setDaysRemaining(props.workDays.length - (dayData.index + 1))
        fireStore.collection('users').doc(props.dbKey).collection('quotaGraphs').doc(props.currrentMonth).collection('stats').doc(props.statSelected.stat).update({
            stats: tempData,
            total: newTotal
        })
        props.statSelected.stats = tempData
        props.setChanged(props.statSelected)
        closeModel()
    }

    return (
        <div className='quotaGraphWrapper'>

            <TestStatWrapper statName={props.statSelected.stat} from='quotaGraphWrapper' />

        </div>

    );
}


export default QuotaGraph; 
