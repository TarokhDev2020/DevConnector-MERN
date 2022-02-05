import React, {Fragment, useEffect} from 'react';
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import {connect} from "react-redux";
import {deleteAccount, getCurrentProfile} from "../../actions/profile";
import { Link } from 'react-router-dom';

const Dashboard = ({getCurrentProfile, deleteAccount, profile: {profile, loading}, auth: {user}}) => {

    useEffect(() => {
        getCurrentProfile();
        //eslint-disable-next-line
    }, [])

    return loading && profile === null ? <Spinner/> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead"><i className="fas fa-user"></i> Welcome {user && user.name}</p>
        {profile !== null ? <Fragment>
            <DashboardActions/>
            <Experience experience={profile.experience}/>
            <Education education={profile.education}/>
            <div className="my-2">
                <button onClick = {() => deleteAccount()} className="btn btn-danger">
                    <i className="fas fa-user minus"></i> Delete My Account
                </button>
            </div>
        </Fragment> : <Fragment>
                <p>You have not yet setup a profile, please add some info</p>
                <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
            </Fragment>}
    </Fragment>
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
