import React, { useState, useContext, memo } from 'react';
import { AuthContext } from '../../context/Context';
import LinesEllipsis from 'react-lines-ellipsis'

import { Handle } from 'react-flow-renderer';

export default memo(({ data }) => {

    const { selectedPostInFlowChart } = useContext(AuthContext);

    const [showMore, setShowMore] = useState(false)
    
    return (
        <div className='customNode' style={selectedPostInFlowChart === data.postId ? { border: '10px solid #DBBF67', padding: '1em'  } : { padding: '1em' } }>
            {!data.startPoint ?
                <Handle
                    label="in"
                    type="target"
                    position="left"
                    id="target"
                    style={{ backgroundColor: 'gray', borderRadius: 0, height: '1em', width: '1em' }}
                />
                : null}
            <div>
                <b>{data.post}</b>
            </div>
            <hr style={{ width: '75%' }} />

            {showMore ? <div>
                {data.change}
                </div>
                :
                <div>
                    <LinesEllipsis
                        text={data.change}
                        maxLine='3'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                    />
                </div>
            }
            

            <Handle
                type="source"
                position="right"
                style={{ backgroundColor: 'lightgray', borderRadius: 0, height: '1em', width: '1em' }}
                id="source"
            />
            {/* <div onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer', textAlign: 'right' }}>{ showMore ? 'Show Less' : 'Show More' }</div> */}
        </div>
        
    );
});