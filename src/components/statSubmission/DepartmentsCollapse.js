import React from 'react';
import { Collapse } from 'antd';

import HatsCollapse from './HatsCollapse';

function DepartmentsCollapse(props) {

    return <div style={{ marginLeft: '2em' }}>
        

            {props.departments.map((department, l) => {

                if (department.childOf === props.parrent.id) {

                    return [props.pannelRender(department),

                    props.hats ?
                        <HatsCollapse hats={props.hats} division={props.division} parrent={department} pannelRender={props.pannelRender} pannelOpen={props.pannelOpen} />
                        : null]

                } else return null;

            })}
    </div>
}

export default DepartmentsCollapse;