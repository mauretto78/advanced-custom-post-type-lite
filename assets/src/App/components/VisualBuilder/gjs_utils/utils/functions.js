import {wpAjaxRequest} from "../../../../utils/ajax";

export const fetchFindFromBelongsTo = async (belongsTo) => {
    return await wpAjaxRequest("fetchFindFromBelongsToAction", {belongsTo: belongsTo});
};

export const fetchMetaFieldsFromBelongsTo = async (belongsTo, find) => {
    return await wpAjaxRequest("fetchMetaFieldsFromBelongsToAction", {belongsTo: belongsTo, find:find});
};