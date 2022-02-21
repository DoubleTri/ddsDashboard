import React, { useState, useEffect } from 'react';
import { fireStore } from '../../../firebase';
import { Row, Col, Select, Button, Divider } from 'antd';
import {
    CloseCircleOutlined,
  } from '@ant-design/icons';

import EditHatPack from '../../hattingMaterial/hatPacks/EditHatPack';
import HatPacksTable from '../../hattingMaterial/hatPacks/HatPacksTable';

const { Option } = Select;

function HattingMaterial(props) {

    const [hattingMaterial, setHattingMaterial] = useState(null)
    const [hatPacks, setHatPacks] = useState(null)
    const [thisPost, setThisPost] = useState(null)

    const [references, setReferences] = useState(null)
    const [assignedHatPacks, setAssignedHatPacks] = useState([])

    const [addReferences, setAddReferences] = useState(false)
    const [addHatPack, setAddHatPack] = useState(false)

    useEffect(() => {

        fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(props.id).onSnapshot((snap) => {

            if (snap.data()) {
                if (snap.data().references) {
                    setReferences(snap.data().references)
                }
                if (snap.data().hatPacks) {
                    setAssignedHatPacks(snap.data().hatPacks) 
                }
            } 

            setThisPost({id: props.id,
                key: Math.floor(Math.random() * Math.floor(100000000)),
                name: props.name,
                references: snap.data() && snap.data().references ? snap.data().references : null })

            let hatPacksTempArr = []
            props.allHatPacks.sort((a, b) => a.name.localeCompare(b.name))
            console.log(props);
            props.allHatPacks.map((doc, i) => {
                if (snap.data() && snap.data().hatPacks && !snap.data().hatPacks.some(e => e.name === doc.name)) {
                    hatPacksTempArr.push(<Option key={i} value={doc.name} data={doc}>{doc.name}</Option>)
                }
            })
            setHatPacks(hatPacksTempArr)
        })

        let hattingMaterialTempArr = []
        props.allHattingMaterial.sort((a, b) => a.title.localeCompare(b.title))
        props.allHattingMaterial.map((doc, i) => {
            hattingMaterialTempArr.push(<Option key={i} data={doc.url} >{doc.title}</Option>)
        })
        setHattingMaterial(hattingMaterialTempArr)


    },[props])

    let handleHatPackChange = (e, data) => {
        let newHatPacks = assignedHatPacks
        newHatPacks.push({
            id: data.data.id,
            key: data.data.key,
            name: data.data.name,
            references: data.data.references
        })
        fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(props.id).update({ hatPacks: newHatPacks })
    }

    let pStyle = { backgroundColor: '#DDDDDD', borderRadius: '5px', padding: '1em', margin: '2em' }

    return (
        <Row className='hattingMaterial' justify="center" align="middle" style={{ marginTop: '3em' }} >

            <Col span={24} style={pStyle}>

                {addReferences ?
                    <EditHatPack
                        dbKey={props.dbKey}
                        hatPackToBeEdited={thisPost}
                        setHatPackToBeEdited={setAddReferences}
                        setNewHatPackName={null}
                        hatMaterial={props.allHattingMaterial}
                        allTags={props.allTags}
                        from='post'
                    />
                    : <Row justify="center" >
                        <Col span={10} className='hatPackSequence' style={{ textAlign: 'left', margin: '2em' }}>
                            <Divider orientation="left">Individual Hatting References</Divider>
                            <hr />
                            {references ? references.map((ref, i) => {
                                return <li key={i} onClick={() => window.open(ref.url, "_blank")}>{ref.name}</li>
                            }) : null}
                            <hr style={{ marginBottom: '2em' }} />
                            <Button type="primary" style={{ position:'absolute', bottom:'0', right: '0', margin: '1em'}} onClick={() => setAddReferences(true)}>Add Hatting References</Button>
                        </Col>

                        <Col span={10} className='hatPackSequence' style={{ margin: '2em' }}>
                        <Divider orientation="left">Hat Packs</Divider>
                            <HatPacksTable
                                dbKey={props.dbKey}
                                data={assignedHatPacks}
                                hatMaterial={props.allHattingMaterial}
                                allTags={props.allTags}
                                post={props.name}
                                id={props.id}
                                from='post'
                            />
                           <hr style={{ marginBottom: '2em' }} />

                        { addHatPack ? 
                                <div style={{ position: 'absolute', bottom: '0', right: '0', margin: '1em'  }}>
                                    <div>
                                    <Select value={null} style={{ width: 250 }} onChange={(e, data) => handleHatPackChange(e, data)}>
                                            {hatPacks}
                                        </Select>
                                    <span onClick={() => setAddHatPack(false)}> <CloseCircleOutlined /> </span>
                                    </div>
                                </div>
                        : 
                            <Button type="primary" style={{ position:'absolute', bottom:'0', right: '0', margin: '1em' }} onClick={() => setAddHatPack(true)}>Add Hat Pack</Button>
                        }
                        </Col>
                    </Row>
                }

                {/* <Col span={5}>
                    <Select value={null} style={{ width: 120 }} onChange={handleHattingMaterialChange}>
                        {hattingMaterial}
                    </Select>
                </Col>
                <Col span={5}>
                    <Select value={null} style={{ width: 120 }} onChange={handleHatPackChange}>
                        {hatPacks}
                    </Select>
                </Col> */}
            </Col>

        </Row>
    )
}

export default HattingMaterial;