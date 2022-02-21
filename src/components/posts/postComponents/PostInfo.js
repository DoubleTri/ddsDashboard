import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, Input, Switch, Button, message } from 'antd';

import { AuthContext } from '../../../context/Context';

const { TextArea } = Input;

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

function PostInfo(props) {

    const { dbKey } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            name: props.name,
            purpose: props.purpose,
            product: props.product
          });
    }, [props])

    let pStyle = { backgroundColor: '#DDDDDD', borderRadius: '5px', padding: '1em', margin: '2em' }

    return (
        <Row className='postInfo' justify="center" align="middle" style={{ marginTop: '3em' }} >

            <Col span={24} style={pStyle}>
                <Form {...layout}
                    form={form}
                    name="nest-messages"
                    validateMessages={validateMessages}
                    requiredMark={false}
                >
                    <Form.Item
                        name={'name'}
                        label="Post Name"
                        rules={[
                            {
                                required: true,
                                max: 23,
                            },
                        ]}
                    >
                        <Input onChange={(e) => props.setName(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name={'purpose'}
                        label="Post Purpose"
                    >
                        <TextArea onChange={(e) => props.setPurpose(e.target.value)} value={props.purpose} />
                    </Form.Item>

                    <Form.Item
                        name={'product'}
                        label="Post Product"
                    >
                        <TextArea onChange={(e) => props.setProduct(e.target.value)} value={props.product} />
                    </Form.Item>

                </Form>
            </Col>

        </Row>
    )
}

export default PostInfo;