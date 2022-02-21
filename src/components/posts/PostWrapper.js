import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router'; 
import firebase from 'firebase/app';
import { fireStore } from '../../firebase';
import { Form, Input, Switch, Button, message, Row, Col, Popconfirm, Modal } from 'antd';
import {
    ToolOutlined
  } from '@ant-design/icons';
import sanitizeHtml from 'sanitize-html';

import { AuthContext } from '../../context/Context';
import PostInfo from './postComponents/PostInfo';
import HatWriteUp from './postComponents/HatWriteUp';
import HattingMaterial from './postComponents/HattingMaterial';
import Stats from './postComponents/Stats';
import FlowCharts from './postComponents/FlowCharts';
import RandomId from '../../functions/RandomId';

let len = 10;
let pattern = 'aA0'

function PostWrapper(props) {

    const [selectedData, setSelectedData] = useState('Post Info')
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState(null)

    const [name, setName] = useState(null)
    const [purpose, setPurpose] = useState(null)
    const [product, setProduct] = useState(null)
    const [hatWriteUp, setHatWriteUp] = useState(null)
    const [multiEmployeeArr, setMultiEmployeeArr] = useState([])
    const [selectedHatPacks, setSelectedHatPacks] = useState(null)
    const [references, setReferences] = useState(null)
    const [allHattingMaterial, setAllHattingMaterial] = useState(null)
    const [allHatPacks, setAllHatPacks] = useState(null)
    const [allTags, setAllTags] = useState(null)
    const [statIdArr, setStatIdArr] = useState([])
    const [postFlowChartData, setPostFlowChartData] = useState(null)
    const [type, setType] = useState(null)

    const [utilityModal, setUtilityModal] = useState(false)
    const [multiEmployee, setMultiEmployee] = useState()
    const [switchValue, setSwitchValue] = useState()

    const [deputyModal, setDeputyModal] = useState(false)
    const [deputy, setDeputy] = useState()
    const [deputyValue, setDeputyValue] = useState()

    const { dbKey, userInfo } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        if (dbKey) {
            fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(props.match.params.postId).onSnapshot((doc) => {
                if (!doc.data()) {
                    props.history.push('/404')
                } else {
                    setType(doc.data().type)
                    setId(doc.data().id);  
                    setName(doc.data().post);
                    setPurpose(doc.data().purpose);
                    setProduct(doc.data().product);
                    setStatIdArr(doc.data().statIdArr);
                    setHatWriteUp(sanitizeHtml(doc.data().hatWriteUp));
                    setMultiEmployeeArr(doc.data().multiEmployeeArr ? doc.data().multiEmployeeArr : null)
                    setMultiEmployee(doc.data().multiEmployee ? doc.data().multiEmployee : false)
                    setSwitchValue(doc.data().multiEmployee ? doc.data().multiEmployee : false)

                    setDeputy(doc.data().deputy ? doc.data().deputy : false)
                    setDeputyValue(doc.data().deputy ? doc.data().deputy : false)
                    
                    form.setFieldsValue({
                        multiEmployee: doc.data().multiEmployee ? doc.data().multiEmployee : false,
                        deputy: doc.data().deputy ? doc.data().deputy : false
                      });
                }

                let postFlowChartDataTemp = []
                fireStore.collection("users").doc(dbKey).collection('flowCharts').onSnapshot((snap) => {
                    snap.forEach((item) => {
                        item.data().elements.map((element) => {
                            if (doc.data() && element.data && element.data.post === doc.data().post) {
                                postFlowChartDataTemp.push({ element: element, flowChart: item.data() });
                            }
                        })
                    })
                    setPostFlowChartData(postFlowChartDataTemp);
                })

            })
            let hattingMaterialTemp = []
            fireStore.collection("users").doc(dbKey).collection('hattingMaterial').doc('hattingMaterial').onSnapshot((snap) => {
                Object.entries(snap.data()).map((item) => {
                    hattingMaterialTemp.push(item[1]);
                })
                setAllHattingMaterial(hattingMaterialTemp)
            })
            let hatPacksTemp = []
            fireStore.collection("users").doc(dbKey).collection('hattingMaterial').doc('hatPacks').onSnapshot((snap) => {
                Object.entries(snap.data()).map((item) => {
                    hatPacksTemp.push(item[1]);
                })
                setAllHatPacks(hatPacksTemp)
            })
            fireStore.collection('users').doc(dbKey).collection('hattingMaterial').doc('tags').onSnapshot((snap) => {
                setAllTags(snap.data().tags.sort())
            })
        } 
    }, [dbKey])

    let submit = () => {
        if (!name) {
            message.error('A post must have a name')
        } else {
            fireStore.collection('users').doc(dbKey).collection('orgBoard').doc(id).update({
                    post: name,
                    type: type,
                    purpose: purpose,
                    product: product,
                    hatWriteUp: hatWriteUp,
            }).then(() => {
                message.success(`${name} has been updated`)
            })
        }
    }

    let onDelete = async () => {
        let okToDelete = true
        await fireStore.collection('users').doc(dbKey).collection('flowCharts').get().then((snap) => {
            snap.docs.forEach((flowChart) => {
                flowChart.data().elements.forEach((element) => {
                    if (element.data && element.data.postId === id) {
                        okToDelete = false
                    }
                })
            })
        }).then(() => {
            if ( okToDelete ) {
                
                fireStore.collection('users').doc(dbKey).collection('orgBoard').doc(id).delete().then(() => {
                    props.history.push('/org-board')
                    message.success(name + " has been deleted")
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
                statIdArr.map((stat) => {
                    fireStore.collection("users").doc(dbKey).collection('stats').doc(stat).delete().then(() => {
                        console.log("Document successfully deleted!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });

                    // remove from allStats in statGroups
                    fireStore.collection("users").doc(dbKey).collection('statGroup').doc('All Stats').update({
                        'statArr': firebase.firestore.FieldValue.arrayRemove(stat)
                    })
                })

            } else {
                message.error(`${name} is referenced in one or more flow charts.  Please remove ${name} from all flow charts before deleting it.`, 7)
            }
        })


    }

    let renderSelected = () => {
        switch (selectedData) {
            case 'Post Info':
                return <Col span={20}>
                        <PostInfo setName={setName} name={name} setPurpose={setPurpose} purpose={purpose} setProduct={setProduct} product={product} />
                    </Col>
                break;
            case 'Hat Write-Up':
                return <Col span={20}><HatWriteUp setHatWriteUp={setHatWriteUp} hatWriteUp={hatWriteUp} /></Col>
                break;
            case 'Hatting Material':
                return <Col span={20}><HattingMaterial allHatPacks={allHatPacks} allHattingMaterial={allHattingMaterial} dbKey={dbKey} name={name} id={id} allTags={allTags}/></Col>
                break;
            case 'Stats':
                return <Col span={20}><Stats setStatIdArr={setStatIdArr} statIdArr={statIdArr} id={id} dbKey={dbKey} name={name} /></Col>
                break;
            case 'Flow Charts':
                return <Col span={20}><FlowCharts postFlowChartData={postFlowChartData} postId={id}/></Col>
                break;
            default:
            // code block
        }
    }

    let onFinish = (values) => {
        setUtilityModal(false)
        fireStore.collection('users').doc(dbKey).collection('orgBoard').doc(id).update({
            multiEmployee: values ? values.multiEmployee : switchValue,
            multiEmployeeArr: []
        })
    }

    let onFinishDeputy = (values) => {

        setDeputyModal(false)

        fireStore.collection('users').doc(dbKey).collection('orgBoard').doc(id).update({
            deputy: values ? values.deputy : deputyValue,
        })

        if ( values && values.deputy ) {
            console.log('new deputy post');
            let dbId = RandomId(len, pattern);
            fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(dbId).set({
                    post: `Deputy ${name}`,
                    type: 'deputy',
                    childOf: id,
                    position: null,
                    hatPacks: [],
                    references: [],
                    id: dbId,
                    purpose: null,
                    product: null,
                    statIdArr: [],
                    hatWriteUp: '',
            }).then(() => {
                console.log(dbId);
                //props.history.push(`/post/${dbId}`)
            })
        } else if (!deputyValue) {
            console.log('delete deputy post');
        }

    }

    let onFinishFailed = (e) => {
        console.log('error', e);
    }

    let removeEmployee = (employee) => {
        console.log(employee);
        setUtilityModal(false)
        fireStore.collection('users').doc(dbKey).collection('orgBoard').doc(id).update({
            'multiEmployeeArr': firebase.firestore.FieldValue.arrayRemove(employee)
        })
        
    }

    return (<div>

        <div style={{ textAlign: 'center', marginTop: '3em', marginBottom: '1em' }}><h1 style={{ color: '#dddddd' }}>{name ? name : null}</h1></div>

        <Row className='postWrapper' justify="center" align="middle" style={{ textAlign: 'center', marginTop: '3em', color: '#dddddd', fontSize: '115%' }}  >
        
     
            <Col className='linkText' span={4} onClick={() => setSelectedData('Post Info')} style={selectedData === 'Post Info' ? { fontWeight: 'bold', textDecoration: 'underline', color: '#dddddd'  } : {color: '#dddddd'} } >Post Info</Col>
            <Col className='linkText' span={4} onClick={() => setSelectedData('Hat Write-Up')} style={selectedData === 'Hat Write-Up' ? { fontWeight: 'bold', textDecoration: 'underline', color: '#dddddd'  } : {color: '#dddddd'}} >Hat Write-Up</Col>
            <Col className='linkText' span={4} onClick={() => setSelectedData('Hatting Material')} style={selectedData === 'Hatting Material' ? { fontWeight: 'bold', textDecoration: 'underline', color: '#dddddd'  } : {color: '#dddddd'}} >Hatting Material</Col>
            <Col className='linkText' span={4} onClick={() => setSelectedData('Stats')} style={selectedData === 'Stats' ? { fontWeight: 'bold', textDecoration: 'underline', color: '#dddddd'  } : {color: '#dddddd'}} >Stats</Col>
            <Col className='linkText' span={4} onClick={() => setSelectedData('Flow Charts')} style={selectedData === 'Flow Charts' ? { fontWeight: 'bold', textDecoration: 'underline', color: '#dddddd' } : {color: '#dddddd'}} >Flow Charts</Col>
     
            {renderSelected()}

        </Row>
        <Col span={20} offset={2}>
                <Button type="primary" onClick={submit} >
                    Submit
            </Button>
           

            {name && type === 'hat' && userInfo.admin ?
                <Popconfirm
                    title={`Are you sure you want to delete ${name}?  All stats connected to ${name} will also be deleted.`}
                    placement="bottom"
                    onConfirm={() => onDelete()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="danger" style={{ float: 'right' }}>
                        Delete
                    </Button>
                </Popconfirm>
                : null}

            {name && type === 'hat' && userInfo.admin ?
                <Button type="primary" onClick={() => setUtilityModal(true)} style={{ float: 'right', marginRight: '1em' }}>
                    <ToolOutlined />
                </Button>
                : null}

            {name && type === 'ed' && userInfo.admin ?
                <Button type="primary" onClick={() => setDeputyModal(true)} style={{ float: 'right', marginRight: '1em' }}>
                    <ToolOutlined />
                </Button>
                : null}

            </Col>

        <Modal
            visible={utilityModal}
            onCancel={() => setUtilityModal(false)}
            footer={null}
        >
            <Form
                name="basic"
                form={form}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item name="multiEmployee" label="Multiple Employees for this Post?" valuePropName="checked" >
                    <Switch onChange={(e) => setSwitchValue(e)}/>
                </Form.Item>

                { multiEmployeeArr && multiEmployeeArr.length ? multiEmployeeArr.map((employee, i) => {
                    console.log(employee);
                    return <Col span={18} key={i}>{employee.name}
                        <Popconfirm
                            title={`Are you sure you want to remove ${employee.name} from ${name}`}
                            placement="bottom"
                            onConfirm={() => removeEmployee(employee)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <span style={{ float: 'right', color: 'red', cursor: 'pointer' }}>remove</span>
                        </Popconfirm>
                        </Col>
                }) : null }

                <hr />

                {!switchValue && multiEmployee ?
                    <Popconfirm
                        title={'By turning off the multiple employee setting all employees attached to this post will be removed.  Are you sure you want to turn multiple employees off?'}
                        placement="bottom"
                        onConfirm={() => onFinish()}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" >
                            Submit
                    </Button>
                    </Popconfirm>

                    : <Button type="primary" htmlType="submit">
                        Submit
                    </Button>}


            </Form>
        </Modal>


        <Modal
            visible={deputyModal}
            onCancel={() => setDeputyModal(false)}
            footer={null}
        >
            <Form
                name="basic"
                form={form}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinishDeputy}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item name="deputy" label="Would you like to have a Deputy for this post?" valuePropName="checked" >
                    <Switch onChange={(e) => setDeputyValue(e)}/>
                </Form.Item>

                <hr />

                {!deputyValue && deputy ?
                    <Popconfirm
                        title={'Are you sure you want to remove a Deputy for this post?'}
                        placement="bottom"
                        onConfirm={() => onFinishDeputy()}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" >
                            Submit
                    </Button>
                    </Popconfirm>

                    : <Button type="primary" htmlType="submit">
                        Submit
                    </Button>}


            </Form>
        </Modal>


    </div>
    )
}

export default withRouter(PostWrapper);