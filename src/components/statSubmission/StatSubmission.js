import React, { useState, useMemo, useContext } from 'react';
import { Button, Col, Collapse, Row, Progress, Modal } from 'antd';

import findHeldFromAboveOLD from '../../functions/findHeldFromAboveOLD';
import DivisionsCollapse from './DivisionsCollapse';
import DepartmentsCollapse from './DepartmentsCollapse';
import HatsCollapse from './HatsCollapse';
import Spinner from '../spinner/Spinner';
import ProgressLine from './ProgressLine';

import { AuthContext } from '../../context/Context';
import StatHeader from './StatHeader';

function StatSubmission(props) {

    const [hats, setHats] = useState(null)
    const [openPannel, setOpenPannel] = useState(null)
    const [hatModalOpen, setHatModalOpen] = useState(false)
    const [selectedHat, setSelectedHat] = useState(null)
    const [exects, setExects] = useState(null)
    const [divisions, setDivisions] = useState(null)
    const [departments, setDepartments] = useState(null)

    const { dbObj, dbKey } = useContext(AuthContext);

    useMemo(async () => {
        let allSelected = []
        let allHats = []
        let allDepartments = []
        let allDivisions = []
        let allExects = []

        if (props.radioValue === 'user') {

            await findHeldFromAboveOLD(props.post, dbKey).then((children) => {
                children.map((obj) => {
                    allSelected.push(obj)
                    if (obj.type === 'hat' && !obj.section) {
                        allHats.push(obj)
                    } else if (obj.type === 'depts') {
                        allDepartments.push(obj)
                    } else if (obj.type === 'divs') {
                        allDivisions.push(obj)
                    } else if (obj.type === 'exect') {
                        allExects.push(obj)
                    }
                    return null;
                })
            })
            allDivisions.sort((a, b) => { return a.position - b.position })
            allExects.sort((a, b) => { return a.position - b.position })
            allHats.sort((a, b) => { return a.position - b.position })
            setHats(allHats)
            setDepartments(allDepartments)
            setDivisions(allDivisions)
            setExects(allExects)

        } else {

            await Object.values(props.dbObj).map((obj) => {
                allSelected.push(obj)
                if (obj.type === 'hat' && !obj.section) {
                    allHats.push(obj)
                } else if (obj.type === 'depts') {
                    allDepartments.push(obj)
                } else if (obj.type === 'divs') {
                    allDivisions.push(obj)
                } else if (obj.type === 'exect') {
                    allExects.push(obj)
                }
                return null;
            })
    
        allDivisions.sort((a, b) => { return a.position - b.position })
        allExects.sort((a, b) => { return a.position - b.position })
        allHats.sort((a, b) => { return a.position - b.position })
        setHats(allHats)
        setDepartments(allDepartments)
        setDivisions(allDivisions)
        setExects(allExects)

        }

    }, [props.post])




    let pannelRender = (item) => {
        if (item.statIdArr.length) {
            return <div className='statPannel'><b style={{ fontSize: '115%' }}>{item.post}</b>
        
            { item.statIdArr.map((stat, i) => {
                return <div onClick={() => props.displayGraph(stat)} style={{ cursor: 'pointer' }}>
                    <div key={i} style={{ marginLeft: '1em' }}>{stat}</div>
                    <div style={{ marginLeft: '-1em' }}><ProgressLine statName={stat} dbKey={dbKey} /></div>
                </div>
            }) }
                <hr />
        </div>
        } 
    }

    let pannelOpen = (i) => {
        setOpenPannel(i)
    }

    let renderByMainPost = () => {

        switch (props.post.type) {

            case 'owner':

            return [

                <div key={props.post.post} style={{ marginLeft: '2em' }}>
                
                    {divisions ? divisions.map((div, i) => {
                        return [pannelRender(div, i + 10),
                        departments ?
                            <DepartmentsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                            : null,
                        hats ?
                            <HatsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                            : null
                        ]
                    }
                    ) : <Spinner text={'Loading Divisions'} />}
                </div>
            ]
            
            case 'ed':

                return [pannelRender(props.post, -1),
                    exects && exects.length > 0 ?
                        <div key={props.post.post} style={{ marginLeft: '2em' }}>
                            
                                {exects.map((exect, i) => {
                                    return [pannelRender(exect, i + 10),
                                    divisions ?
                                        <DivisionsCollapse divisions={divisions} parrent={exect} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                        : null]
                                }
                                )}
                            </div> : null
                ]

            case 'exect':
   
                return [

                    <div key={props.post.post} style={{ marginLeft: '2em' }}>
                        
                            {exects ? exects.map((exect, i) => {
                                return [pannelRender(exect, i + 10),
                                divisions ?
                                    <DivisionsCollapse divisions={divisions} parrent={exect} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                    : null]
                            }
                            ) : <Spinner text={'Loading Executives'} />}
                        </div>
                ]

            case 'divs':

                return [

                    <div key={props.post.post} style={{ marginLeft: '2em' }}>
                            {divisions ? divisions.map((div, i) => {
                                return [pannelRender(div, i + 10),
                                departments ?
                                    <DepartmentsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                    : null,
                                hats ?
                                    <HatsCollapse divisions={divisions} parrent={div} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                    : null
                                ]
                            }
                            ) : <Spinner text={'Loading Divisions'} />}
                       </div>
                ]

            case 'depts':

                return [

                    <div key={props.post.post} style={{ marginLeft: '2em' }}>
                     
                            {departments ? departments.map((dept, i) => {
                                return [pannelRender(dept, i + 10),
                                hats ?
                                    <HatsCollapse divisions={divisions} parrent={dept} departments={departments} hats={hats} post={props.post} pannelRender={pannelRender} pannelOpen={pannelOpen} />
                                    : null]
                            }
                            ) : <Spinner text={'Loading Departments'} />}
                        </div>
                ]

            case 'hat':

                return <div key={props.post.post} style={{ marginLeft: '2em' }}>
                 
                        {hats ? hats.map((hat, i) => {
                            return pannelRender(hat, i + 10)
                        })
                            : <Spinner text={'Loading Departments'} />}
                    </div>

            default:
                return <h3>No Posts Assigned</h3>
        }
    }

    return (
        <div style={{ marginTop: '2em' }} >

            <div>
                {props.post ? <div className={props.from === 'homePage' ? 'statsHomePageScroll' : null}>{renderByMainPost()}</div> : <div>No Posts Assigned</div>}
            </div>

        </div>
    );
}

export default StatSubmission