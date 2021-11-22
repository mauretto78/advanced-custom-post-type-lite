import {wpAjaxRequest} from "../../utils/ajax";
import {saveCustomPostTemplateFailure, saveCustomPostTemplateInProgress, saveCustomPostTemplateSuccess} from "../actions/saveCustomPostTypeTemplateActions";
import {extractHtmlFromCraftJson} from "../../utils/craft";

export const savePostTypeTemplate = (postType, templateType, json, meta) => async ( dispatch, getState) => {
    try {
        dispatch(saveCustomPostTemplateInProgress());
        const res = await wpAjaxRequest('saveCustomPostTypeTemplateAction', {
            postType:postType,
            templateType:templateType,
            json:json,
            html: extractHtmlFromCraftJson(json),
            meta:meta
        } );
        (res.success === true) ? dispatch(saveCustomPostTemplateSuccess(res.data)) : dispatch(saveCustomPostTemplateFailure(res.error)) ;
    } catch ( e ) {
        dispatch(saveCustomPostTemplateFailure(e));
    }
};