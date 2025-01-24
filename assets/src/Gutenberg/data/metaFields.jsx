import {wpAjaxRequest} from "../utils/ajax";

const { __ } = wp.i18n;

export const fetchMeta = async () => {

    let meta = [];

    let results = await wpAjaxRequest('fetchAllMetaAction', {
        gutenberg: true
    });

    for (const [belongsTo, records] of Object.entries(results)) {

        for (const [find, value] of Object.entries(records)) {
            if (value.length > 0){
                meta.push({
                    belongsTo: belongsTo,
                    find: find,
                    records: value
                });
            }
        }
    }

    return meta;
};



