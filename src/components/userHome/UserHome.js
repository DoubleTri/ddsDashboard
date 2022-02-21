import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router'; 
import { AuthContext } from '../../context/Context';
import { Row, Col, Radio, Button, Modal } from 'antd';

import HattingWraper from '../newHatting/HattingWrapper';
import StatSubmissionContainer from '../statSubmission/StatSubmissionContainer'
import HomePageQuotaGraphs from '../oic/HomePageQuotaGraphs';
import Notes from './Notes';
import NotesModalForm from './NotesModalForm'

function UserHome(props) {

    const [radioValue, setRadioValue] = useState('user')

    const [openNotesModal, setOpenNotesModal] = useState(false)

    const { userInfo, notes, dbKey, managementDashboard, logout } = useContext(AuthContext);


    useEffect(() => {
        console.log(managementDashboard);
        if (managementDashboard) {
            props.history.push('/management-dashboard')
        }
    }, [userInfo, managementDashboard])

    let onRadioChange = (e) => {
        setRadioValue(e.target.value);
    }
    const radioStyle = {
        fontWeight: 'bold',
    };

    let addNotesModal = () => {
        setOpenNotesModal(true)
    }

    let style={ padding: '1em' }
    let pStyle = { backgroundColor: '#dfdfdf', boxShadow: '4px 4px 12px 4px #888888', borderRadius: '5px' }
   
    return (
        <div className="userHome">
            {/* <div onClick={() => logout()}>logout</div> */}
            { userInfo ? 
            <Row >

                <Col span={9} style={style} className='hattingHomePage'>
                    <h2 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: '400'}}>Hatting Progress</h2>
                    <div style={{ height: '60em' }} ><HattingWraper from='homePage' /></div>
                </Col>

                <Col span={14}>
                    <Col span={24}style={style} className='statsHomePage'>
                        <h2 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: '400'}}>Stats</h2>

                        <div style={{ marginLeft: '2em' }}>
                            {/* <Radio.Group onChange={(e) => onRadioChange(e)} value={radioValue}>
                                <Radio style={radioStyle} value={'user'}>My Stats</Radio>
                                <Radio style={radioStyle} value={'quota'}>Quota Graphs</Radio>
                            </Radio.Group>
                            <hr /> */}
                        </div> 
                        
                      
                        <div style={{ minHeight: '28em'}} ><StatSubmissionContainer from='homePage'/></div>
         
                    </Col>
                    <Col span={24}style={style} className='notesHomePage'>
                        <Row justify="space-between"><h2 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: '400'}}>Notifications</h2><Button className='btnSecondary' onClick={() => addNotesModal()}>Add Notes</Button></Row>
                        <div style={{ height: '18em' }} >
                            <span style={{ padding: '2em' }}>
                                <Notes userInfo={userInfo} notes={notes} dbKey={dbKey} />
                            </span>
                        </div>
                    </Col>
                </Col>
    
            </Row>  
            : null }

            <Modal
                visible={openNotesModal}
                onCancel={() => setOpenNotesModal(false)}
                footer={null}
                width={'60%'}
            >
                <div>
                    <NotesModalForm setOpenNotesModal={setOpenNotesModal} userInfo={userInfo} dbKey={dbKey}/>
                </div>
            </Modal>

        </div>
    );
}

export default withRouter(UserHome); 