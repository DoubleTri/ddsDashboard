import React from 'react';
import { Link } from "react-router-dom";
import { DragSource } from 'react-dnd';

const spec = {
    beginDrag(props) {
        //props.onCloseEmployees();
        props.onClose();
        return props
    },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            console.log('wrong target');
        } else {
            console.log('drag ended, correct target ');
        }
    }
}

const collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        didDrop: monitor.didDrop(),
    }
}

function DragEmployee(props) {

    const {
        isDragging,
        connectDragSource,
    } = props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
        <div className="dragHat" style={{ opacity }}>

            {/* <Link onClick={props.onClose} className='linkText' to={`/employee/${props.item.uid}`}>
                {props.item.name}
            </Link> */}

            {props.item.name}

        </div>)
}

export default DragSource('hatTarget', spec, collect)(DragEmployee);