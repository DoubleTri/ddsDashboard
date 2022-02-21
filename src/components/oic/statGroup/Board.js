import React from "react";
import styled from 'styled-components';
import { Column } from "./Column";
import { DraggableCard } from "./Card";

const Container = styled.div`
    display: flex;
`;

export function Board(props) {

  return (
    <Container className="Board">
      {props.columns.map((column) => (
        <Column
          key={column.id}
          title={column.title}
        >
          {column.cardIds
            .map((cardId) => props.cards.find((card) => card.id === cardId))
            .map((card, index) => (
              <DraggableCard
                key={card.id}
                id={card.id}
                columnId={column.id}
                columnIndex={index}
                title={card.title}
                moveCard={props.moveCard}
              />
            ))}
          {column.cardIds.length === 0 && (
            <DraggableCard
              isSpacer
              isDragging={props.isDragging}
              moveCard={(cardId) => props.moveCard(cardId, column.id, 0)}
            />
          )}
        </Column>
      ))}
    </Container>
  );
}
