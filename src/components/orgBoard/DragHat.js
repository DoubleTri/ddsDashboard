import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { Link } from "react-router-dom";
import { DragSource } from 'react-dnd';

import SectionsForm from '../header/SectionsForm';


const spec = {
    beginDrag(props) {
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

function DragHat(props) {

    const [sectionModal, setSectionModal] = useState(false)
    const [clickedSection, setClickedSection] = useState(false)

    const {
        isDragging,
        connectDragSource,
    } = props;

    const opacity = isDragging ? 0 : 1;

    let sectionClicked = (item) => {
        setClickedSection(item)
        setSectionModal(true)
    }

    return connectDragSource(
        <div className="dragHat" style={{ opacity }}>

            {props.item.section ?
                <div id='hatLink' onClick={() => sectionClicked(props.item)} className='linkText'>
                    {props.item.post}
                </div>
                :
                <Link id='hatLink' onClick={props.onClose} className='linkText' to={`/post/${props.item.id}`}>
                    {props.item.post}
                </Link>
            }

            {clickedSection ?
                <Modal
                    visible={sectionModal}
                    onCancel={() => setSectionModal(false)}
                    footer={null}
                >
                    <SectionsForm setNewSectionModal={setSectionModal} node={clickedSection} dbKey={props.dbKey} />

                </Modal>
                : null}

        </div>)
}

export default DragSource('hat', spec, collect)(DragHat);