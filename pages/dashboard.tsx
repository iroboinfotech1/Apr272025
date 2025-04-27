import React from 'react';
import Layout from '../components/Layout';
import RobotLogo from "../assets/icons/robot.svg"
import withAuth from '../HOC/withAuth';

const Dashboard = () => {
    return (
        <div className='text'>
            <Layout>
                <h2 className='header2'>Dashboard</h2>
                <div className='container' style={{width:"650px",height:"450px", margin:"auto", textAlign:"center"}}>
                    <RobotLogo style={{margin:"auto"}}/>
                    No records found
                </div>
            </Layout>
        </div>
    )
}

export default withAuth(Dashboard);