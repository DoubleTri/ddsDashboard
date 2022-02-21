import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router'; 
import firebase from 'firebase/app';
import { fireStore } from '../../firebase';
import { Form, Input, Switch, Button, message, Popconfirm } from 'antd';

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


function EditEmployee(props) {

    const [loading, setLoading] = useState(false)

    const { dbKey } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            name: props.employee.name,
            email: props.employee.email,
            admin: props.employee.admin
          });
    }, [])


    const onFinish = (values) => {
        setLoading(true)
            fireStore.collection("users").doc(dbKey).collection('employees').doc(props.employee.uid).set({
                name: values.name,
                email: values.email,
                admin: values.admin ? values.admin : false,
                id: values.name,
                uid: props.employee.uid
            })
            message.success(values.name + "'s account has been updated")
            form.resetFields();
            setLoading(false)
            props.setEditMode(false)
    };

    const onDelete = () => {
        let employeeId = props.employee.uid
            // Then delete the employee from database 
            fireStore.collection("users").doc(dbKey).collection('employees').doc(props.employee.uid).delete().then(() => {
            // Then delete the employee from firebase authentication
                //var deleteUser = firebase.functions().httpsCallable('deleteUser');
                //deleteUser({ uid: employeeId });
            }).then(() => {
                fireStore.collection("users").doc(dbKey).update({
                    'uid': firebase.firestore.FieldValue.arrayRemove(employeeId)
                })
            }).then(() => {
                message.success(props.employee.name + "'s has been deleted")
                props.history.push('/org-board')
            })
    }

    return (
        <div className='addEmployee' style={{ marginTop: '5em' }}>

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

                <Form.Item name="admin" label="Admin" valuePropName="checked">
                    <Switch />
                </Form.Item>
                

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>

                    {props.userInfo.admin && props.employee.uid !== props.userInfo.uid ?
                        <Popconfirm
                            title={`Are you sure you want to delete ${props.employee.name}?`}
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

                </Form.Item>

            </Form>
        </div>
    )
}

export default withRouter(EditEmployee);