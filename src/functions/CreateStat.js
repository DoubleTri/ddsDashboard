import { fireStore } from '../firebase';

let last
let two
let three

export default function CreateStat(statId, stat, upsideDown, description, dbKey, weekEnding, postName, postId) {

    console.log(statId, stat, upsideDown, description, dbKey, weekEnding, postName, postId);

    let date = new Date(weekEnding)
    last = new Date(date.setDate(date.getDate() - 7))
    last = Date.parse(last)
    two = new Date(date.setDate(date.getDate() - 7))
    two = Date.parse(two)
    three = new Date(date.setDate(date.getDate() - 7))
    three = Date.parse(three)

    console.log({                id: statId,
        name: stat,
        description: description ? description : null,
        upsideDown: upsideDown ? upsideDown : false,
        postData: { postName: postName, postId: postId}});

    return fireStore.collection("users").doc(dbKey)
        .collection('stats').doc(stat)
        .set({
            stats: [
                { name: three, stat: 0, notes: [] },
                { name: two, stat: 0, notes: [] },
                { name: last, stat: 0, notes: [] },
                { name: weekEnding, stat: 0, notes: [] }
            ],
            data: {
                id: statId,
                name: stat,
                description: description ? description : null,
                upsideDown: upsideDown ? upsideDown : false,
                postData: { postName: postName, postId: postId}
                // add post data here...
            }
        })
    }