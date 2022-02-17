import {sluggifyFailure, sluggifyInProgress, sluggifySuccess} from "../actions/sluggifyActions";
import {wpAjaxRequest} from "../../utils/ajax";

export const sluggify = (string, maxLength) => async (dispatch, getState) => {
    try {
        dispatch(sluggifyInProgress());
        const res = await wpAjaxRequest('sluggifyAction', {
            string: string,
            maxLength: maxLength ? maxLength : 20
        });

        (res.string) ? dispatch(sluggifySuccess(res.string)) : dispatch(sluggifyFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(sluggifyFailure(e));
    }
};