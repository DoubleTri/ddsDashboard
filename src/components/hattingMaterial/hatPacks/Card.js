import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';

const style = {
    //back: '1px dashed gray',
    padding: '0.5rem 1rem',
    margin: '.5rem',
    backgroundColor: 'white',
    borderRadius: '10px',
    cursor: 'move',
    textAlign: 'left' 
};

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            hat: props
        }
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        // props = Object that is being hoved over (a hat in this case)
        // monitor.getItem() = Object of source (defined on above at cardSource)
        // component = a big Object used just for finding a DOM node

        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = (findDOMNode(
            component,
        )).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset).y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
}

class Hats extends Component {

    render() {
        
        const {
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props;
        const opacity = isDragging ? 0 : 1;
        return (
            connectDragSource &&
                connectDropTarget &&
                connectDragSource(
                    connectDropTarget(<div style={{ ...style, opacity }}>
                        <span>{this.props.text}</span><span style={{ float: 'right', color: '#1890ff' }} onClick={() => {this.props.removeReference(this.props.reference)}}>Remove</span>
                    </div>),
                ) 
        );
    }
}


export default flow(
    DragSource(
        'card',
        cardSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }),
    ),
    DropTarget('card', cardTarget, (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }))
)(Hats);