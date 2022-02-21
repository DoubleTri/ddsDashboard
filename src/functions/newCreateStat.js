import { fireStore } from '../firebase';
import RandomId from './RandomId';
import moment from 'moment';

let len = 12;    
let pattern = 'aA0' 

export default function CreateStat(statId, statName, upsideDown, description, dbKey, weekEnding, postName, postId) {

    let workingDays = []
    let lastTwelveDays = []

    let weekArr = []
    let dayIdArrForWeek = []
    let weekTotal = 0

    let monthArr = []
    let dayIdArrForMonth = []
    let monthTotal = 0

    fireStore.collection('users').doc(dbKey).collection('quotaGraphs').get().then((snap) => {
        snap.docs.forEach((doc) => { doc.data().workingDays.map((workDay) => {workingDays.push(workDay) }) } )
    }).then(() => {
        workingDays.sort(function (a, b) {
            return new Date(a.seconds) - new Date(b.seconds);
        })
    }).then(() => {
        lastTwelveDays = workingDays.slice(workingDays.length - 30, workingDays.length);
    }).then(() => {
        fireStore.collection("users").doc(dbKey)
        .collection('brandNewStats').doc(statName)
        .set({
            id: statId,
            name: statName,
            description: description ? description : null,
            upsideDown: upsideDown ? upsideDown : false,
            postData: { postName: postName, postId: postId },
            quotaGraph: false
        })
    }).then(() => {
        lastTwelveDays.forEach((i, index) => {

            let id = RandomId(len, pattern)
            let date = i
            let stat = Math.floor(Math.random() * 401)

            weekArr.push({
                date: date.toDate(),
                id: id,
                name: i.seconds * 1000,
                notes: [],
                stat: stat,
            })
            weekTotal = weekTotal + stat

            dayIdArrForWeek.push(id)
            dayIdArrForMonth.push(id)

            
            fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(statName).collection('days').doc(id).set({
                date: date.toDate(),
                id: id,
                name: i.seconds * 1000,
                notes: [],
                stat: stat,
            })



            if (weekArr.length > 2 && moment(i.toDate()).format('W') !== moment(weekArr[weekArr.length - 2].name).format('W')) {
                let weekEndingDate = (i.seconds * 1000) + 604800000
                fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(statName).collection('weeks').doc(id).set({
                    id: id,
                    stats: weekArr,
                    total: weekTotal,
                    weekEnding: weekEndingDate,
                    //weekEndingString: weekEndingDate.toDateString(),
                    dayIdArr: dayIdArrForWeek
                });    
                //nextWeekEnding =
                weekArr = []
                dayIdArrForWeek = []
                weekTotal = 0
            }



            if (monthArr.length && moment(i.toDate()).format('M') !== moment(monthArr[monthArr.length - 1].name).format('M') || index === lastTwelveDays.length - 1) {
                
                fireStore.collection('users').doc(dbKey).collection('brandNewStats').doc(statName).collection('months').doc(id).set({
                    id: id,
                    stats: monthArr,
                    total: monthTotal,
                    month: Date.parse(monthArr[monthArr.length - 1].date),
                    dayIdArr: dayIdArrForMonth
                })
                monthArr = []
                dayIdArrForMonth = []
                monthTotal = 0
                monthArr.push({
                    date: date.toDate(),
                    id: id,
                    name: i.seconds * 1000,
                    notes: [],
                    stat: stat,
                })
                monthTotal = monthTotal + stat

            } else {
                monthArr.push({
                    date: date.toDate(),
                    id: id,
                    name: i.seconds * 1000,
                    notes: [],
                    stat: stat,
                })
                monthTotal = monthTotal + stat
            }

        })
    })

    console.log({  
        id: statId,
        name: statName,
        description: description ? description : null,
        upsideDown: upsideDown ? upsideDown : false,
        postData: { postName: postName, postId: postId },
        quotaGraph: false
    });


}