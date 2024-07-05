import {metaTypes} from "../../App/constants/metaTypes";
import {wpAjaxRequest} from "../utils/ajax";

const { __ } = wp.i18n;

export const fetchMeta = async () => {

    let meta = [];

    if(pagenow === 'site-editor'){ // site editor

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

    } else if(typenow !== '') { // post editor

        // 1. Fetch current CPT meta fields
        let results = await wpAjaxRequest('fetchMetaAction', {
            belongsTo: metaTypes.CUSTOM_POST_TYPE,
            find: typenow,
        });

        meta.push({
            belongsTo: metaTypes.CUSTOM_POST_TYPE,
            find: typenow,
            records: results.records
        });
    }

    return meta;
};



