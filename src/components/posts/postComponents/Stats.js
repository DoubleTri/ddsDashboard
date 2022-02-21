import React, { useState, useEffect } from 'react';
import { fireStore } from '../../../firebase';
import firebase from 'firebase/app';
import { Row, Col, Input, Button, Form, Switch, Modal } from 'antd';
import RandomId from '../../../functions/RandomId';

import Graph from '../../graphs/Graph';
import TestStatWrapper from '../../testStat/TestStatWrapper';
import newCreateStat from '../../../functions/newCreateStat';
import CreateStat from '../../../functions/CreateStat';

var len = 12;
var pattern = 'aA0'

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 20,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
};
/* eslint-enable no-template-curly-in-string */


function Stats(props) {

    const [newStatModal, setNewStatModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm();

    useEffect(() => {
        console.log(props);
    },[props])

    let onFinish = (values) => {
    
        let statId = RandomId(len, pattern);
        let weekEnding;
        let newIdsArr = props.statIdArr

        fireStore.collection("users").doc(props.dbKey).get().then((doc) => {
            weekEnding = doc.data().weekEndNext
        }).then(() => {
            //newCreateStat(statId, values.name, values.upsideDown, values.description, props.dbKey, weekEnding, props.name, props.id)
            CreateStat(statId, values.name, values.upsideDown, values.description, props.dbKey, weekEnding, props.name, props.id)
        }).then(() => {
            newIdsArr.push(values.name)          
                fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.id).update({
                    statIdArr: newIdsArr
                }).catch((e) => { console.log(e) })
        }).then(() => {
            fireStore.collection("users").doc(props.dbKey).collection('statGroup').doc('All Stats').update({
                'statArr': firebase.firestore.FieldValue.arrayUnion(values.name)
            })
        })
        cancelModal()
        form.resetFields()
        setLoading(false)
    }
    
    let cancelModal = () => {
        setNewStatModal(false)
    }

    let deleteStat = (stat) => {
    
    // remove from post's statIdArr
    fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.id).update({
        statIdArr: firebase.firestore.FieldValue.arrayRemove(stat)
    })

    // remove from allStats in statGroups
    fireStore.collection("users").doc(props.dbKey).collection('statGroup').doc('All Stats').update({
        'statArr': firebase.firestore.FieldValue.arrayRemove(stat)
    })

    // remove from 'stats' in db
        fireStore.collection("users").doc(props.dbKey).collection('stats').doc(stat).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    let pStyle = { backgroundColor: '#DDDDDD', borderRadius: '5px', padding: '1em', margin: '2em', minHeight: '15em' }

    return (<Row className='flowCharts' justify="center" align="middle" style={{ marginTop: '3em' }} >
        <Col span={24} style={pStyle}>
        <Row>
            { props.statIdArr.length ? props.statIdArr.map((graph, i) => {
                return <Col span={8} key={i}>
                    <Graph key={i} statName={graph} deleteStat={deleteStat} from={'post'}/>
                    {/* <TestStatWrapper key={i} statName={graph} deleteStat={deleteStat} from={'post'} /> */}
                </Col>
            }) : <div style={{ color: 'black' }}>No stats currently assigned</div> }
        </Row>
            <Button type="primary" style={{ position:'absolute', bottom:'0', right: '0', margin: '1em'}} onClick={() => setNewStatModal(true)}>Add A Stat</Button>
        </Col>

        <Modal
            visible={newStatModal}
            onCancel={() => cancelModal()}
            footer={null}
        >
            <div style={{ color: 'red', marginBottom: '2em' }}><h3>Create New Stat</h3></div>
            <Form {...layout}
                form={form}
                
                name="nest-messages"
                onFinish={onFinish}
                validateMessages={validateMessages}
                requiredMark={false}
            >
                <Form.Item
                    name={'name'}
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    name={'description'}
                    label="Description"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input />
                </Form.Item> */}

                <Form.Item name="upsideDown" label="Upside Down?" valuePropName="checked">
                    <Switch />
                </Form.Item>


                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                    <Button type="primary" htmlType="submit" loading={loading} >
                        Submit
                    </Button>
                </Form.Item>
            </Form>

        </Modal>

    </Row>
    )
}

export default Stats;