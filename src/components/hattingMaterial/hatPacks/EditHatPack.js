import React, { useState, useEffect } from 'react';
import { fireStore } from '../../../firebase';
import { Col, Row, Button } from 'antd';
import update from 'immutability-helper';

import Card from './Card';
import ReferenceTable from '../references/ReferenceTable';

function EditHatPack(props) {

    const [selectedRefs, setSelectedRefs] = useState(props.hatPackToBeEdited.references)
    const [data, setData] = useState(null)

    useEffect(() => {
        filterData(props.hatPackToBeEdited.references)
    }, [])

    let filterData = (refs) => {
        let dataTemp = []
        props.hatMaterial.map((ref) => {
            if (!refs.filter(e => e.key === ref.key).length > 0) {
                dataTemp.push(ref);
              }
        })
        setData(dataTemp)
    }

    const moveCard = (dragIndex, hoverIndex) => {
        const dragCard = selectedRefs[dragIndex];
        setSelectedRefs(
            update(selectedRefs, {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
            }),
        )
    }

    const addReference = (ref) => {
        let newRef = {
            name: ref.id,
            url: ref.url,
            key: ref.key
        }
        console.log(newRef);
        setSelectedRefs([...selectedRefs, newRef])
        filterData([...selectedRefs, newRef])
    }
    const removeReference = (ref) => {
        let filteredArr = selectedRefs.filter(e => e.key !== ref.key)
        setSelectedRefs(filteredArr)
        filterData(filteredArr)
    }
    const AddNewHatPack = () => {
        let newHatPack = props.hatPackToBeEdited
        newHatPack.references = selectedRefs
// References can be added to a hatPack or an individual post.  This logic differentiates between the two
        if (props.from === 'post') {
            fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(props.hatPackToBeEdited.id).update({ references: newHatPack.references }).then(() => {
                props.setHatPackToBeEdited(null)
            })
        } else {
            fireStore.collection('users').doc(props.dbKey).collection('hattingMaterial').doc('hatPacks').update({ [newHatPack.id]: newHatPack }).then(() => {
                props.setHatPackToBeEdited(null)
            })
// edit the hatPack where ever it may be in posts 
            fireStore.collection('users').doc(props.dbKey).collection('orgBoard').get().then((posts) => {
                posts.forEach((post) => {

                    if (post.data().hatPacks && post.data().hatPacks.length) {
                        if (post.data().hatPacks.some(e => e['key'] === props.hatPackToBeEdited.key)) {

                            post.data().hatPacks.filter(obj => console.log(obj.name, props.hatPackToBeEdited.id))
                            let hatPacksTemp = post.data().hatPacks.filter(obj => obj.name !== props.hatPackToBeEdited.id)
                            hatPacksTemp.push(newHatPack);
                            console.log(post.data().post + ' new hat packs = ', hatPacksTemp);

                            fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(post.data().id).update({
                                hatPacks: hatPacksTemp
                            })
                        }
                    }
                })
            })
        }
    }

    return (
        <Row className='editHatPack'>

            <Col span={14}>
                <ReferenceTable
                    dbKey={props.dbKey}
                    data={data}
                    allTags={props.allTags}
                    addReference={addReference}
                />
            </Col>

            <Col span={10}>
                {selectedRefs ?
                    <div>
                        <div><b>{props.hatPackToBeEdited.name}</b>

                            <Col span={24}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button onClick={() => AddNewHatPack()}>Submit</Button>
                                </div>
                            </Col>

                        </div>
                        <div className='hatPackFolder' style={{ color: '#262626' }}>
                            {selectedRefs.map((ref, i) => {
                                return <Card 
                                    key={ref.key} 
                                    url={ref.url} 
                                    index={i} 
                                    id={selectedRefs.length} 
                                    text={ref.name} 
                                    reference={ref}
                                    moveCard={moveCard} 
                                    removeReference={removeReference}
                                />
                            })}  </div>
                    </div> : null}
           
            </Col>
          
            <Col span={24}>
                <span style={{ float: 'right' }} onClick={() => props.setHatPackToBeEdited(false)}>close</span>
            </Col>

        </Row>
    )
}

export default EditHatPack;