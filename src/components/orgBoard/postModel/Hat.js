import React from 'react';

function Hat(props) {

    return (
        <div style={{ padding: '0.5em'}}>
            <div><b>Purpose:</b> {props.node.purpose}</div>
            <div><b>Product:</b> {props.node.product}</div>
        </div>
    );
}

export default Hat; 