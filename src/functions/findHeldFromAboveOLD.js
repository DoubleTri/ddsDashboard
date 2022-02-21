import { fireStore } from '../firebase';

let findHeldFromAbove = async (post, dbKey) => {

    let dbObj = []

    await fireStore.collection("users").doc(dbKey).collection('orgBoard').get().then((snapshot) => {
        dbObj = []
        snapshot.forEach( (doc) => dbObj.push(doc.data()) )
    });

    let childrenArr = []
    let grandChildrenArr = []
    let greatGrandChildrenArr = []
    let greatGreatGrandChildrenArr = []

    let hasEmployee = [];

    let stopAtPosition;

    return new Promise(async (resolve, reject) => {
        let error = false
        
        if (post.type === 'hat') {
            let parrent;
            await Object.entries(dbObj).map((item, i) => {
                if (item[1].id && item[1].id === post.childOf) {
                    parrent = item[1].id
                }
                return null;
            })
            await Object.entries(dbObj).map((item, i) => {
                if (item[1].childOf === parrent && item[1].position > post.position) {

                    if (item[1].employee && !item[1].employee.hfa) {
                        stopAtPosition = item[1].position
                    } 
                }
                return null
            })
            if (stopAtPosition) {
                Object.entries(dbObj).map((item, i) => {
                    if (item[1].childOf === parrent && item[1].position > post.position && item[1].position < stopAtPosition ) {
                        childrenArr.push(item[1])
                    }
                    return null
                })
            } else {
                Object.entries(dbObj).map((item, i) => {
                    if (item[1].childOf === parrent && item[1].position > post.position) {
                        childrenArr.push(item[1])
                    }
                    return null
                })
            }
        }

        Object.entries(dbObj).map((child, i) => {
            if (child[1].childOf === post.id && (child[1].employee && !child[1].employee.hfa)) {
                hasEmployee.push(child[1])
            }
            if (child[1].childOf === post.id && (!child[1].employee || (child[1].employee && child[1].employee.hfa) )) {
                childrenArr.push(child[1])
            }
            return null;
        })

        childrenArr.map((child) => {
            Object.entries(dbObj).map((item, i) => {
                if (item[1].childOf === child.id && (item[1].employee && !item[1].employee.hfa)) {
                    hasEmployee.push(item[1])
                }
                if (item[1].childOf === child.id && (!item[1].employee || (item[1].employee && item[1].employee.hfa) )) {
                    grandChildrenArr.push(item[1])
                }
                return null;
            })
            return null;
        })

        grandChildrenArr.map((grandChild) => {
            Object.entries(dbObj).map((item, i) => {
                if (item[1].childOf === grandChild.id && (item[1].employee && !item[1].employee.hfa)) {
                    hasEmployee.push(item[1])
                }
                if (item[1].childOf === grandChild.id && (!item[1].employee || (item[1].employee && item[1].employee.hfa))) {
                    greatGrandChildrenArr.push(item[1])
                }
                return null;
            })
            return null;
        })

        greatGrandChildrenArr.map((greatGrandChild) => {
            Object.entries(dbObj).map((item, i) => {
                if (item[1].childOf === greatGrandChild.id && (item[1].employee && !item[1].employee.hfa)) {
                    hasEmployee.push(item[1])
                }
                if (item[1].childOf === greatGrandChild.id && (!item[1].employee || (item[1].employee && item[1].employee.hfa))) {
                    greatGreatGrandChildrenArr.push(item[1])
                }
                return null;
            })
            return null;
        })

        if (!error) {
            
            let fullArr = childrenArr.concat(post, grandChildrenArr, greatGrandChildrenArr, greatGreatGrandChildrenArr)
            let newArr = []
            let eliminatedPost = []

            if (hasEmployee && hasEmployee.length > 0) {
                Object.entries(dbObj).map((item, i) => {
                    hasEmployee.map((heldPost) => {
                        if (heldPost.type === 'hat') {
                        if (item[1].childOf === heldPost.childOf && item[1].position > heldPost.position) {
                            eliminatedPost.push(item[1].id)
                            newArr = fullArr.filter(i => i.id !== item[1].id);
                        }
                    } else {
                        newArr = fullArr.filter(i => i.id !== item[1].id);
                    }
                        return null;
                    })
                    return null;
                })
                let filtered = fullArr.filter(function(item) {
                    return eliminatedPost.indexOf(item.id) === -1;
                });
                resolve(filtered, post)
            } else {
                resolve(fullArr, post)
            }


        } else {
            reject('something went wrong')
        }
    })

}

export default findHeldFromAbove;