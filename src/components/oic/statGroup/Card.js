import React from 'react';
import styled from 'styled-components';
import {DragSource, DropTarget} from 'react-dnd';
import cn from 'classnames';
import _ from 'lodash';

const spec = {
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            console.log('wrong target');
        } else {
            console.log('drag ended, correct target ');
            console.log(props, monitor, component);
        }
    },
    beginDrag(props) {
        return { id: props.id };
    },

    isDragging(props, monitor) {
        return props.id === monitor.getItem().id;
    },
}

    const Container = styled.div`
        border-radius: 2px;
    `;

export function Card(props) {

  
  return _.flowRight(props.connectDragSource, props.connectDropTarget)(
    <div
      className={cn('Card', {
        'Card--dragging': props.isDragging,
        'Card--spacer': props.isSpacer,
      })}
    >
      <Container>{props.title}</Container>
    </div>
  );
}

export const DraggableCard = _.flowRight([
  DropTarget(
    'Card',
    {
      hover(props, monitor) {
        const {columnId, columnIndex} = props;
        const draggingItem = monitor.getItem();
        if (draggingItem.id !== props.id) {
          props.moveCard(draggingItem.id, columnId, columnIndex);
        }
      },
    },
    connect => ({
      connectDropTarget: connect.dropTarget(),
    })
  ),
  DragSource(
    'Card',
    spec,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  ),
])(Card);
