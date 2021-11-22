import {wpAjaxRequest} from "../../utils/ajax";
import {fetchPreviewLinkFailure, fetchPreviewLinkInProgress, fetchPreviewLinkSuccess} from "../actions/fetchPreviewLinkActions";
import {isEmpty} from "../../utils/objects";

export const fetchPreviewLink = (id, type, link) => async (dispatch, getState) => {
    try {
        dispatch(fetchPreviewLinkInProgress());
        const fetched = await wpAjaxRequest('fetchPreviewLinkAction', {id: id, type: type});
        dispatch(fetchPreviewLinkSuccess(fetched));

        if(!isEmpty(fetched) && fetched.success === true){
            const previewLink = (link === 'archive_link') ? fetched.data.archive_link : fetched.data.single_link;
            window.open(previewLink, '_blank');
        }

    } catch ( e ) {
        dispatch(fetchPreviewLinkFailure(e));
    }
};