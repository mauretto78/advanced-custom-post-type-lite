import {resetPostTypesInProgress, resetPostTypesSuccess} from "../actions/fetchCustomPostTypesActions";
import {wpAjaxRequest} from "../../utils/ajax";

export const resetPostTypes = () => async (dispatch, getState) => {
    dispatch(resetPostTypesInProgress());
    const fetched = await wpAjaxRequest('resetCustomPostTypesAction' );
    dispatch(resetPostTypesSuccess());
};
