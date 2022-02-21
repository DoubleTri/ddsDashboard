import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { Row, Col, Modal, Form, Input, Button } from 'antd';
import {
    MailOutlined,
    LockOutlined
} from '@ant-design/icons';

function Login() {

    //firebase.auth().useEmulator('http://localhost:9099/');

    const [logInObj, setLogInObj] = useState({ email: null, password: null });
    const [show, setShow] = useState(false)

    const onChangeText = (e) => {
        let newlogInObj = Object.assign({}, logInObj);
        newlogInObj[e.target.id] = e.target.value;
        setLogInObj(newlogInObj)
    }

    const handleSubmit = (e) => {
        const promise = auth.signInWithEmailAndPassword(e.email, e.password);
        promise.catch(e => alert(e.message));
    }

    const onFinishFailed = (e) => {
        console.log(e);
    }

    const forgotPassword = () => {
        var emailAddress = logInObj.passwordChange

        auth.sendPasswordResetEmail(emailAddress).then(function () {
            setShow(false)
            alert('Please check your email for password reset instructions')
        }).catch(function (error) {
            if (error.code === 'auth/user-not-found') {
                alert(emailAddress + ' is not on file')
            } else {
                alert(error.message)
            }
        })
    }

    let pStyle = { backgroundColor: '#DDDDDD', borderRadius: '5px', padding: '1em', margin: '2em' }

    return (
        <Row className='hatWriteUp' justify="center" align="middle" style={{ marginTop: '3em' }} >

        <Col span={16} offset={4} style={pStyle}>

            <Form                 
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed} 
                className="login-form"
                >

                <Col xs={{ span: 20, offset: 2 }} sm={{ span: 12, offset: 6 }} style={{ marginTop: '5em' }} >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} onChange={onChangeText} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password',
                            },
                        ]}
                    >



                        <Input prefix={<LockOutlined />} onChange={onChangeText} type="password" placeholder="Password" />

                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType="submit">Log in</Button>
                        <br />
                        <div onClick={() => setShow(true)}>Forgot password</div>
                        {/* <Link className='linkText' to="/create-account">Create New Account</Link> */}
                    </Form.Item>

                </Col>
            </Form>

            </Col>

            <Modal
                title="Password Recovery"
                visible={show}
                onCancel={() => setShow(false)}
                footer={null}
            >
                <p>Please enter the email address associated with this account</p>
                <Input
                    id='passwordChange'
                    placeholder="Enter Your Email"
                    type="email"
                    onChange={onChangeText}
                />
                <br />
                <br />
                <Button onClick={forgotPassword}>Submit</Button>
                <Button onClick={() => setShow(false)}>Close</Button>
            </Modal>

        </Row>
    );
}

export default Login; 