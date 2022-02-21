import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../../firebase';
import _ from 'lodash';
import { AuthContext } from '../../../context/Context';
import StatGroup from './StatGroup';

function StatGroupWrapper() {

    const [stats, setStats] = useState(null)
    const [columns, setColums] = useState(null)

    const { dbKey } = useContext(AuthContext);

    useEffect(async () => {

        if (dbKey) {
            let statsObjArr = []
// GET ALL STATS AND ARRANGE THEM FOR DRAG AND DROP
            await fireStore.collection('users').doc(dbKey).collection('stats').get().then((snapshot) => {
                snapshot.docs.map((doc, i) => statsObjArr.push({
                    id: doc.data().data.id,
                    title: doc.data().data.name
                }))
            }).then(() => {
                setStats(statsObjArr);
                setColums([
                    {
                        id: 0,
                        title: 'one',
                        cardIds: statsObjArr.map(card => card.id),
                    },
                    {
                        id: 1,
                        title: 'two',
                        cardIds: [],
                    }
                ])
            })
        }

    }, [dbKey])


    return (
        <div className="statGroupWrapper">
           
                {stats && columns ?
                    <StatGroup stats={stats} columns={columns} dbKey={dbKey} />
                    : 'loading....'}

        </div>
    );
}

export default StatGroupWrapper; 