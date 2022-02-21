const functions = require('firebase-functions');
const admin  = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.cronTestTwo = functions.pubsub.schedule('* * * * *').onRun(async context => {

    console.log('---------------------- RUNNING W/E FUNCTION (new test Eightteen) ----------------------');
    // Consistent timestamp
    let now = admin.firestore.Timestamp.now()
    now = now.toMillis()
    console.log('Now === ' + now);
    
    // Query all documents ready to perform
    let query = db.collection('users').where('weekEndNext', '<', now);
    console.log(query);
    let docId;
    let newWeekEnding;

    await query.get().then(snapshot => {
        if (snapshot.docs[0]) {
            docId = snapshot.docs[0].id
            let dataPoints = Object.entries(snapshot.docs[0].data());
            //return console.log('dataPoints');
            return dataPoints.map((item) => {
                if (item[0] === 'weekEndNext') {
                    var next = new Date(item[1])
                    next.setMinutes(next.getMinutes() + 10080);
                    newWeekEnding = Date.parse(next);
                    return db.collection('users').doc(docId).update({
                        weekEndNext: newWeekEnding
                    });
                }
                return true;
            })
        } else {
            return console.log('no weekEnding event');
        }
    }).catch(e => {
        e ? console.log('w/e error ', e) : null
    })

    await query.get().then(async snapshot => {
        var collectionIds = []
        if (snapshot.docs[0]) {
            await db.collection('users').doc(docId).collection('stats').get().then((snap) => {
                snap.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    return collectionIds.push(doc.id);
                });
                return null;
            }).then(() => {

                let newArr = []
                collectionIds.map((item) => {
        
                    db.collection('users').doc(docId).collection('stats').doc(item).get().then((doc) => {
                        return newArr = doc.data().stats.concat({ stat: 0, name: newWeekEnding, notes: [] })
    
                    })
                    .then(() => {
                        return db.collection('users').doc(docId).collection('stats').doc(item).update({
                            stats: newArr
                        })
                    })
                    .catch(e => {
                        e ? console.log('db update errot', e) : null
                    })
                    return null
                })
                return null
            })
            return null
        } else {
            return console.log('nothing to update');
        }
    }).catch(e => {
        e ? console.log('db update errot', e) : null
    })

});

exports.heldFromAbove = functions.https.onCall((data, context) => {

    data.batchArr.map((item) => {
        let employeeId = item + '.employee'
        return db.collection('users').doc(data.dbKey).update({ [employeeId]: { name: data.sourceName, uid: data.sourceUid, id: data.sourceId, fromAbove: true } });
    })

    return (data.batchArr.length);
});


exports.delete = functions.https.onCall((data, context) => {

    data.employeeArr.map((item) => {
        let itemId = item + '.employee'
        return db.collection('users').doc(data.dbKey).update({ [itemId]: '' })

    })

    return (data.employeeArr.length);
});

exports.deleteUser = functions.https.onCall((data, context) => {
    admin.auth().deleteUser(data.uid)
    .then(() => {
        return console.log('Successfully deleted user: ', uid);
    })
    .catch((error) => {
        return console.log('Error deleting user:', error);
    })
})
    