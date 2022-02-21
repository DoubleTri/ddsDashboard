import React, { useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';

import { AuthContext } from '../../context/Context';

function NodeView(props) {

    const { hattingMaterial, userInfo } = useContext(AuthContext);

    useEffect(() => {
        // console.log(props);
        // console.log(hattingMaterial);
    }, [props])

    let onPolicyClick = (policy) => {
        if (!userInfo.kiosk) {
            window.open(hattingMaterial[policy].url, "_blank")
        }
    }

    return (<div className='nodeView' style={{ paddingBottom: '2em' }}>
        <div style={{ textAlign: 'center' }}>
            <h3>{props.nodeSelected.data.post}</h3>
        </div>
        <hr />
        <b>How {props.nodeSelected.data.post} Changes the Particle</b>
        <p>{props.nodeSelected.data.change}</p>

        { props.nodeSelected.data.policy && props.nodeSelected.data.policy.length ? <div>
            <hr />
            <b>Policy</b>
            <div>{props.nodeSelected.data.policy.map((policy, i) => {
                return <div className='linkText' style={{ marginLeft: '1em' }} onClick={() => onPolicyClick(policy)}>{policy}</div>
            })}</div>
        </div>
            : null}
        
    </div>
    )
}

export default NodeView;