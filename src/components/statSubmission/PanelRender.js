import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Button, Col, Row, InputNumber, Input } from 'antd';

import InputRender from './InputRender';
import Spinner from '../spinner/Spinner';

import { AuthContext } from '../../context/Context';

const Graph = lazy(() => import('../graphs/Graph'))

function PanelRender(props) {

    const [statInput, setStatInput] = useState(null)
    const [text, setText] = useState(null)
    //const [stats, setStats] = useState(null)

    const [fullStatData, setFullStatData] = useState([])

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {
        console.log(props);
        let tempStatArr = []
        props.item.statIdArr.map((stat) => {
            fireStore.collection("users").doc(dbKey).collection(stat).doc('stats').get().then((doc) => {
                tempStatArr.push(doc.data())
            }).then(() => {
                setFullStatData(tempStatArr)
            })
        })

    }, [])

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
    }

    return (<div>

        <p>{props.item.product}</p>
        <Button onClick={() => props.seeHatDetails(props.item)}>See Hat Details</Button>
        <br />
        <Row type="flex" justify="center">
            <Col sm={22} md={20} style={{ margin: '0 auto' }}>
                <Suspense fallback={<Spinner text={`Building ${props.item.post}'s Graph`} />} >
                 
                    
                    {fullStatData && fullStatData.length ? <Row>
                        {fullStatData.map((data, i) => {
                            return <Col key={i} span={20} offset={2} >
                            {/* { userInfo.admin? <div style={{ textAlign: 'right' }} onClick={() => deleteStat(data)}><Icon type="edit" /> </div> : null} */}
                               
                               graph

                                {/* <Graph
                                    item={props.item}
                                    dataSample={data.stats}
                                    data={data.data}
                                    className={'graph'}
                                    brush={true}
                                    clicked={null}
                                    from={null}
                                    responsiveWidth={'100%'}
                                    responsiveHeight={425}
                                    editReverse={data.data.upsideDown}
                                /> */}

                                {/* <Graph item={props.item} dataSample={stats} className={'graph'} brush={true} clicked={null} from={null} responsiveWidth={'100%'} responsiveHeight={425} />  */}
                                {/* <Row type="flex" justify="center" style={{ margin: '2em' }}>

                                    <Col sm={12} md={4}><InputNumber onChange={(e) => onInputChange(e, i)} placeholder="Stat" value={statInput} /></Col>
                                    <Col sm={12} md={14} style={{ marginRight: '1em' }}><Input onChange={onTextChange} placeholder="Enter any notes" value={text}></Input></Col>
                                    <Col sm={12} md={1}><Button onClick={() => { submitStat(props.item, data.data.id, data.stats) }} disabled={statInput ? false : true} >Submit</Button></Col>

                                </Row> */}

                                <InputRender item={props.item} data={data.data} stats={data.stats} />
                                <hr />
                            </Col>
                        })}
                    </Row>
                    : 'Retrieving Stat Data' }
                </Suspense>
            </Col>
        </Row>



    </div>)
}

export default PanelRender