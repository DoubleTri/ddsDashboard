import React, { useState, useEffect } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

function NotesModalForm(props) {

    const [form] = Form.useForm();

    useEffect(() => {
        console.log(props);
    }, [props])


    let onFinish = (values) => {
        console.log(values);
        let date = new firebase.firestore.Timestamp.now()
        console.log(date);
        props.setOpenNotesModal(false)
        fireStore.collection('users').doc(props.dbKey).collection('notes').doc(values.subject).set({ 
            createdName: props.userInfo.name,
            createdUID: props.userInfo.uid,
            note: values.notification,
            subject: values.subject,
            date: date,
            readers: [] 
        })
        form.resetFields();
    }

    let onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='notesModalForm' style={{ marginTop: '2em' }}>
        <Form
            name="basic"
            form={form}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >

                <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[
                        {
                            required: true,
                            message: 'Enter a subject',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

            <Form.Item
                label="Notification"
                name="notification"
                rules={[
                    {
                        required: true,
                        message: 'Enter your notification',
                    },
                ]}
            >
                <TextArea rows={6} />
            </Form.Item>

        <Form.Item >
            <Button type="primary" htmlType="submit">
                Submit
            </Button>

        </Form.Item>

    </Form>
        </div>
    )
}

export default NotesModalForm;