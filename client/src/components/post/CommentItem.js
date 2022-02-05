import React, {Fragment} from 'react';
import Moment from "react-moment";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {deleteComment} from "../../actions/post";

const CommentItem = ({comment: {
    _id,
    name,
    text,
    avatar,
    user,
    date
}, postId, deleteComment, auth}) => {
    return (
        <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img className="round-img" src={avatar}
              alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">
            {text}
          </p>
          <p className="post-date">
            Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
          </p>
          {!auth.loading && user === auth.user._id && (
              <button onClick={e => deleteComment(postId, _id)} className="btn btn-danger" type="button">
                  <i className="fas fa-times"></i>
              </button>
          )}
        </div>
      </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, deleteComment)(CommentItem);
