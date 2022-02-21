import React, { useState, useEffect, lazy, Suspense } from 'react';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { Col, Modal, Button } from 'antd';
import { AuthProvider } from './context/Context';
import { fireStore, auth } from './firebase';
import firebase from 'firebase/app';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";
import { PrivateRoute, NoUserRoute } from './routes/Routes';

import './styles/App.less'

const UserHome = lazy(() => import('./components/userHome/UserHome'))
const OrgBoard = lazy(() => import('./components/orgBoard/OrgBoard'))
const HattingMaterial = lazy(() => import('./components/hattingMaterial/HattingMaterialWrapper'))
const OIC = lazy(() => import('./components/oic/OIC'))
const StatGroups = lazy(() => import('./components/oic/statGroup/StatGroupWrapper'))
const FlowChartWrapper = lazy(() => import('./components/flowCharts/FlowChartWrapper'))
const QuotaForm = lazy(() => import('./components/quotaGraphs/QuotaForm'))
const AddEmployee = lazy(() => import('./components/employee/AddEmployee'))
const PostWrapper = lazy(() => import('./components/posts/PostWrapper'))
const EmployeeWrapper = lazy(() => import('./components/employee/EmployeeWrapper'))
const HattingWrapper = lazy(() => import('./components/newHatting/HattingWrapper'))
const ProgressBoard = lazy(() => import('./components/progressBoard/ProgressBoardWrapper'))
const StatSubmissionContainer = lazy(() => import('./components/statSubmission/StatSubmissionContainer'))
const Login = lazy(() => import('./components/login/Login'))
const CreateAccount = lazy(() => import('./components/createAccount/CreateAccount'))
const Header = lazy(() => import('./components/header/Header'))
const ManagementDashboard = lazy(() => import('./components/managementDashboard/ManagementDashboardWrapper'))
const FourZeroFour = lazy(() => import('./components/404/FourZeroFour'))

const TestStat = lazy(() => import('./components/testStat/TestStatWrapper'))

function App() {

    const [loading, setLoading] = useState(true)
    const [newUser, setNewUser] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged((newUser) => {
            setNewUser(newUser);
            setLoading(false)
        })
    }, [])

    let loadingScreen = <h2 style={{ textAlign: 'center', marginTop: '15em' }}>Loading Component</h2>

    return (
        <AuthProvider>
            <Suspense fallback={<div>{loadingScreen}</div>}>
                <Router>
                    <div className='app'>
                        <Header />
                        {loading ? <div>{loadingScreen}</div> :
                            <Switch>

                                <PrivateRoute exact path="/" component={newUser && newUser.displayName === 'kiosk' ? OrgBoard : UserHome} />
                                <PrivateRoute exact path="/org-board" component={OrgBoard} />
                                <PrivateRoute exact path="/OIC" component={OIC} />
                                <PrivateRoute exact path="/stat-groups" component={StatGroups} />
                                <PrivateRoute exact path="/quota-graph-settings" component={QuotaForm} />
                                <PrivateRoute exact path="/hatting-material/:location" component={HattingMaterial} />
                                <PrivateRoute exact path="/flow-charts" component={FlowChartWrapper} />
                                <PrivateRoute exact path="/flow-charts/:flowChartId" component={FlowChartWrapper} />
                                <PrivateRoute exact path="/add-employee" component={AddEmployee} />
                                <PrivateRoute exact path="/post" component={PostWrapper} />
                                <PrivateRoute exact path="/post/:postId" component={PostWrapper} />
                                <PrivateRoute exact path="/employee/:uid" component={EmployeeWrapper} />
                                <PrivateRoute exact path="/stat-submission" component={StatSubmissionContainer} />
                                <PrivateRoute exact path="/hatting" component={HattingWrapper} />
                                <PrivateRoute exact path="/progress-board" component={ProgressBoard} />

                                <PrivateRoute exact path="/test" component={TestStat} />

                                <PrivateRoute exact path="/management-dashboard" component={ManagementDashboard} />

                                <NoUserRoute exact path="/login" component={Login} />
                                <NoUserRoute exact path="/create-account" component={CreateAccount} />

                                <Route render={(props) => <FourZeroFour {...props} />}/>
                                
                            </Switch>}
                        
                        <Col span={24} className='footer' style={{ color: '#dddddd', textAlign: 'center', marginTop: '2em', paddingBottom: '2em' }}>Based on the works of L. Ron Hubbard and powered by The Hubbard&reg; Management System <span onClick={() => setModalOpen(true)}><u>Copyright-Trademark Info</u></span></Col>
                        <Modal
                            title='Copyright-Trademark Information'
                            visible={modalOpen}
                            closable={false}
                            footer={null}
                        //width={800}
                        >
                            <p>&reg; 2021 DDS Dashboard. All Rights Reserved.</p>
                            <p>DDS Dashboard logo is a trademark owned by DDS Dashboard LLC.</p>
                            <p>All material available in this software application is protected by copyright laws and international copyright treaty provisions.  Users are not authorized to download or transmit any of these materials electronically, or to otherwise reproduce any of the material in any form or by any means, electronic or mechanical, including data storage and retrieval systems, recording, printing or photocopying.</p>
                            <p>Grateful acknowledgment is made to L. Ron Hubbard Library for permission to reproduce selections from the copyrighted works of L. Ron Hubbard. </p>
                            <p>HUBBARD is a trademark and is used pursuant to a licensing agreement.</p>
                            <p>IA # ....</p>
                            <br />
                            <Button onClick={() => setModalOpen(false)}>Close</Button>
                        </Modal>
                    </div>
                </Router>
            </Suspense>
        </AuthProvider>
    );
}

export default DragDropContext(HTML5Backend)(App)