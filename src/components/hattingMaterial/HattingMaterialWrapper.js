import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { fireStore } from '../../firebase';
import { Row, Col } from 'antd';

import { AuthContext } from '../../context/Context';
import References from './references/References';
import HatPacks from './hatPacks/HatPacks';

function HattingMaterialWrapper(props) {

    const [hatMaterial, setHatMaterial] = useState([])
    const [allTags, setAllTags] = useState([])
    const [hatPacks, setHatPacks] = useState([])

    const [selectedSection, setSelectedSection] = useState(props.match.params.location)

    const { dbKey } = useContext(AuthContext);

    useEffect(() => {
        if (dbKey) {
            fireStore.collection('users').doc(dbKey).collection('hattingMaterial').doc('tags').onSnapshot((snap) => {
                setAllTags(snap.data().tags.sort()) 
            })
            fireStore.collection('users').doc(dbKey).collection('hattingMaterial').doc('hattingMaterial').onSnapshot((snap) => {
                setHatMaterial(Object.values(snap.data())) 
            })
            fireStore.collection('users').doc(dbKey).collection('hattingMaterial').doc('hatPacks').onSnapshot((snap) => {
                setHatPacks(Object.values(snap.data())) 
            })
        }
    }, [dbKey])

    return (
        <Row className='hattingMaterialWrapper' justify="center" align="middle" style={{ textAlign: 'center', marginTop: '3em' }} >

            <Col className='linkText' span={5} onClick={() => setSelectedSection('references')} style={selectedSection === 'references' ? { fontWeight: 'bold', textDecoration: 'underline' } : null} >
                <Link className='linkText' to='/hatting-material/references' style={{ color: '#dddddd', fontSize: '125%' }}>References</Link>
            </Col>
            <Col className='linkText' span={5} onClick={() => setSelectedSection('hat-packs')} style={selectedSection === 'hat-packs' ? { fontWeight: 'bold', textDecoration: 'underline' } : null} >
                <Link className='linkText' to='/hatting-material/hat-packs' style={{ color: '#dddddd', fontSize: '125%' }}>Hat Packs</Link>
            </Col>

            { selectedSection === 'references' ? 
                <Col span={20}><References hatMaterial={hatMaterial} allTags={allTags} dbKey={dbKey} /> </Col>
                :
                <Col span={20}><HatPacks hatMaterial={hatMaterial} hatPacks={hatPacks} allTags={allTags} dbKey={dbKey} /> </Col> }

        </Row>
    )
}

export default HattingMaterialWrapper;