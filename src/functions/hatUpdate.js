import { fireStore } from '../firebase';

function hatUpdate(post, employeeObj, dbKey) {
    //console.log(post, employeeObj, dbKey);
    var batch = fireStore.batch();

    let deptPosts = []
    let nonHFAPosition = null

    fireStore.collection("users").doc(dbKey).collection('orgBoard')
        .where("childOf", "==", post.childOf).where("position", ">=", post.position).get().then((snapshot) => {
            snapshot.forEach((doc) => {
            // get all posts under post.position
                deptPosts.push(doc.data())
            })
        }).then(() => {
            // check is any of those posts are non-HFA
            deptPosts.map((post) => {
                if (post.employee && !post.employee.hfa) {
                    // If there are multiple non-HFA, get the smallest position (highest in the dept)
                    if (nonHFAPosition && post.position < nonHFAPosition) {
                        nonHFAPosition = post.position
                    } else {
                        nonHFAPosition = post.position
                    }
                }
            })
        }).then(() => {
            // if there is a non-HFA, batch all posts between post.position and non-HFA
            console.log(nonHFAPosition);
            if (nonHFAPosition) {
                var filteredPosts = deptPosts.filter(function (o) {
                    return o.position < nonHFAPosition;
                });
                deptPosts = filteredPosts;
            }
        }).then(() => {
            deptPosts.map((post) => {  
                batch.update(fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(post.id), {
                    'employee': employeeObj ? {
                        name: employeeObj.name,
                        hfa: true,
                        uid: employeeObj.uid
                    } : null
                })
            })
        }).then(() => {
            batch.commit().catch((error) => { console.log('BATCH ERROR!!', error.message) })
        })
}

export default hatUpdate;