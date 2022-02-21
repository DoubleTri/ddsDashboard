import React, { useState } from 'react';
import { fireStore } from '../../firebase';
import { Button, Input } from 'antd';

function Vfp(props) {

    const [edit, setEdit] = useState(false)
    const [newVfp, setNewVfp] = useState(null)
    const [loading, setLoading] = useState(false)

    let editVfp = () => {
        return !edit ?
            setEdit(true)
            :
            null
    }

    let onChange = (e) => {
        setNewVfp(e.target.value)
    }

    let onEnter = () => {
        setLoading(true)
        if (newVfp === null) {
            setLoading(false)
            setEdit(false)
            return null;
        }
        else if (newVfp === '') {
            setLoading(false)

            return alert('VFP cannot be blank')
        } else {
            fireStore.collection("users").doc(props.dbKey).update({ 'vfp': newVfp }).then(() =>{
                setLoading(false)
                setEdit(false)
            })
        }
    }

    let renderVfp = edit ?
        <div style={{ width: '75%', margin: 'auto', textAlign: 'center' }}>
            <Input defaultValue={props.vfp} onChange={onChange} /> <Button onClick={onEnter} loading={loading}>Enter</Button>
        </div>
        :
        <div style={{ width: '75%', margin: 'auto', textAlign: 'center' }}>{props.vfp}</div>

    return (
        <div className="Vfp">

            <div className='vfp' style={{ marginTop: '2em', textAlign: 'center' }} onClick={() => props.isPi ? null : editVfp()} ><div><h3 style={{ color: '#dddddd', marginTop: '-15px'  }}>Organizing Board Valuable Final Product</h3></div><div><h2 style={{ color: '#dddddd', marginTop: '-10px' }}>{renderVfp}</h2></div></div>

        </div>
    );
}

export default Vfp; 