import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Row, Col, Form, Input, Switch, Button, message } from 'antd';
import ReactHtmlParser from 'react-html-parser';

import 'react-quill/dist/quill.snow.css';

const layout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 20,
    },
};

const { TextArea } = Input;

function HatWriteUp(props) {

    const [form] = Form.useForm();

    useEffect(() => {
        console.log(props);
        form.setFieldsValue({
            hatWriteUp: props.hatWriteUp,
          });
    }, [])

    var modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link']
        ]
      }
    
    var formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 
      ]

    let pStyle = { backgroundColor: '#DDDDDD', borderRadius: '5px', padding: '1em', margin: '2em' }

    return (
        <Row className='hatWriteUp' justify="center" align="middle" style={{ marginTop: '3em' }} >

            <Col span={24} style={pStyle}>

            {/* <div> { ReactHtmlParser (props.hatWriteUp) } </div> */}

                <Form {...layout}
                    form={form}
                    name="nest-messages"
                    // onFinish={props.onFinish}
                    requiredMark={false}
                >

                    <Form.Item
                        name={'hatWriteUp'}
                        label="Hat Write-Up"
                    >
                        <ReactQuill 
                            theme="snow" 
                            modules={modules}
                            formats={formats}
                            style={{ height: "500px", marginBottom: "50px", backgroundColor: 'white'}}
                            onChange={(e) => props.setHatWriteUp(e)}
                            value={props.hatWriteUp}
                            />
                    </Form.Item>

                </Form>
            </Col>

        </Row>
    )
}

export default HatWriteUp;