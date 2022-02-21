import React, { useEffect } from 'react';
import { Row, Col } from 'antd';

import ReferenceTable from './ReferenceTable';
import Upload from './Upload';

function References(props) {

    let pStyle = { backgroundColor: '#b8b8b8', boxShadow: '0px 0px 15px 0px #888888', borderRadius: '5px', padding: '1em', margin: '2em' }

    return (
        <Row className='references' justify="center" align="middle" style={{ marginTop: '3em' }} >

            <Col span={24} style={ pStyle }>
                <ReferenceTable 
                    dbKey={props.dbKey}
                    data={props.hatMaterial}
                    allTags={props.allTags}
                />
            </Col>

            <Col span={24} style={ pStyle }>
                <Upload
                    dbKey={props.dbKey}
                    data={props.hatMaterial}
                    allTags={props.allTags}
                />
            </Col>

        </Row>
    )
}

export default References;