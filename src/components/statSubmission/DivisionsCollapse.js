import React from 'react';
import { Collapse } from 'antd';

import HatsCollapse from './HatsCollapse';
import DepartmentsCollapse from './DepartmentsCollapse';

function DivisionsCollapse(props) {

    return <div style={{ marginLeft: '2em' }}>
 

            {props.divisions.map((division, j) => {

                if (division.childOf === props.parrent.id) {

                    return [props.pannelRender(division),

                    props.departments ?
                        <DepartmentsCollapse departments={props.departments} parrent={division} hats={props.hats} pannelRender={props.pannelRender} pannelOpen={props.pannelOpen} />
                        : null,

                    props.hats ?
                        <HatsCollapse hats={props.hats} parrent={division} pannelRender={props.pannelRender} pannelOpen={props.pannelOpen} />
                        : null]

                } else if (!props) {
                    return props.panelRender(division)
                } else return null;
            })}


    </div>
}

export default DivisionsCollapse;