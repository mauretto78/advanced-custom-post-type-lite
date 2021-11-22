import {wpAjaxRequest} from "../../utils/ajax";
import {fetchPostsFailure, fetchPostsInProgress, fetchPostsSuccess} from "../actions/fetchPostsActions";

export const fetchPosts = (postType, perPage, sortBy, sortOrder) => async (dispatch, getState) => {
    try {
        dispatch(fetchPostsInProgress());
        const fetched = await wpAjaxRequest('fetchPostsAction', {postType:postType, perPage:perPage, sortBy:sortBy, sortOrder:sortOrder});
        dispatch(fetchPostsSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchPostsFailure(e));
    }
};