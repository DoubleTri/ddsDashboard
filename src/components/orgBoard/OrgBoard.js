import React, { useState, useEffect, useContext } from 'react';
import { fireStore, auth, functions } from '../../firebase';
import firebase from 'firebase/app';
import { AuthContext } from '../../context/Context';

import { Button, Modal, Row, Col, Select } from 'antd';

import GetOrgBoard from '../../functions/GetOrgBoard';
import OrgChart from './OrgChart';
import DivisionAsDnDTarget from './DivisionAsDnDTarget';
import EmployeeDnDTarget from './EmployeeDnDTarget';
import FlowChartNavigation from './FlowChartNavigation';
import Vfp from './Vfp';
import {
    CloseCircleOutlined
  } from '@ant-design/icons';


function OrgBoard(props) {

    const [openVideoModal, setOpenVideoModal] = useState(false)
    const [orgBoardTree, setOrgBoardTree] = useState(null)
    const [dbObj, setDbObj] = useState(null)

    const [flowCharts, setFlowCharts] = useState(null)
    const [selected, setSelected] = useState(null)
    //const [flowChart, setFlowChart] = useState(null)
    const [nextTerminal, setNextTerminal] = useState(null)

    const [vfp, setVfp] = useState(null)

    const [openOne, setOpenOne] = useState(false)
    const [openTwo, setOpenTwo] = useState(false)
    const [openThree, setOpenThree] = useState(false)
    const [openFour, setOpenFour] = useState(false)

    const { dbKey, dbArr, flowChart, setFlowChart, clearFlowChart, logout } = useContext(AuthContext);

    const { Option } = Select;

    useEffect( async () => {

        if (dbKey) {
            fireStore.collection('users').doc(dbKey).get().then((snap) => {
                setVfp(snap.data().vfp);
            })
            let objArr = []
            fireStore.collection('users').doc(dbKey).collection('orgBoard').get().then( async (snapshot)=> {
                objArr = []
                await snapshot.docs.map(doc => objArr.push( doc.data()) )
                GetOrgBoard(objArr).then((res) => setOrgBoardTree(res));
                setDbObj(objArr)
            })
            let flowChartsTemp = []
            fireStore.collection("users").doc(dbKey).collection('flowCharts').get().then((snap) => {
                snap.forEach((flowChart, i) => {
                    flowChartsTemp.push(<Option key={i} data={flowChart.data()} value={flowChart.data().data.name}>{flowChart.data().data.name}</Option>)
                })
                setFlowCharts(flowChartsTemp)
                setFlowChart(null)
                setSelected(null)

            })
        }
    }, [dbKey, dbArr])

    let selectChanged = (e, data) => {
        clearFlowChart()
        setFlowChart(data)
        setSelected(e)
    }

    let cnxFlowChart = () => {
        clearFlowChart()
        setSelected(null)
    }

    // let openReference = (reference) => {
    //     if (reference === 1) {
    //         setOpenOne(true)
    //     }
    //     if (reference === 2) {
    //         setOpenTwo(true)
    //     }
    //     if (reference === 3) {
    //         setOpenThree(true)
    //     }
    //     if (reference === 4) {
    //         setOpenFour(true)
    //     }
    // }

    // const flowChartNavigation = (node) => {
    //     console.log(node);
    //     if (!node) {
    //         node = flowChart[0]
    //     }

    //     let nextEdge = []

    //     flowChart.map((item) => {
    //         if (item.source === node.id) {
    //             nextEdge.push(flowChart.filter((e) => e.id === item.target)[0])
    //         }
    //     })
        
    //     return <div>
    //         {  console.log(node.data.post, nextEdge)}
    //         { node.data.post }
    //         { nextEdge.map((item, i) => {
    //             return <div key={i} onClick={() => flowChartNavigation(item)}>{item.data.post}</div>
    //         })}
    //     </div>
    // }

    const getDeputy = () => {
        console.log(dbObj);
        console.log(dbObj.find(o => o.type === 'deputy'))
        return <div><EmployeeDnDTarget hat={dbObj.find(o => o.type === 'deputy')} dbKey={dbKey} dbObj={dbObj} /></div>
    }

    const MyNodeComponent = ({ node }) => {
        return (
            <div className='Node'
                id={node.division ? node.division.replace(/\s/g, '') : node.postPosition ? node.postPosition.replace(/\s/g, '') : node.type.replace(/\s/g, '')}
                style={{ backgroundColor: node.backgroundColor }}
            >
                <div>
                    { node.type === 'divs' ?
                        <DivisionAsDnDTarget node={node} dbKey={dbKey}  />
                        :
                        <EmployeeDnDTarget hat={node} dbKey={dbKey} dbObj={dbObj} /> }

                    {/* { node.type === 'ed' ? getDeputy() : null } */}
                </div>
            </div>
        );
    };

                                    // // ------------------- EMULATOR STUFF ----------------------------
                                    // firebase.auth().useEmulator('http://localhost:9099/');
                                    // functions.useEmulator("localhost", 5001);
                                    // // ---------------------------------------------------------------

    const clearAllStaff = () => {

        fireStore.collection("users").doc(dbKey).collection('stats').get().then((snap) => { 
            snap.docs.map((stat) => {
                var newStatData = firebase.functions().httpsCallable('createNewStatData');
                newStatData({ postTitle: stat.data().data.name, postId: stat.data().data.postData.postId, postName: stat.data().data.postData.postName, dbKey: dbKey });
            })
        })

                // var newStatData = firebase.functions().httpsCallable('createNewStatData');
                // newStatData({ dbKey: dbKey });

        // var dayEndingFunction = firebase.functions().httpsCallable('dayEndingFunction');
        // dayEndingFunction({ dbKey: dbKey });

        // // Get a new write batch
        // var batch = fireStore.batch();
        // fireStore.collection("users").doc(dbKey).collection('orgBoard').get().then((snap) => {
        //     snap.forEach((doc) => {
        //         console.log(doc.data().id);
        //         batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(doc.data().id) ,{'employee' : null})
        //     })
        // })
        // .then(() => 
        // batch.commit()
        //     .catch((error) => {console.log(error)})
        // ).catch((error) => {console.log(error)})


        
        // // Get a new write batch
        // var batch = fireStore.batch();
        // fireStore.collection("users").doc(dbKey).collection('stats').get().then((snap) => {
        //     snap.forEach((doc) => {
        //         if (!doc.data().data.quotaGraph) {
        //             let data = doc.data().data
        //             data.quotaGraph = false
        //             batch.update(fireStore.collection("users").doc(dbKey).collection('stats').doc(doc.data().data.name) ,{'data' : data})
        //         }
        //     })
        // })
        // .then(() => 
        // batch.commit()
        //     .catch((error) => {console.log(error)})
        // ).catch((error) => {console.log(error)})
    }

    let resetDate = () => {
        fireStore.collection("users").doc(dbKey).update({
            reminderDay: new Date("2021-8-11")
        })
    }

    return (
        <div className="orgBoard" id="orgBoard" >
        {/* <div onClick={() => logout()}>logout</div> */}
        {/* <div onClick={() => clearAllStaff()}>clearAllStaff</div> */}
        {/* <div onClick={() => resetDate()}>reset</div> */}

        <Row>
                <Col span={3} offset={20}>
                    <Select
                        style={{ width: '100%', marginBottom: '-2em' }}
                        placeholder="Select Flow Chart"
                        onChange={(e, data) => selectChanged(e, data)}
                        value={selected}
                    >
                        {flowCharts}
                    </Select>
                </Col>
                { flowChart ? <div onClick={() => cnxFlowChart()} style={{ cursor: 'pointer', fontSize: '150%', marginLeft: '1em', color: '#DDDDDD' }}><CloseCircleOutlined /></div> : null }
            </Row>

        {/* { flowChart ? <FlowChartNavigation flowChart={flowChart} /> : null}  */}
    
        {orgBoardTree && dbObj ? <div>
                <OrgChart tree={orgBoardTree.orgBoard} NodeComponent={MyNodeComponent} owner={orgBoardTree.owner} deputy={orgBoardTree.deputy} />
                <Vfp dbKey={dbKey} vfp={vfp} /> </div>
                : 'loading org board'}

    
            <Modal
                title='The Organizing Board'
                visible={openVideoModal}
                closable={false}
                footer={null}
                width={800}
            >
                <p><b>ORG BOARDS: An ORG BOARD (ORGANIZING BOARD) is a board which displays the functions, duties, sequences of action and authorities of an organization. The org board shows the pattern of organizing to obtain a product. It is the pattern of the terminals and their flows. We see these terminals as posts or positions. Each of these is a hat. There is a flow along these hats. The result of the whole org board is a product. The product of each hat on the board adds up to the total product.</b></p>
                <hr />
                <p>A business, organization, even individuals, have final products that they create and send out into the world in exchange for something valuable (money, goodwill, friendship, etc).  People see final products.  But what’s often unseen is all that goes into the creation of that final product.  Enter organizing boards! </p>
                <p>An organizing board accounts for all sub-products and actions (no matter how large or small), puts them in sequence, and creates a flow across the board from an idea to a finished product sold or exchanged for something valuable.</p>
                <p>An organizing board is not a flow chart of authority or a list of staff.  An organizing board is actually a philosophic machine.  It solves executive headaches, stabilizes staff members, and creates expansion like pouring water on a sponge. </p>
                <p>Needless to say, there is much more to understand about organizing boards than its definition.  For more information about organizing boards, how they help businesses and individuals, and how you can create your own, check out…</p>
                <p style={{ textAlign: 'center' }}>www.EffectiveManagement.us</p>
                <br />
                <Button onClick={() => setOpenVideoModal(false)}>Close</Button>
            </Modal>

            <Modal
                title='Top Down Posting'
                visible={openOne}
                closable={false}
                footer={null}
            //width={1000}
            >
                <p><b><span style={{ background: 'yellow' }}>You post from the top down. YOU NEVER POST FROM BOTTOM UP.</span> And you NEVER LEAVE A GAP BETWEEN PERSONS ON LOWER POSTS AND HIGH POSTS. Either of these faults will raise hell in the division's functioning and are grave faults.</b></p>
                <br />
                <Button onClick={() => setOpenOne(false)}>Close</Button>
            </Modal>

            <Modal
                title='Held From Above'
                visible={openTwo}
                closable={false}
                footer={null}
            //width={1000}
            >
                <p><b>All functions below a name are held by it. And must be so posted. Verify and correct the sequence of posts so this happens.</b></p>
                <p>Any post, even if not specifically assigned to an individual, still executes and needs to be held and done.  Thus if a post is not assigned to an individual that post responsibilities go to whomever is directly above it.  That person would be holding the post “from above”.</p>
                <p>For example, if someone is posted as a division head and no one is assigned to the posts within that division, the division head would hold all those posts from above. </p>
                <p>The Digital Org Board System is programed with this policy in mind and automatically adds names to any post that is held from above.  There is no need to add a person to a post that they are already holding from above. </p>
                <br />
                <p></p>
                <Button onClick={() => setOpenTwo(false)}>Close</Button>
            </Modal>

            <Modal
                title='Cross Divisions or Departments'
                visible={openThree}
                closable={false}
                footer={null}
            //width={1000}
            >
                <p><b>You try not to cross divisions (one person in two different divisions). As the organization grows, you try not to cross departments. Correct as you can.</b></p>
                <br />
                <Button onClick={() => setOpenThree(false)}>Close</Button>
            </Modal>

            <Modal
                title='Gaps in Posting'
                visible={openFour}
                closable={false}
                footer={null}
            //width={1000}
            >
                <p><b>You post from the top down. YOU NEVER POST FROM BOTTOM UP. <span style={{ background: 'yellow' }}>And you NEVER LEAVE A GAP BETWEEN PERSONS ON LOWER POSTS AND HIGH POSTS. </span>Either of these faults will raise hell in the division's functioning and are grave faults.</b></p>
                <br />
                <Button onClick={() => setOpenFour(false)}>Close</Button>
            </Modal>

        </div>
    );
}

export default OrgBoard; 