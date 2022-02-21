import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from '../../context/Context';
import { Layout, Drawer, Button } from 'antd'
import {
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import LongLogo from '../../images/IMG_0251.PNG';
import Employees from './Employees';
import Posts from './Posts';



function Header() {

    const location = useLocation();

    const [visible, setVisible] = useState(false)
    const [pathName, setPathName] = useState(null)

    const { logout, dbKey, userInfo } = useContext(AuthContext);

    useEffect(() => {
        setPathName(window.location.pathname);
    }, [window.location.pathname, dbKey])


    const openMenu = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const logoutClicked = () => {
        logout();
        setVisible(false)
    }

    const centerIcon = () => <div style={{ marginTop: '1em', marginBottom: '1em' }}>
        <img alt="logo" width="300" height="75" src={LongLogo} />
        <p style={{ marginTop: '-2em' }}><h1 style={{ color: '#DDDDDD' }}>{dbKey}</h1></p>
    </div>

    const { Header } = Layout;

    return (

            <Layout style={{ backgroundColor: '#484848' }}>

            { userInfo && userInfo.kiosk ? <Header style={{ backgroundColor: '#484848', textAlign: 'center', color: '#DDDDDD' }} >
                {/* <b style={{ fontSize: '2.4em',  }}>Digital Org Board</b>  */}
                <img style={{ marginTop: '1em', marginBottom: '1em' }} alt="logo" width="300" height="75" src={LongLogo} />
                
                <hr style={{ marginTop: '-1em', marginBottom: '-1em', width: '50%', color: '#c9c9c9' }} />
                <div style={{ display: 'inline-flex',  marginBottom: '1em' }}>
                    <Link style={{ margin: '-5em 4em 0em 4em' }} onClick={onClose} className='linkText' to='/org-board'><h2 className='linkText' style={{ color: '#c9c9c9' }}>Org Board</h2></Link>
                    <Link style={{ margin: '-5em 4em 0em 4em' }} onClick={onClose} className='linkText' to='/oic'><h2 className='linkText' style={{ color: '#c9c9c9' }}>OIC</h2></Link>
                    <Link style={{ margin: '-5em 4em 0em 4em' }} onClick={onClose} className='linkText' to='/flow-charts'><h2 className='linkText' style={{ color: '#c9c9c9' }}>Flow Charts</h2></Link>
                </div></Header> :  

            pathName === '/' ? 
            
            <div style={{ textAlign: 'center', color: '#DDDDDD', fontFamily: 'Montserrat, sans-serif' }} >
                {/* <b style={{ fontSize: '2.4em',  }}>Digital Org Board</b>  */}
                <img style={{ marginTop: '1em', marginBottom: '1em' }} alt="logo" width="300" height="75" src={LongLogo} />
                
                <hr style={{ marginTop: '-1em', width: '80%', color: '#c9c9c9' }} />
                <div style={{ display: 'inline-flex' }}>
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/org-board'><h2 style={{ color: '#c9c9c9' }}>Org Board</h2></Link>
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/flow-charts'><h2 style={{ color: '#c9c9c9' }}>Flow Charts</h2></Link>
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/stat-submission'><h2 style={{ color: '#c9c9c9' }}>Stats</h2></Link>
                    
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/oic'><h2 style={{ color: '#c9c9c9' }}>OIC</h2></Link>
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/hatting-material/references'><h2 style={{ color: '#c9c9c9' }}>Hatting Material</h2></Link>
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/hatting'><h2 style={{ color: '#c9c9c9' }}>My Hatting</h2></Link>
                    <Link style={{ margin: '0em 4em 0em 4em' }} onClick={onClose} className='linkTextHeader' to='/progress-board'><h2 style={{ color: '#c9c9c9' }}>Progress Board</h2></Link>
                    
                </div></div>
                // <Header style={{ backgroundColor: 'rgb(237, 183, 67)',  boxShadow: '0px 0px 15px 0px #888888', textAlign: 'center', color: '#DDDDDD', display: 'flex', justifyContent: 'space-around', fontFamily: 'Montserrat, sans-serif' }} >
                //     <Link onClick={onClose} className='linkText' to='/org-board'><h2 className='linkText'><b>Org Board</b></h2></Link>
                //     <Link onClick={onClose} className='linkText' to='/flow-charts'><h2 className='linkText'><b>Flow Charts</b></h2></Link>
                //     <Link onClick={onClose} className='linkText' to='/stat-submission'><h2 className='linkText'><b>Stats</b></h2></Link>
                //     <Link onClick={onClose} className='linkText' to='/oic'><h2 className='linkText'><b>OIC</b></h2></Link>
                //     <Link onClick={onClose} className='linkText' to='/hatting-material/references'><h2 className='linkText'><b>Hatting Material</b></h2></Link>
                //     <Link onClick={onClose} className='linkText' to='/hatting'><h2 className='linkText'><b>My Hatting</b></h2></Link>
                //     <Link onClick={onClose} className='linkText' to='/progress-board'><h2 className='linkText'><b>Progress Board</b></h2></Link>
                // </Header>
            
            :
                <Header style={{ backgroundColor: '#484848', textAlign: 'center', color: '#DDDDDD'  }} className="header" id={ pathName === '/org-board' ? 'orgBoardHeader' : null }>
                    {userInfo ?
                        <span style={{ float: 'left', fontSize: '115%' }} onClick={openMenu}><b>Menu</b> <MenuUnfoldOutlined /></span>
                        : null}

                        {userInfo ?
                            <span style={{ float: 'Right' }} ><b>{userInfo.name}</b></span>
                            : null}

                        {userInfo ?
                            centerIcon()
                            : <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                            <img alt="logo" width="300" height="75" src={LongLogo} />
                            <p style={{ marginTop: '-2em' }}><h1 style={{ color: '#DDDDDD' }}>Management Dashboard</h1></p>
                        </div> }

                </Header>
            }

                <Drawer
                    title='Menu'
                    placement='left'
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                >
                    <p onClick={logoutClicked}>Log Out</p>
                    <hr />
                    <p><Link onClick={onClose} className='linkText' to='/'>Home</Link></p>
                    <p><Link onClick={onClose} className='linkText' to='/org-board'>Org Board</Link></p>
                    <p><Link onClick={onClose} className='linkText' to='/flow-charts'>Flow Charts</Link></p>
                    <p><Link onClick={onClose} className='linkText' to='/stat-submission'>Stats</Link></p> 
                    <p><Link onClick={onClose} className='linkText' to='/quota-graph-settings'>Quota Graphs</Link></p>  
                    <p><Link onClick={onClose} className='linkText' to='/oic'>OIC</Link></p>
                    <p><Link onClick={onClose} className='linkText' to='/hatting-material/references'>Hatting Material</Link></p>
                    <p><Link onClick={onClose} className='linkText' to='/hatting'>My Hatting</Link></p>
                    <p><Link onClick={onClose} className='linkText' to='/progress-board'>Progress Board</Link></p>


 {/*  ======== Org Board Options ========  */}

                {pathName === '/org-board' && userInfo && userInfo.admin ? <div>
                    <Employees onClose={onClose} />
                    <hr />
                    <Posts onClose={onClose} />
                </div>
                    : null}
                    
                </Drawer>

            </Layout>

    );
}

export default Header;
