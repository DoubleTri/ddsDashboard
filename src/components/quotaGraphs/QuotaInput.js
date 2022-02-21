import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, InputNumber, Button } from 'antd';
import 'react-day-picker/lib/style.css';
import QuotaGraph from './QuotaGraph';

function QuotaForm(props) {

    const [quota, setQuota] = useState(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        if(props.statSelected.quota) {
            setEditMode(false)
            setQuota(props.statSelected.quota)
        } else {
            setEditMode(true)
        }
    }, [props.statSelected])

    let onQuotaChange = (e) => {
        setQuota(e)
    }

    let submitQuota = () => {
        let key = 'data.quota' 
        fireStore.collection('users').doc(props.dbKey).collection('quotaGraphs').doc(props.currrentMonth).collection('stats').doc(props.statSelected.stat).update({
            [key]: quota
        })
        props.setChanged(props.statSelected)
        setEditMode(false)
    }

    let pStyle = { backgroundColor: '#ffffff85', boxShadow: '4px 4px 12px 4px #888888', borderRadius: '5px' }

    return (
        <div style={{ margin: '3em' }}>

            {/* { editMode ? 
            <Col className="quotaGraph" span={16} style={{ display: 'flex', justifyContent: 'center', marginTop: '1em', ...pStyle }}>
                <b>Month's Quota:</b><InputNumber  onChange={onQuotaChange} placeholder={props.statSelected.quota} /><Button className='linkText' style={{ textAlign: 'right' }} onClick={() => submitQuota()}>Submit</Button> 
            </Col>
            : null } */}
            
            <Row style={{ margin: '1em' }}>
                <Col span={22} className="quotaGraph" style={pStyle}>
                
                    {/* {!editMode ? <div>
                        <div style={{ float: 'right' }}>Quota: {quota ? quota : null}</div>
                        <br />
                        <div style={{ float: 'right' }}>Bonus: {quota ? quota : null}</div>
                        <br />
                        <div className='linkText' style={{ textAlign: 'right' }} onClick={() => setEditMode(true)}>edit</div>
                    </div>
                        : null} */}

                    <QuotaGraph 
                        currrentMonth={props.currrentMonth}
                        workDays={props.workDays} 
                        statSelected={props.statSelected} 
                        quota={quota} 
                        setChanged={props.setChanged}
                        setStatAdded={props.setStatAdded}
                        dbKey={props.dbKey} 
                    />
                </Col>
            </Row>

        </div>
    );
}

export default QuotaForm; 