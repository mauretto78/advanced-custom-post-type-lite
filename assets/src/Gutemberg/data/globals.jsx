import {wpAjaxRequest} from "../utils/ajax";

export const fetchGlobals = async () => {
    let results = await wpAjaxRequest('fetchAllFindBelongsAction', {});

    document.globals.globals = results;
};