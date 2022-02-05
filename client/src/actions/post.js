import axios from "axios";
import {setAlert} from "./alert";
import {GET_POSTS, UPDATE_LIKES, POST_ERROR, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT} from "./types";

export const getPosts = () => async dispatch => {
    try {
        const response = await axios.get("/api/post");
        dispatch({
            type: GET_POSTS,
            payload: response.data
        })
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addLike = id => async dispatch => {
    try {
        const response = await axios.put(`/api/post/like/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: response.data}
        })
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const removeLike = id => async dispatch => {
    try {
        const response = await axios.put(`/api/post/unlike/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: response.data}
        })
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/post/${id}`);
        dispatch({
            type: DELETE_POST,
            payload: id
        })
        dispatch(setAlert("Post Removed", "success"));
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const response = await axios.post("/api/post", formData, config);
        dispatch({
            type: ADD_POST,
            payload: response.data
        })
        dispatch(setAlert("Post Created", "success"));
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}


export const getPost = id => async dispatch => {
    try {
        const response = await axios.get(`/api/post/${id}`);
        dispatch({
            type: GET_POST,
            payload: response.data
        })
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const response = await axios.post(`/api/post/comment/${postId}`, formData, config);
        dispatch({
            type: ADD_COMMENT,
            payload: response.data
        })
        dispatch(setAlert("Comment Added", "success"));
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        const response = await axios.delete(`/api/post/comment/${postId}/${commentId}`);
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert("Comment Removed", "success"));
    }
    catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}
