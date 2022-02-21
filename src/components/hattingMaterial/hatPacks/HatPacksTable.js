import React, { useState, useEffect } from 'react';
import { fireStore } from '../../../firebase';
import firebase from 'firebase/app';
import { Col, Table, Input, Modal, Divider, Popconfirm } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import EditHatPack from './EditHatPack';

const { Search } = Input;

function HatPacksTable(props) {

    const [data, setData] = useState(null)
    const [uneditedData, setUneditedData] = useState(null)
    const [value, setValue] = useState(null);

    const [newHatPackModal, setNewHatPackModal] = useState(false)
    const [newHatPackName, setNewHatPackName] = useState(null)
    const [hatPackToBeEdited, setHatPackToBeEdited] = useState(null)

    useEffect(() => {
        console.log(props);
        let dataTemp = []
        if (props.data) {
            props.data.map((item, i) => {
                dataTemp.push({"key": item.key,
                "id": item.id,
                "hatPack": <div>{item.name}</div>,
                "references": <div>{ item.references.map((ref, i) => { 
                    return <div className='linkText' key={i} onClick={() => window.open(ref.url, "_blank")} >{ref.name}</div> } 
                    )}<div className='linkText' style={{ float: 'right' }} onClick={() => editHatPack(item)}>EDIT</div></div>,
                "fullData": item,
                })
            })
            dataTemp.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))   
            setData(dataTemp)
            setUneditedData(dataTemp)
        }
    }, [props])

    let editHatPack = (hatPack) => {
        setHatPackToBeEdited(hatPack);
    }

    let createNewHatPack = () => {
        setNewHatPackModal(true)
    }
    let nameCreated = (name) => {
        if (name) {
            setNewHatPackName(name)
            setNewHatPackModal(false)
            setHatPackToBeEdited({
                id: name,
                key: Math.floor(Math.random() * Math.floor(100000000)),
                name: name,
                references: []
            })
        } 
    }
    let cancelModel = () => {
        setNewHatPackModal(false)
        setNewHatPackName(null)
    }

    let removeHatPack = (ref) => {
        fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(props.id).update({
            'hatPacks': firebase.firestore.FieldValue.arrayRemove(ref.fullData)
        })
    }
    
    let FilterByNameInput = (
        <Input
            placeholder="Search For Hat Pack"
            value={value}
            onChange={e => {
                const currValue = e.target.value;
                if (currValue) {
                    setValue(currValue);
                    const filteredData = data.filter(entry =>
                        entry.id.includes(currValue)
                    );
                    setData(filteredData);
                }
                else{
                    setValue(null);
                    setData(uneditedData);
                }
            }}
        />
    );
    

    let postColumns = [
        {
            title: props.from === 'post' ? null : FilterByNameInput,
            dataIndex: 'hatPack',
        }, {
            title: null,
            key: 'action',
            render: (ref) => (

                <span>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={`Are you sure you want to remove ${ref.id} from ${props.post}?`}
                        placement="bottom"
                        onConfirm={() => removeHatPack(ref)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </span>
            ),
        }
    ];

    let columns = [
        {
            title: props.from === 'post' ? 'Hat Packs' : FilterByNameInput,
            dataIndex: 'hatPack',
        }
    ]

    return (
        <div className='hatPacksTable'>

            {!hatPackToBeEdited ?
                <Col span={24} >
                    <Table
                        className="table-striped-rows"
                        pagination={false}
                        columns={props.from === 'post' ? postColumns : columns}
                        dataSource={data}
                        expandable={{
                            expandedRowRender: record => <div style={{ margin: 0 }}>{record.references}</div>,
                            rowExpandable: record => record.name !== 'Not Expandable',
                        }}
                    />
                    {props.from !== 'post' ?
                        <div className='linkText' style={{ float: 'right' }}>
                            <span onClick={() => createNewHatPack()}><PlusOutlined /> Create New Hat Pack</span>
                        </div>
                        : null}
                </Col>
                :
                <EditHatPack
                    dbKey={props.dbKey}
                    hatPackToBeEdited={hatPackToBeEdited}
                    setHatPackToBeEdited={setHatPackToBeEdited}
                    setNewHatPackName={setNewHatPackName}
                    hatMaterial={props.hatMaterial}
                    allTags={props.allTags}
                />
            }

            <Modal
                visible={newHatPackModal}
                onCancel={() => cancelModel()}
                footer={null}
            >
                <b>Name Your New Hat Pack</b>
                <div>
                    <Search
                        placeholder="Hat Pack Name"
                        allowClear
                        enterButton="Submit"
                        size="large"
                        onSearch={(e) => nameCreated(e)}
                    />
                </div>
            </Modal>

        </div>
    )
}

export default HatPacksTable;