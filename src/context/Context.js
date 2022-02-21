import React, { useEffect, useState } from 'react';
import { auth, fireStore } from '../firebase';
import { Modal } from 'antd';
import NextMonthModal from './NextMonthModal';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null)
    const [dbKey, setDbKey] = useState(null)

    const [selectedStatGroup, setSelectedStatGroup] = useState(null)
    const [selectedFlowChart, setSelectedFlowChart] = useState(null)

    const [flowChartNodeSelected, setFlowChartNodeSelected] = useState(null)
    const [flowChart, setFlowChart] = useState(null)
    const [node, setNode] = useState(null)
    const [nextTerminals, setNextTerminals] = useState(null)
    const [lastArr, setLastArr] = useState([])

    const [hattingMaterial, setHattingMaterial] = useState(null)

    const [allFlowCharts, setAllFlowCharts] = useState(null)
    const [selectedPostInFlowChart, setSelectedPostInFlowChart] = useState(null)

    const [workingDays, setWorkingDays] = useState([])
    const [activeMonth, setActiveMonth] = useState(null)

    const [notes, setNotes] = useState(null)

    const [dbArr, setDbArr] = useState(null)

    const [nextMonthModal, setNextMonthModal] = useState(false)

    const [managementDashboard, setManagementDashboard] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(setCurrentUser)
    }, []);

    useEffect(() => {
        if (currentUser) {
            
            fireStore.collection("users").where("uid", "array-contains", currentUser.uid).onSnapshot((snap) => {
                if (snap.docs[0].data().managementDashboard) {
                    setManagementDashboard(true)
                    console.log(snap.docs[0].data().managementDashboard);
                }
                setDbKey(snap.docs[0].id)
                fireStore.collection("users").doc(snap.docs[0].id).collection('employees').doc(currentUser.uid).get().then((res) => {
                    setUserInfo(res.data());
                })
                fireStore.collection("users").doc(snap.docs[0].id).collection('statGroup').doc('All Stats').get().then((res) => {
                    setSelectedStatGroup(res.data());
                })
                fireStore.collection("users").doc(snap.docs[0].id).collection('notes').onSnapshot( async (snap) => {
                    let notesTemp = []
                    await snap.forEach((note) => {
                        notesTemp.push(note.data());
                    })
                    setNotes(notesTemp)
                })
                fireStore.collection("users").doc(snap.docs[0].id).collection('orgBoard').onSnapshot( async (res) => {
                    let dbArrTemp = []
                    await res.docs.map((item) => {
                        dbArrTemp.push(item.data());
                    });
                    setDbArr(dbArrTemp);
                })
                fireStore.collection("users").doc(snap.docs[0].id).collection('hattingMaterial').doc('hattingMaterial').onSnapshot((snap) => {
                    setHattingMaterial(snap.data());
                })
                fireStore.collection("users").doc(snap.docs[0].id).collection('flowCharts').onSnapshot(async(snap) => {
                    let flowChartsTemp = []
                    await snap.docs.forEach((item) => {
                        flowChartsTemp.push(item.data())
                    })
                    setAllFlowCharts(flowChartsTemp)
                })
                fireStore.collection('users').doc(snap.docs[0].id).onSnapshot((snap) => {
                    if (snap.data().setNextMonth) {
                        setNextMonthModal(true)
                    }
                })
                // fireStore.collection('users').doc(snap.docs[0].id).collection('quotaGraphs').where('current', '==', true).onSnapshot((snap) => {
                //     let formattedDates = []
                //     setActiveMonth(snap.docs[0].data().id)
                //     if (snap.docs[0].data().workingDays.length) {
                //             snap.docs[0].data().workingDays.map((date) => {
                //             formattedDates.push(new Date(date.toDate()));
                //         })
                //         setWorkingDays(formattedDates)
                //     }
                // })
            })


            
        }
    }, [currentUser])

    useEffect(() => {
        if (flowChart) {
            flowChart.data.elements.map((item) => {
                if (item.data && item.data.startPoint) {
                    flowChartNavigationNext(item)
                } 
            })
        }
    }, [flowChart])

    let logout = () => {
        auth.signOut();
        setUserInfo(null)
        setCurrentUser(null)
        setManagementDashboard(false)
    }

    //nextTerminal, lastArr, goBack, flowChartNavigationNext

    const flowChartNavigationNext = (node) => {

        // if (node.type === 'otherFlowChart') {
        //     setFlowChart(node.data.flowChart);
        // }

        let lastArrTemp = lastArr
        lastArrTemp.push(node)
        setLastArr(lastArrTemp)

        setFlowChartNodeSelected(node.data.postId)

        setNode(node);
        let nextEdge = []
        flowChart.data.elements.map((item) => {
            if (item.source === node.id) {
                if (item.label) {
                    flowChart.data.elements.filter((e) => e.id === item.target)[0].label = item.label
                    nextEdge.push(flowChart.data.elements.filter((e) => e.id === item.target)[0])
                } else {
                    console.log(flowChart.data.elements.filter((e) => e.id === item.target)[0])
                    nextEdge.push(flowChart.data.elements.filter((e) => e.id === item.target)[0])
                }
            }
            setNextTerminals(nextEdge)
        })
    }

    const flowChartNavigationLast = (node) => {

        let lastArrTemp = lastArr
        lastArrTemp.pop()
        setLastArr(lastArrTemp)

        setFlowChartNodeSelected(node.data.postId)

        setNode(node);
        let nextEdge = []
        flowChart.data.elements.map((item) => {
            if (item.source === node.id) {
                nextEdge.push(flowChart.data.elements.filter((e) => e.id === item.target)[0])
            }
            setNextTerminals(nextEdge)
        })
    }

    const goBack = () => {
        flowChartNavigationLast(lastArr[lastArr.length - 2]);
    }

    const clearFlowChart = () => {
        console.log('clicked');
        setFlowChart(null)
        setNode(null)
        setLastArr([]) 
        setNextTerminals(null)
        setFlowChartNodeSelected(null)
    }

    return (
        <AuthContext.Provider
            value={{
                
                currentUser, 
                userInfo,
                logout, 
                dbKey, 

                dbArr,

                setSelectedStatGroup,
                selectedStatGroup, 

                selectedFlowChart,
                setSelectedFlowChart,

                flowChart,
                setFlowChart,
                flowChartNodeSelected,
                setFlowChartNodeSelected,
                node, 
                setNode,
                nextTerminals, 
                setNextTerminals,
                lastArr,
                setLastArr,
                goBack,
                flowChartNavigationNext,
                clearFlowChart,

                hattingMaterial,

                allFlowCharts, 

                flowChart,
                setFlowChart,

                selectedPostInFlowChart,
                setSelectedPostInFlowChart,

                notes,

                workingDays,
                activeMonth,

                managementDashboard

            }}
        class='context' >
            {/* {node ? console.log(node) : null} */}
            {children}

            <Modal
                visible={nextMonthModal}
                onCancel={() => setNextMonthModal(false)}
                footer={null}
            >
               <NextMonthModal setNextMonthModal={setNextMonthModal} dbKey={dbKey} />
            </Modal>

        </AuthContext.Provider>
    );
};