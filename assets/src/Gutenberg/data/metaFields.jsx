import {wpAjaxRequest} from "../utils/ajax";

const { __ } = wp.i18n;

export const fetchMeta = async () => {

    let meta = [];

    let results = await wpAjaxRequest('fetchAllMetaAction', {
        gutenberg: true
    });

    for (const [belongsTo, records] of Object.entries(results)) {

        for (const [find, data] of Object.entries(records)) {
            if (data.records && data.records.length > 0){
                meta.push({
                    belongsTo: belongsTo,
                    find: find,
                    findLabel: data.label || find,
                    records: data.records
                });
            }
        }
    }

    return meta;
};



