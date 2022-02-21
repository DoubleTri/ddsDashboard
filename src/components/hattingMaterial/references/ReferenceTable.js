import React, { useState, useEffect } from 'react';
import { fireStore } from '../../../firebase';
import firebase from 'firebase/app';
import { Table, Tag, Divider, Popconfirm, Input, Row, message } from 'antd'; 

function ReferenceTable(props) {

    const [data, setData] = useState(null)
    const [uneditedData, setUneditedData] = useState(null)
    const [value, setValue] = useState(null);

    useEffect(() => {
        let dataTemp = []
        if (props.data) {
            props.data.map((item, i) => {
                dataTemp.push({"key": item.key,
                "id": item.id,
                "reference": <div onClick={() => window.open(item.url, "_blank")}>{item.title}</div>,
                "tags": item.tags,
                "fileName": item.fileName,
                "url": item.url
                })
            })
            dataTemp.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))    
            setData(dataTemp)
            setUneditedData(dataTemp)
        }
    }, [props])
    
    const FilterByNameInput = (
        <Input
            placeholder="Search For Reference"
            value={value}
            onChange={ (e) => {
                const currValue = e.target.value;
                if (currValue) {
                    setValue(currValue);
                    const filteredData = data.filter(entry =>
                        entry.id.includes(currValue)
                    );
                    setData(filteredData);
                }
                else{
                    setValue(null);
                    setData(uneditedData);
                }
            }}
        />
    );

    let deleteReference = (refObj) => {
        // delete ref from hattingMaterial/hattingMaterial
        fireStore.collection('users').doc(props.dbKey).collection('hattingMaterial').doc('hattingMaterial').update({
            [refObj.id]: firebase.firestore.FieldValue.delete()
        })
  

        // // delete from any hatPacks
        fireStore.collection('users').doc(props.dbKey).collection('hattingMaterial').doc('hatPacks').get().then((hatPacks) => {
            Object.entries(hatPacks.data()).forEach((hatPack) => {

                hatPack[1].references.forEach((ref) => {
                    if (ref.name === refObj.id) {
                       
                        let path = hatPack[0] + '.references'
                        fireStore.collection('users').doc(props.dbKey).collection('hattingMaterial').doc('hatPacks').update({
                            [path]: firebase.firestore.FieldValue.arrayRemove(ref)
                        })
                    }

                    // delete from references within a post
                    fireStore.collection('users').doc(props.dbKey).collection('orgBoard').get().then((posts) => {
                        posts.forEach((post) => {
                            if (post.data().references && post.data().references.length) {
                                if (post.data().references.some(e => e['key'] === refObj.key)) {
                                    fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(post.data().id).update({
                                        references: firebase.firestore.FieldValue.arrayRemove(ref)
                                    })
                                }
                            }

                            // delete from any hatPacks within a post
                            if (post.data().hatPacks && post.data().hatPacks.length) {
                                if (post.data().hatPacks.some(e => e['key'] === hatPack[1].key)) {

                                    let newHatPack = hatPack[1]
                                    newHatPack.references = hatPack[1].references.filter(e => e['name'] !== refObj.id)

                                    post.data().hatPacks.filter(obj => console.log(obj.name, hatPack[1].id))
                                    let hatPacksTemp = post.data().hatPacks.filter(obj => obj.name !== hatPack[1].id)
                                    hatPacksTemp.push(newHatPack);
                                    console.log(post.data().post + ' new hat packs = ', hatPacksTemp);

                                    fireStore.collection('users').doc(props.dbKey).collection('orgBoard').doc(post.data().id).update({
                                        hatPacks: hatPacksTemp
                                    })   
                                }
                            }
                        })
                    })

                })
            });
        }).then(() => {

        })  
        // delete from storage bucket
    }
    

    const columns = [
        
        {
            title: FilterByNameInput,
            dataIndex: 'reference',
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            render: tags => (
                <>
                    {tags ? tags.map(tag => {
                        return (
                            <Tag key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    }) : null}
                </>
            ),
            filters: props.allTags ? props.allTags.map((tag) => {
                return (
                    { 'text': tag, 'value': tag }
                );
            }) : null,
            onFilter: (value, record) => record.tags && record.tags.includes(value),
            //onFilter: (value, record) => console.log(record.tags),
        },
        !props.addReference ?
        { 
            title: null,
            key: 'action',
            render: (ref) => (
                
                <span>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={`Are you sure you want to delete ${ref.id}?`}
                        placement="bottom"
                        onConfirm={() => deleteReference(ref)}
                        okText="Yes"
                        cancelText="No"
                    >
                            <a>Delete</a>
                        </Popconfirm>
                    </span>
                ),
            } 
            : 
            {
                title: null,
                key: 'action',
                render: (ref) => (
                    <span>
                        <Divider type="vertical" />
                            <a onClick={() => props.addReference(ref)}>Add</a>
                    </span>
                ),
            }
    ];

    return (
        <div className='referenceTable'>
            <Table 
                className="table-striped-rows" 
                pagination={false} 
                columns={columns} 
                dataSource={data} 
                />
        </div>
    )
}

export default ReferenceTable;