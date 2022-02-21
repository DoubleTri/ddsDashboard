import React from 'react';
import { Collapse } from 'antd';

function HatsCollapse(props) {

    return <div style={{ marginLeft: '2em' }}>

            {props.hats.map((hat, m) => {

                if (hat.childOf === props.parrent.id) {
                    return props.pannelRender(hat)
                } else return null;

            })}
    </div>
}

export default HatsCollapse;