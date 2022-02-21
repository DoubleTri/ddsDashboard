import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Form, Input, Button, Checkbox, Select, TreeSelect } from 'antd';
import RandomId from '../../functions/RandomId'

let len = 10;
let pattern = 'aA0'

const { TextArea } = Input;
const { Option } = Select;

function CustomNodeForm(props) {

    const [value, setValue] = useState(null)
    const [postId, setPostId] = useState(null)

    const [policyOptions, setPolicyOptions] = useState(null)
    const [selectedPolicies, setSelectedPolicies] = useState([])

    const [routeToOtherFlowChart, setRouteToOtherFlowChart] = useState(false)

    const [allFlowCharts, setAllFlowCharts] = useState(null)

    const [form] = Form.useForm();

    useEffect(() => {
        console.log(props);
        if (props.hattingMaterial) {
            let policyOptionsTemp = []
            Object.values(props.hattingMaterial).map((item, i) => {
                policyOptionsTemp.push(<Select.Option key={i} data={item} value={item.title}>{item.title}</Select.Option>)
            })
            setPolicyOptions(policyOptionsTemp)
        }

        let allFlowChartsTemp = []
        props.allFlowCharts.map((item, i) => {
            allFlowChartsTemp.push(<Select.Option key={i} data={item} value={item.data.name}>{item.data.name}</Select.Option>)
        })
        setAllFlowCharts(allFlowChartsTemp)

        if (props.nodeSelected) {
            form.setFieldsValue({
                post: props.nodeSelected.data.post,
                change: props.nodeSelected.data.change,
                policy: props.nodeSelected.data.policy
            })
        } else {
            form.resetFields();
        }
    }, [props])

    const onFinish = (values) => {
        const newNode = {
            id: RandomId(len, pattern),
            type: 'selectorNode',
            data: { 
                post: values.post[0], 
                postId: values.post[1], 
                change: values.change, 
                policy: values.policy ? values.policy : [],
                startPoint: !props.elements.length },
            position: {
                x: window.innerWidth - 500,
                y: window.innerHeight - 500,
            },
            selectable: true
        };
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).update({
            elements :  props.elements.concat(newNode)
        })
        props.closeNodeModalEdit()
        form.resetFields();
    };
    const onSubmitEdit = (values) => {
        let elementsTemp = props.elements
        let effectedNodeIndex = elementsTemp.findIndex((obj => obj.id === props.nodeSelected.id));
        props.elements[effectedNodeIndex].data = { 
            post: Array.isArray(values.post) ? values.post[0] : values.post, 
            postId: Array.isArray(values.post) ? values.post[1] : props.elements[effectedNodeIndex].data.postId, 
            change: values.change,
            policy: values.policy ? values.policy : null,
            startPoint: props.nodeSelected.data.startPoint ? props.nodeSelected.data.startPoint : false
        }
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).update({
            elements : elementsTemp
        })
        props.closeNodeModalEdit()
        form.resetFields();
    }
    const deleteNode = () => {
        let elementsTemp = props.elements
        let effectedNodeIndex = elementsTemp.findIndex((obj => obj.id === props.nodeSelected.id));
        elementsTemp.splice(effectedNodeIndex, 1)
        let arrowRemovalSource = elementsTemp.filter((node) => node.source !== props.nodeSelected.id )
        let arrowRemovalTarget = arrowRemovalSource.filter((node) => node.target !== props.nodeSelected.id )
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).update({
            elements : arrowRemovalTarget
        })
        props.closeNodeModalEdit()
        form.resetFields();
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    let onSubmitOtherFlowChart = (values) => {
        console.log(values);

        const newNode = {
            id: RandomId(len, pattern),
            type: 'otherFlowChart',
            data: { 
                flowChart: values.otherFlowChart
            },
            position: {
                x: window.innerWidth - 500,
                y: window.innerHeight - 500,
            },
            selectable: false
        };
        fireStore.collection("users").doc(props.dbKey).collection('flowCharts').doc(props.selectedFlowChart).update({
            elements :  props.elements.concat(newNode)
        })

        props.closeNodeModalEdit()
        setRouteToOtherFlowChart(false)
        form.resetFields();
    }


    let onChange = (e) => {
        setValue(e[0])
        setPostId(e[1])
    }



    return (<div>
        { !routeToOtherFlowChart ? 
        <Form
            name="basic"
            form={form}
            initialValues={{
                remember: true,
            }}
            onFinish={props.nodeSelected ? onSubmitEdit : onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Post"
                name="post"
                rules={[
                    {
                        required: true,
                        message: 'Please select the post responsible for this action',
                    },
                ]}
            >
                <TreeSelect
                    style={{ width: '100%' }}
                    value={value}
                    dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                    treeData={props.postTree}
                    placeholder="Please select"
                    treeDefaultExpandAll={true}
                    onChange={onChange}
                >

                </TreeSelect>
            </Form.Item>

                {!props.nodeSelected ?
                    <span className='linkText' style={{ float: 'right' }} onClick={() => setRouteToOtherFlowChart(true)}>Route to other flow chart</span>
                    : null}
                <br />

            <Form.Item
                label="Change"
                name="change"
                rules={[
                    {
                        required: true,
                        message: 'Please describe how the particle will be changed',
                    },
                ]}
            >
                <TextArea rows={6} />
            </Form.Item>

            <Form.Item
                label="Policy"
                name="policy"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Select
                    mode="multiple"
                    //onChange={(e, data, datatwo) => policyChange(e, data, datatwo)}
                    //defaultValue={selectedPolicies}
                    >
                    {setPolicyOptions ? policyOptions : null}
                </Select>
            </Form.Item>

            <Form.Item >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>

                { props.nodeSelected && !props.nodeSelected.data.startPoint ? <div style={{ float: 'right' }} onClick={() => deleteNode()}>delete</div> : null  }

            </Form.Item>

        </Form>
        :

        <Form
        name="basic"
        form={form}
        initialValues={{
            remember: true,
        }}
        onFinish={onSubmitOtherFlowChart}
        onFinishFailed={onFinishFailed}
    >


        <Form.Item
                label="Flow Charts"
                name="otherFlowChart"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Select>
                    {allFlowCharts ? allFlowCharts : null}
                </Select>
            </Form.Item>
            <span className='linkText' style={{ float: 'right' }} onClick={() => setRouteToOtherFlowChart(false)}>Route to terminal</span>



        <Form.Item >
            <Button type="primary" htmlType="submit">
                Submit
            </Button>

        </Form.Item>

    </Form>
        
        }
        </div>
    );
};

export default CustomNodeForm;