import React, { useState, useEffect } from 'react';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app';
import dateFormat from 'dateformat';
import { Modal, Button, Popconfirm, message } from 'antd';

function Notes(props) {

    const [noteModal, setNoteModal] = useState(false)
    const [noteClicked, setNoteClicked] = useState(null)

    useEffect(() => {
        console.log(props);
    }, [])

    let closeOpenModal = (note) => {
        setNoteModal(true)
        setNoteClicked(note)
    }
    let closeNoteModal = () => {
        setNoteModal(false)
        setNoteClicked(null)
    }

    let ackBtn = (note) => {
        closeNoteModal()
        fireStore.collection('users').doc(props.dbKey).collection('notes').doc(note.subject).update({
            'readers': firebase.firestore.FieldValue.arrayUnion(props.userInfo.uid)
        });
    }

    let deleteNote = (note) => {
        closeNoteModal()
        fireStore.collection('users').doc(props.dbKey).collection('notes').doc(note.subject).delete().then(() => {
            message.success('Notification has been deleted')
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <div className='notes'>
            {props.notes ? props.notes.map((note, i) => {
                if (!note.readers.includes(props.userInfo.uid)) {
                    return <div className='note' key={i} style={{ marginBottom: '2em', }}>
                        <div>
                            <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>{note.subject}</h2>
                            <span style={{ float: 'right' }}><Button className='btnSecondary' onClick={() => ackBtn(note)}>Acknowledge</Button></span>
                        </div>
                        <div onClick={() => closeOpenModal(note)}>
                            <b>{dateFormat(note.date.toDate(), "mmmm dS")}: {note.createdName}</b>
                            <div style={{ padding: '1em' }}>{note.note}</div>
                        </div>
                    </div>
                }
            }) : null}

            {noteClicked ?
                <Modal
                    visible={noteModal}
                    onCancel={() => closeNoteModal()}
                    footer={null}
                    width={'60%'}
                >
             
                    <div>
                        <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>{noteClicked.subject}</h2>
                        <span style={{ float: 'right' }}><Button className='btnSecondary' onClick={() => ackBtn(noteClicked)}>Acknowledge</Button></span>
                    </div>
                    <b>{dateFormat(noteClicked.date.toDate(), "mmmm dS")}: {noteClicked.createdName}</b>
                    <div style={{ padding: '1em' }}>{noteClicked.note}</div>
                    { noteClicked.createdUID === props.userInfo.uid ? <div style={{ marginBottom : '2em' }}>
                    <hr />
                    {/* <div className='linkText' style={{ float: 'left' }}>See Acknowledgements</div> */}
                    
                    <div className='linkText' style={{ float: 'right' }}>
                        <Popconfirm
                            title={`Are you sure you want to delete this notification?`}
                            onConfirm={() => deleteNote(noteClicked)}
                            okText="Yes"
                            cancelText="No"
                        >
                            Delete
                        </Popconfirm>
                    </div></div> : null } 
                </Modal>
                : null}

        </div>
    )
}

export default Notes;