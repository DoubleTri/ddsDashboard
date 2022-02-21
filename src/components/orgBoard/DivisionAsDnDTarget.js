import React, { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'antd'

import DeptAsDnDTarget from './DeptAsDnDTarget';
import EmployeeDnDTarget from './EmployeeDnDTarget';
import BeatLoader from 'react-spinners/BeatLoader';

//import { AuthContext } from '../context/UserContext';

function TargetDivision(props) {

    const [stateDeptArr, setStateDeptArr] = useState(props.node.depts)
    const [deptLoading, setDeptLoading] = useState(null)

    //const { dbObj } = useContext(AuthContext);

    useEffect(() => {
        console.log();
        let hatArr = []
        stateDeptArr.forEach((hat, i) => {
            hatArr.push(hat)
        })
        hatArr.sort((a, b) => { return a.position - b.position })
        setStateDeptArr(hatArr)
    }, [])

    return (
        <div style={{ fontSize: props.modal ? '1.4em' : null, textAlign: 'center', borderRadius: '5px' }}>

            <EmployeeDnDTarget hat={props.node} dbKey={props.dbKey} type={props.type} mode={props.mode} modal={props.modal} dbObj={props.dbObj} />

            <div className="renderDivisions" >
                <Row type="flex" justify="space-between">{props.node.depts.map((item, i) => {
                    if (item.id !== deptLoading) {
                        return <Col key={i} span={8} className='departments' style={{ border: '0.25px solid gray' }}>
                            <DeptAsDnDTarget node={item} dbKey={props.dbKey} backgroundColor={props.node.backgroundColor} dbObj={props.dbObj} setDeptLoading={setDeptLoading} />
                        </Col>
                    } else {
                        return <Col key={i} span={8} className='departments' style={{ border: '0.25px solid gray' }}>
                            <div className='updateText' style={{ textAlign: 'center', paddingTop: '5em' }}>Updating Database<span><BeatLoader color={'gray'} /></span></div>
                        </Col>
                    }
                })
                }</Row>

            </div>

            <div className='divVfp'>VFP: {props.node.product}</div>
            
        </div>
    );
}

export default TargetDivision;