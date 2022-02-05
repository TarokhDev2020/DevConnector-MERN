import React, {Fragment, useEffect} from 'react';
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import Spinner from "../layout/Spinner";
import {connect} from "react-redux";
import {getPosts} from "../../actions/post";

const Posts = ({getPosts, post: {posts, loading}}) => {

    useEffect(() => {
        getPosts();
        // eslint-disable-next-line
    }, [getPosts])

    return loading ? <Spinner/> : (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead">
                <i className="fas fa-user"></i> Welcome to the community
            </p>
            <PostForm/>
            <div className="posts">
                {posts.map(post => (
                    <PostItem key={post._id} post={post}/>
                ))}
            </div>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPosts})(Posts)
