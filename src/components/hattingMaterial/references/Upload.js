import React, { useState, useContext } from 'react';
import { fireStore } from '../../../firebase';
import { Row, Col, Select, message, Input, Button, Divider } from 'antd';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';

import fileUpLoad from '../../../functions/FileUpLoad';
import { AuthContext } from '../../../context/Context';

const { Option } = Select;

function Upload(props) {

    const [hatMaterial, setHatMaterial] = useState(props.data)

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState(null)

    const [allTags, setAllTags] = useState(props.allTags)
    const [newTag, setNewTag] = useState(null)
    const [selectedTags, setSelectedTags] = useState(null)

    const { dbKey } = useContext(AuthContext);

    let onChange = (e) => {
        setFile(e.target.files[0])
        var input = e.target.files[0].name;
        var output = input.substr(0, input.lastIndexOf('.')) || input;
        setFileName(output)
    }
    let onFileNameChange = (e) => {
        setFileName(e.target.value)
    }
    let addItem = () => {
        if (newTag) {
            let allTagsTemp = props.allTags
            console.log(props.allTags, allTagsTemp, newTag);
            allTagsTemp.push(newTag)
            
            setAllTags(allTagsTemp)
            fireStore.collection('users').doc(dbKey).collection('hattingMaterial').doc('tags').update({ tags: allTagsTemp })
            setNewTag(null)
        } else {
            message.error('tag cannot be blank')
        }
    }

    const upload = async (e) => {

        if (fileName.match(/^[0-9a-zA-Z' ']+$/)) {

            setLoading(true)
            let error = false
            await hatMaterial.map((item) => {
                if (item.title === fileName) {
                    error = true
                    setLoading(false)
                    return message.error(fileName + " already exists.")
                }
            })
            if (!error) {
                //console.log(dbKey, file, fileName, selectedTags);
                fileUpLoad(dbKey, file, fileName, selectedTags).then((responce) => {
                    if (responce) {
                        return setLoading(false),
                            setFile(null), document.getElementById("file-input").value = "",
                            setLoading(false),
                            message.success(fileName + ' was successfully uploaded'),
                            setSelectedTags(null)
                        // radioValue === 'yes' ? setTimeout(() => {
                        //     props.history.push(`/checksheet/${fileName}`)
                        // }, 2000)
                        //  : null;
                    } else {
                        return (null)
                    }
                })
            }

        } else {

            message.error('File names can only contain numbers, letters, and spaces')

        }
    }

    return (
        <Row className='Upload'>
            
            <Col span={20} offset={2} className="hattingMaterialSection">
                    <div className="hattingMaterialInnerSection">
                        <p><b>Upload any hatting material that will be required for any hat.</b></p>
                        <br />

                        {file ? <Row justify='space-between' align="top">
                            <CloseCircleOutlined onClick={() => setFile(null) } />
                            <Col span={14}>
                                <Input defaultValue={fileName} onChange={(e) => onFileNameChange(e)} placeholder="File Name" />
                            </Col>
                            <Col span={4}>
                                <Select
                                    style={{ width: 200 }}
                                    mode="multiple"
                                    placeholder="Add a Tag"
                                    onChange={(e) => setSelectedTags(e)}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                   
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                <Input style={{ flex: 'auto' }} value={newTag} onChange={ (e) => setNewTag(e.target.value) } />
                                                <a
                                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                    onClick={() => addItem()}
                                                >
                                                    <PlusOutlined /> Add item
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {props.allTags ? props.allTags.map(item => (
                                        <Option key={item}>{item}</Option>
                                    )) : null}
                                </Select>
                            </Col>

                            <Col span={4} ><Button loading={loading} onClick={upload}>Submit</Button></Col>
                        </Row> :  <Col span={4}><input id="file-input" type="file" accept=".pdf, .doc, .docx" onChange={onChange} /></Col> }
                    </div>
                </Col>

            
        </Row>
    )
}

export default Upload;