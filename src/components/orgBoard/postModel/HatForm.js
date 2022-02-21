import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Form, Input, Button, Select } from 'antd';

import { AuthContext } from '../../context/Context';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

function HatFrom(props) {

    const [form] = Form.useForm();
    const { TextArea } = Input;

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {

        if (props.match.params.hat && dbKey) {
            fireStore.collection("users").doc(dbKey).onSnapshot((snap) => {
                let node = snap.data()[props.match.params.hat]

                form.setFieldsValue({
                    post: node.post,
                    purpose: node.purpose,
                })

            })
        }

    }, [dbKey, props.match.params.hat])

    let onFinish = (values) => {
        console.log('Success:', values);
    };

    let onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                {...layout}
                name="basic"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}

            >

                <Form.Item
                    label="Post Name"
                    name="post"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the post name',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Purpose"
                    name="purpose"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Hatting Material"
                    name="hattingMaterial"
                >
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Product"
                    name="product"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Write-Up"
                    name="writeUp"
                >
                    <TextArea />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>

        </div>
    );
}

export default HatFrom; 