import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import { fireStore } from '../../firebase';
import { Form, Input, Switch, Button, message } from 'antd';

import { AuthContext } from '../../context/Context';

const layout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 20,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
    }
};
/* eslint-enable no-template-curly-in-string */


function AddEmployee() {

    const [loading, setLoading] = useState(false)

    const { dbKey } = useContext(AuthContext);
    const [form] = Form.useForm();

    const onFinish = (values) => {

        setLoading(true)

        var config = {
            apiKey: "AIzaSyDwvSq9PggZ8D0WVEXcoRqh81KMWsHC-Lo",
            authDomain: "ddsdashboard-66cc9.firebaseapp.com",
            projectId: "ddsdashboard-66cc9",
        };
        var secondaryApp = firebase.initializeApp(config, Date.now().toString());
    
        const promise = secondaryApp.auth().createUserWithEmailAndPassword(values.email, values.password).then((employee) => {
    
            if (employee) {
                employee.user.updateProfile({
                    displayName: values.name
                })
            }
    
            let newUid = secondaryApp.auth().currentUser.uid
            secondaryApp.auth().signOut();

            fireStore.collection("users").doc(dbKey).update({
                'uid': firebase.firestore.FieldValue.arrayUnion(newUid)
            })

            fireStore.collection("users").doc(dbKey).collection('employees').doc(newUid).set({
                name: values.name,
                email: values.email,
                admin: values.admin ? values.admin : false,
                id: values.name,
                uid: newUid,
                referencesRead: []
            })
            message.success(values.name + "'s account has been created")
            form.resetFields();
            setLoading(false)
        })
        promise.catch(function (e) {
            if (e) {
                message.error(e.message)
                secondaryApp.auth().signOut();
                setLoading(false)
            }
        });
    };

    return (
        <div className='addEmployee'>
            <div style={{ textAlign: 'center', marginTop: '3em', marginBottom: '1em'  }}><h1 style={{ color: '#dddddd' }}>Add Employee</h1></div>
            <Form {...layout} 
                form={form}
                className='formStyle'
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

                <Form.Item
                    name={'email'}
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name={'password'}
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="admin" label="Admin" valuePropName="checked">
                    <Switch />
                </Form.Item>
                

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
        </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddEmployee;