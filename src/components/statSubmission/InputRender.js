import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Button, Col, Row, InputNumber, Input } from 'antd';

import Spinner from '../spinner/Spinner';

import { AuthContext } from '../../context/Context';

const Graph = lazy(() => import('../graphs/Graph'))

function InputRender(props) {

    const [statInput, setStatInput] = useState(null)
    const [text, setText] = useState(null)
    //const [stats, setStats] = useState(null)

    const [fullStatData, setFullStatData] = useState([])

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {
        console.log('input  render');
        fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc('5EMqkCkw74xo').onSnapshot((snap) => {
            console.log(snap.data());
        })

    }, [props])

    let onInputChange = (e) => {
        setStatInput(e);
    }
    let onTextChange = (e) => {
        setText(e.target.value);
    }

    let submitStat = (item, statId, stats) => {
        console.log(item, statId, stats);

        let notes = { date: new firebase.firestore.Timestamp.now(), statEntered: statInput, text: text }
        stats[stats.length - 1].notes = stats[stats.length - 1].notes.concat(notes)
        stats[stats.length - 1].stat = stats[stats.length - 1].stat + statInput

        fireStore.collection("users").doc(dbKey).collection(statId).doc('stats').update({ stats: stats })
        setStatInput(null)
        setText(null)

        fireStore.collection("users").doc(dbKey).update({ refresh: Date.now() })
    }

    return (<div>


        <Row type="flex" justify="center" style={{ margin: '2em' }}>

            <Col sm={12} md={4}><InputNumber onChange={(e) => onInputChange(e)} placeholder="Stat" value={statInput} /></Col>
            <Col sm={12} md={14} style={{ marginRight: '1em' }}><Input onChange={onTextChange} placeholder="Enter any notes" value={text}></Input></Col>
            <Col sm={12} md={1}><Button onClick={() => { submitStat(props.item, props.data.id, props.stats) }} disabled={statInput ? false : true} >Submit</Button></Col>

        </Row>




    </div>)
}

export default InputRender