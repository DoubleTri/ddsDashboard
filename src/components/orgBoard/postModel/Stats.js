import React from 'react';
import Graph from '../../graphs/Graph';
import TestStatWrapper from '../../testStat/TestStatWrapper'

function Stats(props) {

    return (
        <div className="stats">
            {props.node.statIdArr.map((stat, i) => {
                return <div key={i} style={{ marginLeft: '-1.5em', marginBlock: '2em' }}>
                    <Graph key={i} statName={stat} from='orgBoardModal' />
                    {/* <TestStatWrapper key={i} statName={stat} from='orgBoardModal' /> */}
                    </div>
            })}
        </div>
    );
}

export default Stats; 