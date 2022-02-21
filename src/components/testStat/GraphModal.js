import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Row, Col, Modal, Button, Popconfirm, Radio } from 'antd';

import TestStatWrapper from './TestStatWrapper';


function GraphModal(props) {

    return (
        <div className='graphModal'>
            <TestStatWrapper statName={props.statName} from='modal' />
            { props.delete ? 
                <Popconfirm placement="leftTop" title={`Are you sure you want to delete ${props.statName}?`} onConfirm={() => [props.deleteStat(props.statName), props.cancelStatModal()]} okText="Yes" cancelText="No">
                    <div style={{ color: 'red', float: 'right', cursor: 'pointer' }}>Delete</div>
                </Popconfirm>
            : null }
        </div>
    )
}

export default GraphModal;