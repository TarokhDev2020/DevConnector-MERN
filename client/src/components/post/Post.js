import React, {Fragment, useEffect} from 'react';
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import {connect} from "react-redux";
import {getPost} from "../../actions/post";
import { Link } from 'react-router-dom';

const Post = ({getPost, post: {post, loading}, match}) => {

    useEffect(() => {
        getPost(match.params.id)
        // eslint-disable-next-line
    }, [getPost])

    return loading || post === null ? <Spinner/> : <Fragment>
        <Link to="/posts" className="btn">Back To Posts</Link>
        <PostItem post={post} showActions={false}/>
        <CommentForm postId={post._id}/>
        <div className="comments">
            {post.comments.map(comment => (
                <CommentItem key={comment._id} comment={comment} postId={post._id}/>
            ))}
        </div>
    </Fragment>
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPost})(Post)