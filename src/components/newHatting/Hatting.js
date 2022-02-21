import React, { useState, useMemo, useContext, useEffect, useRef } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Button, Col, Collapse, Row, Progress, Radio, Checkbox, Tooltip, Divider } from 'antd';

import findHeldFromAboveOLD from '../../functions/findHeldFromAboveOLD';
import DivisionsCollapse from './DivisionsCollapse';
import DepartmentsCollapse from './DepartmentsCollapse';
import HatsCollapse from './HatsCollapse';
import Spinner from '../spinner/Spinner';
//import ProgressLine from './ProgressLine';

import { AuthContext } from '../../context/Context';
import HattingSequence from './HattingSequence';

let nonStateHatPacks = []
let uniqueHatPacks = [];

function Hatting(props) {

    const [referencesRead, setReferencesRead] = useState([])
    const [references, setReferences] = useState([])

    const [radioValue, setRadioValue] = useState('byPost')

    const [openPannel, setOpenPannel] = useState(null)
    const [hats, setHats] = useState(null)
    const [exects, setExects] = useState(null)
    const [divisions, setDivisions] = useState(null)
    const [departments, setDepartments] = useState(null)

    const [userPostObj, setUserPostObj] = useState(null)
    const [postArr, setPostArr] = useState([])

    useEffect(async() => {
        console.log(props.allPosts);
        fireStore.collection("users").doc(props.dbKey).collection('employees').doc(props.userInfo.uid).get().then((snapshot) => { 
            setReferencesRead(snapshot.data().referencesRead);
        })
    
        let allHats = []
        let allDepartments = []
        let allDivisions = []
        let allExects = []

        props.allPosts.forEach((post) => {

            findHeldFromAboveOLD(post, props.dbKey).then((children) => {
                children.map((obj) => {
                    if (obj.type === 'hat' && !obj.section ) {
                        allHats.push(obj)
                    } else if (obj.type  === 'depts') {
                        allDepartments.push(obj)
                    } else if (obj.type  === 'divs') {
                        allDivisions.push(obj)
                    } else if (obj.type  === 'exect') {
                        allExects.push(obj)
                    }
                    return null;
                })
            }).then(() => {
                allDivisions.sort((a, b) => { return a.position - b.position })
                allExects.sort((a, b) => { return a.position - b.position })
                allHats.sort((a, b) => { return a.position - b.position })
                setHats(allHats)
                setDepartments(allDepartments)
                setDivisions(allDivisions)
                setExects(allExects)
            }).then(() => {
                // console.log('HATS', allHats)
                // console.log('DEPTS', allDepartments)
                // console.log('DIVS', allDivisions)
                // console.log('EXECTS', allExects);
                setRadioValue('notByPost');
            })

        })


    }, [props])

    let onCheckChange = (e, item) => {
        if (e.target.checked) {
            item.completeDate = new firebase.firestore.Timestamp.now()
            let referencesReadTemp = referencesRead.concat(item)
            setReferencesRead(referencesReadTemp)
            fireStore.collection("users").doc(props.dbKey).collection('employees').doc(props.userInfo.uid).update({
                referencesRead: referencesReadTemp
            })
        } else {
            let referencesReadTemp = referencesRead.filter(e => e.name !== item.name)
            setReferencesRead(referencesReadTemp)
            fireStore.collection("users").doc(props.dbKey).collection('employees').doc(props.userInfo.uid).update({
                referencesRead: referencesReadTemp
            })
        }
    }

    const Panel = Collapse.Panel;

    let onlyHattingMaterial = (item) => {
        
        if (item.hatPacks.length) {
            item.hatPacks.map((item) => {
                nonStateHatPacks = nonStateHatPacks.concat({ user: props.userInfo.uid, item: item })
                if (nonStateHatPacks.length) {
                    nonStateHatPacks.map(x => uniqueHatPacks.filter(a => a.item.item.name == x.item.name && a.user == x.user).length > 0 ? null : uniqueHatPacks.push({item: x, user: props.userInfo.uid}))
                    //nonStateHatPacks.map(x => uniqueHatPacks.filter( a => console.log(a.user, x.user) ).length > 0 ? null : uniqueHatPacks.push({item: x, user: props.userInfo.uid}))
                }
            })
        }

        if (item.references.length) {
            item.references.map((item) => {
                nonStateHatPacks = nonStateHatPacks.concat({ user: props.userInfo.uid, item: item })
                if (nonStateHatPacks.length) {
                    nonStateHatPacks.map(x => uniqueHatPacks.filter(a => a.item.item.name == x.item.name && a.user == x.user).length > 0 ? null : uniqueHatPacks.push({item: x, user: props.userInfo.uid}))
                }
            })
        }

        //a.item.item.name, x.item.name
        
    }

    let pannelBody = (item) => {
            return <div>
            <Divider orientation="left">Hat Packs</Divider>
            { item.hatPacks.map((hatPack, i) => {
                return <div>
                    <div key={i} style={{ marginLeft: '1em' }}><b>{hatPack.name}</b></div>
                    {hatPack.references.map((ref, i) => {
                        return <div>
                            <div key={i} style={{ cursor: 'pointer', marginLeft: '3em'  }} onClick={() => window.open(ref.url, "_blank")}><i>{ref.name}</i>
                            <span style={{ float: 'right' }}>
                                <Tooltip title="By checking this box you are attesting that you have read, understand, and can apply this reference">
                                    <Checkbox onChange={(e) => onCheckChange(e, ref)} checked={referencesRead.some(e => e.name === ref.name)}></Checkbox>
                                </Tooltip>
                            </span>
                            </div>
                            {/* <div style={{ marginLeft: '-1em' }}><ProgressLine statName={stat} dbKey={dbKey} /></div> */}
                        </div>
                    })}
                    {/* <div style={{ marginLeft: '-1em' }}><ProgressLine statName={stat} dbKey={dbKey} /></div> */}
                </div>
            }) }
            <br />
          <Divider orientation="left">Individual References</Divider> 
            {item.references.map((ref, ii) => {
                return <div onClick={() => console.log(ref)} >
                    <div key={ii} style={{ marginLeft: '3em' }}><i style={{ cursor: 'pointer' }} onClick={() => window.open(ref.url, "_blank")} >{ref.name}</i>
                    <span style={{ float: 'right' }}>
                        <Tooltip title="By checking this box you are attesting that you have read, understand, and can apply this reference">
                            <Checkbox onChange={(e) => onCheckChange(e, ref)} checked={referencesRead.some(e => e.name === ref.name)}></Checkbox>
                        </Tooltip>
                    </span>
                    </div>
                    {/* <div style={{ marginLeft: '-1em' }}><ProgressLine statName={stat} dbKey={dbKey} /></div> */}
                </div>
            })}
        </div>
        
    }
    let pannelRender = (item, i) => {
        if ((item.hatPacks && item.hatPacks.length) || (item.references && item.references.length)) {
            return <Panel showArrow={false} header={<b style={{ fontSize: '115%' }}>{item.post}</b>} key={i} >
                { onlyHattingMaterial(item)  }
                { pannelBody(item) }
            </Panel>
        }
    }
    let pannelOpen = (i) => {
        setOpenPannel(i)
    }

    let renderByMainPost = (post) => {

            switch (post.type) {

                case 'owner':

                    return [

                        <div key={post.post} style={{ marginLeft: '2em' }}>
                            <Collapse bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>
                                {divisions ? divisions.map((div, i) => {
                                    return [pannelRender(div, i + 10),
                                    departments ?
                                        <DepartmentsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null,
                                    hats ?
                                        <HatsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null
                                    ]
                                }
                                ) : <Spinner text={'Loading Divisions'} />}
                            </Collapse></div>
                    ]

                case 'ed':

                    return [
                        <Collapse key={post.id} bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>
                            {pannelRender(post, -1)}
                        </Collapse>,

                        exects && exects.length > 0 ?
                            <div key={post.post} style={{ marginLeft: '2em' }}>
                                <Collapse bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>
                                    {exects.map((exect, i) => {
                                        return [pannelRender(exect, i + 10),
                                        divisions ?
                                            <DivisionsCollapse divisions={divisions} parrent={exect} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                            : null]
                                    }
                                    )}
                                </Collapse></div> : null
                    ]

                case 'exect':

                    return [

                        <div key={post.post} style={{ marginLeft: '2em' }}>
                            <Collapse bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>
                                {exects ? exects.map((exect, i) => {
                                    return [pannelRender(exect, i + 10),
                                    divisions ?
                                        <DivisionsCollapse divisions={divisions} parrent={exect} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null]
                                }
                                ) : <Spinner text={'Loading Executives'} />}
                            </Collapse></div>
                    ]

                case 'divs':

                    return [

                        <div key={post.post} style={{ marginLeft: '2em' }}>
                            <Collapse bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>
                                {divisions ? divisions.map((div, i) => {
                                    return [pannelRender(div, i + 10),
                                    departments ?
                                        <DepartmentsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null,
                                    hats ?
                                        <HatsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null
                                    ]
                                }
                                ) : <Spinner text={'Loading Divisions'} />}
                            </Collapse></div>
                    ]

                case 'depts':

                    return [

                        <div key={post.post} style={{ marginLeft: '2em' }}>
                            <Collapse bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>
                                {departments ? departments.map((dept, i) => {
                                    return [pannelRender(dept, i + 10),
                                    hats ?
                                        <HatsCollapse divisions={divisions} parrent={dept} departments={departments} hats={hats} post={post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null]
                                }
                                ) : <Spinner text={'Loading Departments'} />}
                            </Collapse></div>
                    ]

                case 'hat':

                    return <div key={post.post} style={{ marginLeft: '2em' }}>
                        <Collapse bordered={false} accordion={true} onChange={(i) => setOpenPannel(i)}>

                            {hats ? hats.map((hat, i) => {
                                if (post.type === 'hat' && hat.childOf === post.childOf) {
                                    return pannelRender(hat, i + 10)
                                }
                            })
                            : <Spinner text={'Loading Departments'} />}

                        </Collapse>
                        
                        </div>

                default:
                    return <h3>No Posts Assigned</h3>
            }
        
    }

    let onRadioChange = (e) => {
        //fireStore.collection('users').doc(props.dbKey).collection('stats').doc(props.statName).update({ stats: stats })
        setRadioValue(e.target.value);
    }
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        fontWeight: 'bold',
        color: '#dddddd'
    };

    return (
        <div style={{ marginTop: '2em' }} >

            {props.from === 'homePage' || props.from === 'progressBoard' ? 
                null :
                <div style={{ marginLeft: '2em' }}>
                    <Radio.Group onChange={(e) => onRadioChange(e)} value={radioValue}>
                        <Radio style={radioStyle} value={'notByPost'}>My Hatting Sequence</Radio>
                        <Radio style={radioStyle} value={'byPost'}>Hatting By Post</Radio>
                    </Radio.Group>
                    <hr />
                </div>
                }
                
            {radioValue === 'byPost' ?
                <Row justify='center' >
                    <Col span={12} className='hattingSequence'>{props.allPosts ? 
                    //renderByMainPost(props.allPosts) 
                    props.allPosts.map((post) => {
                        return renderByMainPost(post) 
                    })
                        : <div>No Posts Assigned</div>}</Col>
                </Row>
                :
                <Row justify='center'>
                    <Col span={ props.from !== 'homePage' ? 12 : 24} ><HattingSequence references={uniqueHatPacks} userInfo={props.userInfo} referencesRead={referencesRead} onCheckChange={onCheckChange} from={props.from} /></Col> 
                </Row>
            }  

        </div>
    );
}

export default Hatting;