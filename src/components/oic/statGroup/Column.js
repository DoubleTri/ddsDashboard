import React from "react";
import styled from 'styled-components';

const Container = styled.div`
  background-color: #dfdfdf;
  box-shadow: 4px 4px 12px 4px #888888;
  max-height: 60em;
  overflow: auto;
  margin: 8px;
  border-radius: 2px;
  width: 500px;
  display: flex;
  justify-content: center;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 2s ease;
  flex-grow: 1;
`;

export function Column(props) {
    return <Container >
        <TaskList>
            {props.children}
        </TaskList>
    </Container>;
}
