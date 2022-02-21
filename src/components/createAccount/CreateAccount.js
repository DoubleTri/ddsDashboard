import React, { useState } from 'react';
import { auth, fireStore } from '../../firebase'

import { Form, Input, Button, Divider, Select, DatePicker, Col } from 'antd';
import moment from 'moment';

import RandomId from '../../functions/RandomId';

import NewMGEDentalOrgBoard from './dataToDb/NewMGEDentalOrgBoard';
import twentyOneDept from './dataToDb/twentyOneDept';

// if (window.location.hostname === "localhost") {
//     fireStore.useEmulator("localhost", 8080);
// }


const { Option } = Select;

let len = 10;
let pattern = 'aA0'


function CreateAccount(props) {

    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm();

    const handleSubmit = async (e) => {

        setLoading(true)
        let tempStatArr = []

        let date = new Date(e.weekEnding)
        let current = Date.parse(e.weekEnding)
        let last = new Date(date.setDate(date.getDate() - 7))
        last = Date.parse(last)
        let two = new Date(date.setDate(date.getDate() - 7))
        two = Date.parse(two)
        let three = new Date(date.setDate(date.getDate() - 7))
        three = Date.parse(three)
        let four = new Date(date.setDate(date.getDate() - 7))
        four = Date.parse(four)
        let five = new Date(date.setDate(date.getDate() - 7))
        five = Date.parse(five)
        let six = new Date(date.setDate(date.getDate() - 7))
        six = Date.parse(six)
        let seven = new Date(date.setDate(date.getDate() - 7))
        seven = Date.parse(seven)
        let eight = new Date(date.setDate(date.getDate() - 7))
        eight = Date.parse(eight)
        let nine = new Date(date.setDate(date.getDate() - 7))
        nine = Date.parse(nine)
        let ten = new Date(date.setDate(date.getDate() - 7))
        ten = Date.parse(ten)
        let eleven = new Date(date.setDate(date.getDate() - 7))
        eleven = Date.parse(eleven)
        let twelve = new Date(date.setDate(date.getDate() - 7))
        twelve = Date.parse(twelve)
        let thirteen = new Date(date.setDate(date.getDate() - 7))
        thirteen = Date.parse(thirteen)
        let fourteen = new Date(date.setDate(date.getDate() - 7))
        fourteen = Date.parse(fourteen)
        let fifteen = new Date(date.setDate(date.getDate() - 7))
        fifteen = Date.parse(fifteen)
        let sixteen = new Date(date.setDate(date.getDate() - 7))
        sixteen = Date.parse(sixteen)
        let seventeen = new Date(date.setDate(date.getDate() - 7))
        seventeen = Date.parse(seventeen)
        let eightteen = new Date(date.setDate(date.getDate() - 7))
        eightteen = Date.parse(eightteen)
        let nineteen = new Date(date.setDate(date.getDate() - 7))
        nineteen = Date.parse(nineteen)
        let twenty = new Date(date.setDate(date.getDate() - 7))
        twenty = Date.parse(twenty)
        let twentyone = new Date(date.setDate(date.getDate() - 7))
        twentyone = Date.parse(twentyone)
        let twentytwo = new Date(date.setDate(date.getDate() - 7))
        twentytwo = Date.parse(twentytwo)
        let twentythree = new Date(date.setDate(date.getDate() - 7))
        twentythree = Date.parse(twentythree)
        let twentyfour = new Date(date.setDate(date.getDate() - 7))
        twentyfour = Date.parse(twentyfour)
        let twentyfive = new Date(date.setDate(date.getDate() - 7))
        twentyfive = Date.parse(twentyfive)
        let twentysix = new Date(date.setDate(date.getDate() - 7))
        twentysix = Date.parse(twentysix)
        let twentyseven = new Date(date.setDate(date.getDate() - 7))
        twentyseven = Date.parse(twentyseven)
        let twentyeight = new Date(date.setDate(date.getDate() - 7))
        twentyeight = Date.parse(twentyeight)
        let twentynine = new Date(date.setDate(date.getDate() - 7))
        twentynine = Date.parse(twentynine)
        let thirty = new Date(date.setDate(date.getDate() - 7))
        thirty = Date.parse(thirty)
        let thirtyone = new Date(date.setDate(date.getDate() - 7))
        thirtyone = Date.parse(thirtyone)
        let thirtytwo = new Date(date.setDate(date.getDate() - 7))
        thirtytwo = Date.parse(thirtytwo)
        let thirtythree = new Date(date.setDate(date.getDate() - 7))
        thirtythree = Date.parse(thirtythree)
        let thirtyfour = new Date(date.setDate(date.getDate() - 7))
        thirtyfour = Date.parse(thirtyfour)
        let thirtyfive = new Date(date.setDate(date.getDate() - 7))
        thirtyfive = Date.parse(thirtyfive)
        let thirtysix = new Date(date.setDate(date.getDate() - 7))
        thirtysix = Date.parse(thirtysix)

        form.resetFields();

        await auth.createUserWithEmailAndPassword(e.email, e.password).then((user) => {

            if (user) {
                user.user.updateProfile({
                    displayName: e.firstName + ' ' + e.lastName
                })
            }
        }).catch(function (error) {
            alert(error.message)
        }).then(() => {
            waitForCurrentUser()
        });

        var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
        var d = new Date();

        let quotaGraphsId = monthNames[d.getMonth()] + d.getFullYear()

        async function waitForCurrentUser() {
            try {
                let uid = await auth.currentUser.uid;
                if (uid) {
                    clearInterval(waitForCurrentUser)

                    let board;

                    if (e.boardType === 'standard') {
                        board = await twentyOneDept(e.weekEnding)
                    } else if (e.boardType === 'dental') {
                        board = await NewMGEDentalOrgBoard(e.weekEnding)
                    }

                    let accountInfo = {
                        uid: [uid],
                        businessName: e.businessName,
                        //businessType: e.businessType,
                        //businessDescription: e.businessDescription,
                        firstName: e.firstName,
                        lastName: e.lastName,
                        email: e.email,
                        vfp: 'click here to edit the Org Board VFP',
                        boardType: e.boardType,
                        selectionType: 'exects',
                        weekEndNext: Date.parse(e.weekEnding),
                        OICboard: [],
                        consultant: e.boardType
                    }
                    let id = RandomId(len, pattern);
                    console.log('here....');
                    fireStore.collection("users").doc(e.businessName).set({
                        ...accountInfo 
                    })
                    .then(() => {
                        // CREATE EMPLOYEE/USERS SUB-COLLECTION
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('employees').doc(auth.currentUser.uid)
                            .set({
                                name: e.firstName + ' ' + e.lastName,
                                email: e.email,
                                admin: true,
                                id: id,
                                uid: auth.currentUser.uid,
                                referencesRead: []
                            })
                    })
                    .then(() => {
                        // CREATE ORG BOARD SUB-COLLECTION
                        Object.entries(board).map((item) => {
                            console.log(item);
                            return fireStore.collection("users").doc(e.businessName)
                                .collection('orgBoard').doc(item[0])
                                .set(item[1])
                        })
                    }).then(() => {
                        // CREATE HATTING MATERIAL AND ITS SUB-COLLECTIONS
                        fireStore.collection("users").doc(e.businessName)
                            .collection('hattingMaterial').doc('hatPacks')
                            .set({})
                    }).then(() => {
                        fireStore.collection("users").doc(e.businessName)
                            .collection('hattingMaterial').doc('hattingMaterial')
                            .set({})
                    }).then(() => {
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('hattingMaterial').doc('tags')
                            .set({ tags: [] })
                    }).then(() => {
                        // CREATE QUOTA GRAPHS
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('quotaGraphs').doc(quotaGraphsId).set({
                                current: true,
                                id: monthNames[d.getMonth()] + d.getFullYear(),
                                month: monthNames[d.getMonth()],
                                workingDays: []
                            })
                    })
                    .then(() => {
                        // CREATE QUOTA GRAPHS STATS SUB-COLLECTION COLLECTIONS
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('quotaGraphs').doc(quotaGraphsId).collection('stats').doc('COLLECTIONS').set({
                                data: {},
                                stats: []
                            })
                    }).then(() => {
                        // CREATE QUOTA GRAPHS STATS SUB-COLLECTION NEW PATIENTS
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('quotaGraphs').doc(quotaGraphsId).collection('stats').doc('NEW PATIENTS').set({
                                data: {},
                                stats: []
                            })
                    }).then(() => {
                        // CREATE QUOTA GRAPHS STATS SUB-COLLECTION PRODUCTION
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('quotaGraphs').doc(quotaGraphsId).collection('stats').doc('PRODUCTION').set({
                                data: {},
                                stats: []
                            })
                    })
                    .then(() => {
                        // CREATE STATS SUB-COLLECTION
                        Object.values(board).map((obj) => {
                            Object.entries(obj).map(async (item) => {
                                if (item[0] === "statIdArr") {
                                    await item[1].map((stat) => {
                                        tempStatArr.push(stat)
                                        return fireStore.collection("users").doc(e.businessName)
                                            .collection('stats').doc(stat)
                                            .set({
                                                data: {
                                                    id: stat,
                                                    description: null,
                                                    quotaGraph: stat === 'COLLECTIONS' || stat === 'NEW PATIENTS' || stat === 'PRODUCTION' ? true : false,
                                                    // In the giant pre-made, business specfic org boards, "non-perm" (not permanent) was added to the end of all the randomly  
                                                    // generated statIds.  Here we look for that "non-perm" marker with substring() and if found change the name and permanent boolean 
                                                    name: stat.substring(12, stat.length) === "non-perm" ? "stat name" : stat,
                                                    upsideDown: false,
                                                    permanent: stat.substring(12, stat.length) === "non-perm" ? false : true,
                                                    postData: {
                                                        postName: obj.post,
                                                        postId: obj.id
                                                    }
                                                },
                                                stats: [
                                                    { name: thirtysix, stat: 0, notes: [] },
                                                    { name: thirtyfive, stat: 0, notes: [] },
                                                    { name: thirtyfour, stat: 0, notes: [] },
                                                    { name: thirtythree, stat: 0, notes: [] },
                                                    { name: thirtytwo, stat: 0, notes: [] },
                                                    { name: thirtyone, stat: 0, notes: [] },
                                                    { name: thirty, stat: 0, notes: [] },
                                                    { name: twentynine, stat: 0, notes: [] },
                                                    { name: twentyeight, stat: 0, notes: [] },
                                                    { name: twentyseven, stat: 0, notes: [] },
                                                    { name: twentysix, stat: 0, notes: [] },
                                                    { name: twentyfive, stat: 0, notes: [] },
                                                    { name: twentyfour, stat: 0, notes: [] },
                                                    { name: twentythree, stat: 0, notes: [] },
                                                    { name: twentytwo, stat: 0, notes: [] },
                                                    { name: twentyone, stat: 0, notes: [] },
                                                    { name: twenty, stat: 0, notes: [] },
                                                    { name: nineteen, stat: 0, notes: [] },
                                                    { name: eightteen, stat: 0, notes: [] },
                                                    { name: seventeen, stat: 0, notes: [] },
                                                    { name: sixteen, stat: 0, notes: [] },
                                                    { name: fifteen, stat: 0, notes: [] },
                                                    { name: fourteen, stat: 0, notes: [] },
                                                    { name: thirteen, stat: 0, notes: [] },
                                                    { name: twelve, stat: 0, notes: [] },
                                                    { name: eleven, stat: 0, notes: [] },
                                                    { name: ten, stat: 0, notes: [] },
                                                    { name: nine, stat: 0, notes: [] },
                                                    { name: eight, stat: 0, notes: [] },
                                                    { name: seven, stat: 0, notes: [] },
                                                    { name: six, stat: 0, notes: [] },
                                                    { name: five, stat: 0, notes: [] },
                                                    { name: four, stat: 0, notes: [] },
                                                    { name: three, stat: 0, notes: [] },
                                                    { name: two, stat: 0, notes: [] },
                                                    { name: last, stat: 0, notes: [] },
                                                    { name: current, stat: 0, notes: [] }
                                                ]
                                            })
                                    })
                                }
                            })
                            return null;
                        })
                        // let functionCall = firebase.functions().httpsCallable('cronTestTwo');
                        // functionCall()
                    }).then(() => {
                        // CREATE STATGROUP SUB-COLLECTION
                        return fireStore.collection("users").doc(e.businessName)
                            .collection('statGroup').doc("All Stats")
                            .set({
                                name: 'All Stats',
                                statArr: tempStatArr
                            })
                    })
                    .catch(function (error) {
                            console.error("Error adding document: ", error);
                        });
                }
                else {
                    console.log('Wait for it');
                }
            }
            catch (e) {
                console.log(e)
                setLoading(false)
            }
        };

    }

    const onFinishFailed = (e) => {
        console.log('failed', e);
    }

    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 6,
            span: 14,
        },
    };

    return (
        <Col className="CreateAccount formStyle">

            <Form
                {...layout}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                requiredMark={'optional'}
                className="CreateAccountForm"
                form={form}
            >

                <Divider orientation="left">Business Info</Divider>

                <Form.Item
                    label="Business Name"
                    name="businessName"
                    rules={[
                        {
                            required: true,
                            message: 'Business name is requried',
                        },
                    ]}
                >
                    <Input placeholder="Business Name" />
                </Form.Item>

                <Form.Item
                    label="Business Address"
                    name="businessAddress"
                    rules={[
                        {
                            required: true,
                            message: 'Business address is requried',
                        },
                    ]}
                >
                    <Input placeholder="Business Address" />
                </Form.Item>

                <Form.Item
                    name="boardType"
                    label="Org Board Type"
                    rules={[
                        {
                            required: true,
                            message: 'Org Board type is required',
                        },
                    ]}
                >

                    <Select placeholder="Please select your org board type">
                        <Option value="dental">Dental</Option>
                        <Option value="standard">Generic 21 Dept.</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="weekEnding"
                    label="Next Week Ending"
                    rules={[
                        {
                            required: true,
                            message: 'Select the date and time of your next week ending',
                        },
                    ]}
                >
                    <DatePicker style={{ width: '50%' }} placeholder="Select Next Week Ending" format="MMM Do h:mm a" showTime={{ defaultValue: moment('00:00', 'h:mm a') }} />
                </Form.Item>

                <Divider orientation="left">User Info</Divider>

                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name',
                        },
                    ]}
                >
                    <Input placeholder="First Name" />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name',
                        },
                    ]}
                >
                    <Input placeholder="Last Name" />
                </Form.Item>

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
                    <Input placeholder="Email" type='email' />
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
                    <Input placeholder="Create a Password" type='password' />
                </Form.Item>


                <Form.Item {...tailLayout}>
                    <Button htmlType="submit" loading={loading}>Create Account</Button>
                    <br />
                </Form.Item>

            </Form>

        </Col>
    );
}

export default CreateAccount; 