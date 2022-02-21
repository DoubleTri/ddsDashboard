import React from 'react';
import { Collapse } from 'antd';

function HatsCollapse(props) {

    return <div style={{ marginLeft: '2em' }}>
        <Collapse bordered={false} accordion={true} onChange={(i) => props.pannelOpen(i)}>
            {props.hats.map((hat, m) => {

                if (hat.childOf === props.parrent.id) {
                    return props.pannelRender(hat)
                } else return null;

            })}
        </Collapse>
    </div>
}

export default HatsCollapse;