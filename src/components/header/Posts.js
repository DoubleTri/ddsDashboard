import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { withRouter } from "react-router-dom";
import { Modal, Input } from 'antd';
import { AuthContext } from '../../context/Context';
import {
    PlusCircleOutlined
  } from '@ant-design/icons';

import RandomId from '../../functions/RandomId';
import DragHat from '../orgBoard/DragHat';
import SectionsForm from './SectionsForm';

const { Search } = Input;

let len = 10;
let pattern = 'aA0'

function Posts(props) {

    const [postArr, setPostArr] = useState(null)
    const [newPostModal, setNewPostModal] = useState(false)

    const [loading, setLoading] = useState(false)

    const [sectionsArr, setSectionsArr] = useState(null)
    const [newSectionModal, setNewSectionModal] = useState(false)


    const { dbKey } = useContext(AuthContext);

    useEffect(() => {

        if (dbKey) {
            fireStore.collection("users").doc(dbKey).collection('orgBoard').onSnapshot( async (res) => {
                let postTempArr = []
                let sectionTempArr = []
                await res.forEach((post) => {
                    if (!post.data().childOf && post.data().type === 'hat' && !post.data().section) {
                        postTempArr.push(post.data());
                    }
                    if (!post.data().childOf && post.data().section) {
                        console.log(post.data());
                        sectionTempArr.push(post.data());
                    }
                })
                setSectionsArr(sectionTempArr)
                setPostArr(postTempArr)
            })
        }
    }, [dbKey])

    let onNewPost = (name) => {
        if (name) {
            setLoading(true)
            let dbId = RandomId(len, pattern);
            fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(dbId).set({
                    post: name,
                    type: 'hat',
                    childOf: null,
                    position: null,
                    hatPacks: [],
                    references: [],
                    id: dbId,
                    purpose: null,
                    product: null,
                    statIdArr: [],
                    hatWriteUp: '',
            }).then(() => {
                setNewPostModal(false)
                props.onClose()
                props.history.push(`/post/${dbId}`)
            }).then(() => {
                setLoading(false)
            })
        }
    }
    
    return (
        <div className="Posts">

        <p> <b>Posts</b> <span className='linkText' onClick={() => setNewPostModal(true)}><PlusCircleOutlined /></span></p>  

            {postArr ?
                postArr.map((item, i) => {
                    return <div key={i}>
                    <DragHat
                        item={item}
                        onClose={props.onClose}
                        admin={true}
                    />
                </div>
                })
                : 'loading...'} 

            <p> <b>Sections</b> <span className='linkText' onClick={() => setNewSectionModal(true)}><PlusCircleOutlined /></span></p>

            {postArr ?
                sectionsArr.map((item, i) => {
                    return <div key={i}>
                        <DragHat
                            item={item}
                            onClose={props.onClose}
                            admin={true}
                            dbKey={dbKey}
                        />
                    </div>
                })
                : 'loading...'} 


            <Modal
                visible={newPostModal}
                onCancel={() => setNewPostModal(false)}
                footer={null}
            >
                <b>Name Your New Post</b>
                <div>
                    <Search
                        placeholder="Post Name"
                        allowClear
                        enterButton="Submit"
                        size="large"
                        loading={loading}
                        onSearch={(e) => onNewPost(e)}
                    />
                </div>
            </Modal>

            <Modal
                visible={newSectionModal}
                onCancel={() => setNewSectionModal(false)}
                footer={null}
            >
                <SectionsForm setNewSectionModal={setNewSectionModal} dbKey={dbKey} />

            </Modal>

        </div>
    );
}

export default withRouter(Posts); 
