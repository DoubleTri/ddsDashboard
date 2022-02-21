import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Link } from "react-router-dom";
import StatSubmission from './StatSubmission';
import { Radio, Row, Col } from 'antd';

import Graph from '../graphs/Graph';
import TestStatWrapper from '../testStat/TestStatWrapper';
import { AuthContext } from '../../context/Context';
import InputStats from './InputStats';

function StatSubmissionContainer(props) {

    const [posts, setPosts] = useState(null)
    const [allPost, setAllPost] = useState(null)
    const [radioValue, setRadioValue] = useState('user')

    const [graph, setGraph] = useState(null)

    const { currentUser, userInfo, dbKey, dbArr } = useContext(AuthContext);

    useEffect(async () => {
        if (dbKey && userInfo) {
            let allUserPosts = []
            fireStore.collection("users").doc(dbKey).collection('orgBoard').where('employee.uid', '==', userInfo.uid).where('employee.hfa', '==', false).onSnapshot((snapshot) => {
                snapshot.docs.forEach((doc, i) => {
                    allUserPosts.push(doc.data())
                })
            })
            fireStore.collection("users").doc(dbKey).collection('orgBoard').where('type', '==', 'ed').onSnapshot((snapshot) => {
                snapshot.docs.forEach((doc, i) => {
                    setAllPost(doc.data())
                })
            })
            setPosts(allUserPosts)
        }
    }, [dbKey, userInfo])

    let onRadioChange = (e) => {
        setGraph(null)
        setRadioValue(e.target.value);
    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        fontWeight: 'bold',
        color: '#dddddd'
    };

    let displayGraph = (item) => {
        setGraph(item)
    }
    

    return (

        <div>
            {userInfo && userInfo.admin ?
                props.from !== 'homePage' ?
                <div style={{ marginLeft: '2em' }}>
                    <Radio.Group onChange={(e) => onRadioChange(e)} value={radioValue}>
                        <Radio style={radioStyle} value={'user'}>My Stats</Radio>
                        <Radio style={radioStyle} value={'all'}>All Stats</Radio>
                    </Radio.Group>
                    <hr />
                </div> : null : null}
            {dbArr ?
                radioValue === 'all' ?
                    <Row>
                        <Col span={7} className='statSubmissionRow'>
                            <StatSubmission dbObj={dbArr} post={allPost} radioValue={radioValue} displayGraph={displayGraph} /></Col>
                            { graph ? <Col span={16}>
                            <div className='oicGraphs' style={{ marginTop: '2em', marginRight: '1.5em' }}>
                                <Graph statName={graph} from='statSubmission' />
                                {/* <TestStatWrapper statName={graph} from='statSubmission' /> */}
                                <InputStats statName={graph} from='statSubmission' dbKey={dbKey} user={currentUser}/>
                                </div>
                            
                            </Col> : null }
                    </Row>
                    :
                    <Row>
                        <Col span={7} className='statSubmissionRow'>
                            {posts && posts.length ? posts.map((post, i) => {
                                return <StatSubmission dbObj={dbArr} post={post} radioValue={radioValue} displayGraph={displayGraph} from={props.from}/>
                            }) : <div style={{ margin: '5em' }}><h3>No posts are assigned to {currentUser.displayName}</h3></div>}</Col>
                        { graph ? <Col span={ props.from !== 'homePage' ? 16 : 15 }>
                            <div className='oicGraphs' style={{ marginTop: '2em', marginRight: '1.5em' }}>
                                <Graph statName={graph} from={ props.from !== 'homePage' ? 'statSubmission' : 'oicGraphs' } />
                                {/* <TestStatWrapper statName={graph} from={ props.from !== 'homePage' ? 'statSubmission' : 'oicGraphs' }  /> */}
                                { props.from !== 'homePage' ? 
                                    <InputStats statName={graph} from='statSubmission' dbKey={dbKey} user={currentUser} /> 
                                : null } 
                                </div>
                            
                            </Col> : null }
                    </Row>

                : null}

        </div>

    )
}

export default StatSubmissionContainer;