import React, { useState, useMemo, useContext } from 'react';
import { fireStore } from '../firebase';

import { AuthContext } from '../context/Context';


var lastClick = 0;
var delay = 1250;

let helloWorld = (hasEmployee) => {

    // if (lastClick >= (Date.now() - delay))
    //     return;
    // lastClick = Date.now();

    // // do things
    console.log(hasEmployee)
}

function HeldFromAbove(props) {

    const [hasEmployee, setHasEmployee] = useState(null)
    const { dbKey, dbArr } = useContext(AuthContext);

    useMemo(() => {
        if (props.node.employee) {
            setHasEmployee(props.node.employee.name)
            
        }
    }, [])

    let addToDb = (nodeId, name, uid) => {
        console.log('db call');
        // fireStore.collection("users").doc(dbKey).collection('orgBoard').doc(nodeId).update({
        //     employee: {
        //         name: name,
        //         hfa: true,
        //         hfaAt: null,
        //         uid: uid
        //     }
        // })
    }

// ---------------------------------------------------------------------------------

    let greatGreatGrandParrent = (greatGreatGrandChild) => {
        return Object.entries(dbArr).map((item) => {
            if (item[1].id && item[1].id === greatGreatGrandChild.childOf) {
                if (item[1].employee) {
                    return item[1].employee.name
                }
            }
            return null;
        })
    }

    let greatGrandParrent = (greatGrandChild) => {
        return Object.entries(dbArr).map((item) => {
            if (item[1].id && item[1].id === greatGrandChild.childOf) {
                if (item[1].employee) {
                    return item[1].employee.name
                } else {
                    return greatGreatGrandParrent(item[1])
                }
            }
            return null;
        })
    }

    let grandParrent = (grandChild) => {
        return Object.entries(dbArr).map((item) => {
            if (item[1].id && item[1].id === grandChild.childOf) {
                if (item[1].employee) {
                    return item[1].employee.name
                } else {
                    return greatGrandParrent(item[1])
                }
            }
            return null;
        })
    }

    let parrent = (child) => {

        if (child.connectedTo) {
            return Object.entries(dbArr).map((item) => {
                if (item[1].id && item[1].id === child.connectedTo && item[1].employee) {
                    return item[1].employee.name
                }
                return null;
            })
        }

        return Object.entries(dbArr).map((item) => {
            if (item[1].id && item[1].id === child.childOf) {
                if (item[1].employee) {
                    return item[1].employee.name
                } else {
                    return grandParrent(item[1])
                }
            }
            return null;
        })
    }

// ------------------------------------------------------------------------------

    let hatsParrentNode;
    let hatArr = []

    let fromAbove = (node) => {

        let postedHatsArr = []
        let position;
        let name;
        let uid;

        hatArr.map((item, i) => {
            if (item.employee) {
                postedHatsArr.push(item)
                position = item.position
                name = item.employee.name
                uid = item.employee.uid
                return null;
            } else {
                return null;
            }
        })

        if (postedHatsArr.length > 1) {

            postedHatsArr.sort((a, b) => { return a.position - b.position })

            for (var i = 0; i < postedHatsArr.length; i++) {
                if (i + 1 !== postedHatsArr.length) {
                    if (node.position > postedHatsArr[i].position && node.position < postedHatsArr[i + 1].position) {
                        return postedHatsArr[i].employee.name
                    } else {
                        parrent(node)
                    }
                } else {
                    if (node.position > postedHatsArr[postedHatsArr.length - 1].position) {
                        return postedHatsArr[postedHatsArr.length - 1].employee.name
                    } else {
                        return parrent(node)
                    }
                }
            }

        } else {

            if (props.node.position > position) {
                return name
            } else {
                return parrent(node)
            }
        }
    }

    let checkHats = (node) => {
        Object.entries(dbArr).map((item) => {
            if (item[1].id && item[1].id === node.childOf) {
                return hatsParrentNode = item[1]
            } else {
                return null;
            }
        })
        Object.entries(dbArr).map((itemTwo) => {
            if (hatsParrentNode && itemTwo[1].childOf && itemTwo[1].childOf === hatsParrentNode.id) {
                return hatArr.push(itemTwo[1])
            } else {
                return null;
            }
        })
        return hatArr.some(e => e.employee || (e.employee && !e.employee.hfa)) ? 
            fromAbove(props.node) 
            :
            parrent(props.node)
    }
    
    let isExect = () => {
        //console.log(props.node)
        return <b>exect</b>
    }

    if (dbKey && dbArr) {
        return props.node.type === 'hat' ?
            props.node.isExect ? isExect() : 
            hasEmployee ?
                props.node.employee.hfa ?  
                    props.node.employee.name
                    :
                    <b><u>{props.node.employee.name}</u></b>
                :
                checkHats(props.node)
            : hasEmployee ?
            props.node.employee.hfa ?  
                hasEmployee
                :
                <b><u>{hasEmployee}</u></b>
                :
                parrent(props.node)
    } else {
        return '...loading'
    }
    

}

export default HeldFromAbove;