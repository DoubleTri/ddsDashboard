import React, { memo } from 'react';
import LinesEllipsis from 'react-lines-ellipsis'

import { Handle } from 'react-flow-renderer';

export default memo(({ data }) => {
    return (
        <div className='otherFlowChartNode' style={{ padding: '1em' }}>
         
                <Handle
                    label="in"
                    type="target"
                    position="left"
                    id="target"
                    style={{ backgroundColor: 'gray', borderRadius: 0, height: '1em', width: '1em' }}
                />
    
            <div>
                <b>To:</b> {data.flowChart}
            </div>

        </div>
    );
});