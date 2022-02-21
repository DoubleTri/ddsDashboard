import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Modal } from 'antd';

import HatPacksTable from './HatPacksTable';

const { Option } = Select;
const { Search } = Input;

function HatPacks(props) {

    const [hatPacks, setHatPacks] = useState(null)
    const [hatPackNames, setHatPackNames] = useState(null)
    const [selected, setSelected] = useState(null)

    const [newHatPackModal, setNewHatPackModal] = useState(false)
    const [newHatPackName, setNewHatPackName] = useState(null)

    useEffect(async() => {
        // let hatPackNamesTemp = []
        // await props.hatPacks.map((hatPack, i) => {
        //     hatPackNamesTemp.push(<Option key={i} data={hatPack} >{hatPack.name}</Option>)
        // })
        // setHatPackNames(hatPackNamesTemp)
        setHatPacks(props.hatPacks)
    }, [props])

    let selectChanged = (pack) => {
        console.log(pack);
    }
    let newHatPackActivation = () => {
        setNewHatPackModal(true) 
    }

    let cancelModel = () => {
        setNewHatPackModal(false)  
    }
    let nameCreated = (name) => {
        if (name) {
            setNewHatPackName(name)
            setNewHatPackModal(false)
        } 
    }

    let pStyle = { backgroundColor: '#b8b8b8', boxShadow: '0px 0px 15px 0px #888888', borderRadius: '5px', padding: '1em', margin: '2em' }

    return (
        <div>
            <Row className='references' justify="center" align="middle" style={{ marginTop: '3em' }} >

                {/* <Col span={24} style={{ textAlign: 'center' }}>
                    {newHatPackName ? <div>
                        <h1>{newHatPackName}</h1>
                        Select references for <b>{newHatPackName}</b> and click "submit" at the bottom
                        </div> : null}
                </Col>
                
          
                    <Col span={4}>
                        <Select
                            style={{ width: '100%', marginRight: '6px' }}
                            placeholder="Select Stat Group"
                            onChange={(e, data) => selectChanged(data.data)}
                            value={selected}
                        >
                            {hatPackNames}
                        </Select>
                        <div className='linkText' style={{ marginTop: '1em' }} onClick={() => newHatPackActivation()}>Create New Hat Pack</div>
                    </Col>  */}

                <Col span={24} style={pStyle}>
                    <HatPacksTable
                        dbKey={props.dbKey}
                        data={props.hatPacks}
                        hatMaterial={props.hatMaterial}
                        allTags={props.allTags}
                    />
                </Col>

            </Row>

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

export default HatPacks;