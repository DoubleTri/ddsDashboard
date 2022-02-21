import React, { useEffect, useState } from 'react';
import { fireStore } from '../../firebase';
import { Form, Input, Switch, Button, message, Popconfirm } from 'antd';
import { 
    MinusCircleOutlined, 
    PlusOutlined } from '@ant-design/icons';

import RandomId from '../../functions/RandomId';

let len = 10;
let pattern = 'aA0'

const layout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
};

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
  };

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        span: 18,
        offset: 5
    },
  };

const validateMessages = {
    required: '${label} is required',
};

function SectionsForm(props) {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        if (props.node) {
            form.setFieldsValue({
                description: props.node.post,
                functions: props.node.functions
            });
        }
    }, [])
    
    let onFinish = (values) => {
        let dbId = RandomId(len, pattern);
        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(dbId).set({
            post: values.description,
            type: 'hat',
            section: true,
            functions: values.functions ? values.functions : null,
            childOf: null,
            position: null,
            id: dbId,
            purpose: null,
            product: null,
            statIdArr: [],
            hatWriteUp: '',
        }).then(() => {
            props.setNewSectionModal(false)
            setLoading(false)
            form.resetFields();
        })
    }

    let onUpdate = (values) => {
        setLoading(true)
        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.node.id).update({
            post: values.description,
            functions: values.functions,
        }).then(() => {
            props.setNewSectionModal(false)
            setLoading(false)
        })
    }

    let handleRemove = () => {
        console.log(props.node);
        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.node.id).update({
            childOf: null
        }).then(() => {
            props.setNewSectionModal(false)
        })
    }

    let handleDelete = () => {
        setDeleteLoading(true)
        fireStore.collection("users").doc(props.dbKey).collection('orgBoard').doc(props.node.id).delete().then(() => {
            props.setNewSectionModal(false)
        }).then(() => {
            setDeleteLoading(false)
            form.resetFields();
        })
    }



    return (
        <div className='sectionsForm'>

        <h3>Sections</h3>

            <Form {...layout}
                form={form}
                name="nest-messages"
                onFinish={ props.node ? onUpdate: onFinish }
                validateMessages={validateMessages}
                requiredMark={false}
            >
                <Form.Item
                    name={'description'}
                    label="Description"
                    rules={[
                        {
                            required: true,
                            max: 55
                            
                        },
                    ]}
                >
                    <Input />
                </Form.Item>


                <Form.List
                    name="functions"
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    label={index === 0 ? 'Functions' : ''}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Please input a function or delete this field.",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="Function" style={{ width: '80%' }} />
                                    </Form.Item>
                                    {fields.length > 0 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 5 }}>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '60%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Add Function
              </Button>
    
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>


                <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                    <Button type="primary" htmlType="submit" loading={loading} onClick={() => setLoading(true)}>
                        Submit
                    </Button>
                </Form.Item>

                { props.node ? <div>
                        <Button onClick={handleRemove} >Remove From Org Board</Button>
                        <Button onClick={handleDelete} loading={deleteLoading}>Delete</Button>
                        </div>
                        : null}
            </Form>

        </div>
    )
}

export default SectionsForm;