import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Checkbox, Tooltip, Progress } from 'antd';
import dateFormat from 'dateformat';
import {
    FolderOpenOutlined,
    FileOutlined
  } from '@ant-design/icons';

function HattingSequence(props) {

    const [percentage, setPercentage] = useState(0)
    const [visable, setVisible] = useState(false)
    
    const [references, setReferences] = useState(null)

    useEffect( async () => {

        let userReferences = []
     
        await props.references.map((item) => {
            if (item.user === props.userInfo.uid) {
                userReferences.push(item.item.item)
            }
        })
        //console.log(userReferences);
        setReferences(userReferences);

        let refOnlyTemp = []
        let uniqueRefs = []

        await userReferences.map((ref) => {
            if (ref.references) {
                ref.references.map((refTwo) => {
                    refOnlyTemp.push(refTwo.name);
                })
            } else {
                refOnlyTemp.push(ref.name);
            }
        })

        refOnlyTemp.map(x => uniqueRefs.filter(a => a == x).length > 0 ? null : uniqueRefs.push(x))
        setPercentage(Math.floor((props.referencesRead.length / uniqueRefs.length) * 100 ));
       
    }, [props])




    return (<div>   
     
        <div className='hattingSequence' style={ props.from === 'homePage' ? { boxShadow: '0px 0px 15px 0px #888888' } : null } ><Progress percent={percentage} /></div> 

        { (props.from === 'progressBoard' && visable) || props.from !== 'progressBoard'? 
        <div className='hattingSequence'  style={ props.from === 'homePage' ? { boxShadow: '0px 0px 15px 0px #888888' } : null }>
            <br />
            { references ? references.map((item, i) => {
                return item.references ? <div className='hatPackSequence' ><div style={{ fontSize: '115%', paddingBottom: '15px' }}>
                    <FolderOpenOutlined /> <b>{item.name}</b>
                </div> {item.references.map((ref, ii) => {
                    return <li style={{ marginLeft: '2em' }} key={ii}><span style={{ cursor: 'pointer' }} onClick={() => window.open(ref.url, "_blank")} >{ref.name}</span>
                        <span style={{ float: 'right' }}>
                            <Tooltip title="By checking this box you are attesting that you have read, understand, and can apply this reference">
                                <Checkbox onChange={(e) => props.onCheckChange(e, ref)} checked={props.referencesRead.some(e => e.name === ref.name)}></Checkbox>
                            </Tooltip>
                        </span>
                        {/* { props.referencesRead.some(e => e.name === ref.name) ? <span style={{ float: 'right', marginRight: '2em' }}>{ console.log(props.referencesRead) }</span> : null } */}
                    </li>
                })}</div>
                :
                <li style={{ marginLeft: '1em' }} key={i}><FileOutlined /> <span style={{ cursor: 'pointer', fontSize: '115%', paddingBottom: '15px' }} onClick={() => window.open(item.url, "_blank")}><b>{item.name}</b></span>
                
                    <span style={{ float: 'right' }}>
                        <Tooltip title="By checking this box you are attesting that you have read, understand, and can apply this reference">
                            <Checkbox onChange={(e) => props.onCheckChange(e, item)} checked={props.referencesRead.some(e => e.name === item.name)}></Checkbox>
                        </Tooltip>
                    </span>
                    {/* { props.referencesRead.some(e => e.name === item.name) ? <span style={{ float: 'right', marginRight: '2em'  }}></span> : null } */}
                </li>
            }) : null }
            { props.from === 'progressBoard' ? <div onClick={() => setVisible(false)}>Hide</div> : null }
        </div>
        : <div onClick={() => setVisible(true)}>Show</div> } 
        </div>
    )
}

export default HattingSequence;