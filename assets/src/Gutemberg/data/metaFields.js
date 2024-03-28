import {metaTypes} from "../../App/constants/metaTypes";
import {wpAjaxRequest} from "../utils/ajax";

const { __ } = wp.i18n;

const fetchMeta = async () => {

    let meta = [];

    // 1. Fetch current CPT meta fields
    let results = await wpAjaxRequest('fetchMetaAction', {belongsTo: metaTypes.CUSTOM_POST_TYPE, find: typenow});

    meta.push({
        belongsTo: metaTypes.CUSTOM_POST_TYPE,
        find: typenow,
        records: results.records
    });

    return meta;
};

let metaFields = [{
    value: null,
    label: __("--Select---", 'acpt'),
    group: 'all'
}];

fetchMeta().then(groups => {

    groups.map((group) => {

        const records = group.records;
        const belongsTo = group.belongsTo;
        const find = group.find ? group.find : null;

        /**
         *
         * @param groupName
         * @param box
         * @param field
         * @return {{field: *, find: null, box: *, label: string, type: *, value: string, belongsTo: *, group: *}}
         */
        const formatField = (groupName, box, field) => {
            return {
                group: groupName,
                value: find +'_'+field.db_name,
                label: '['+find+'] - ' + field.ui_name,
                box: box.name,
                field: field.name,
                type: field.type,
                belongsTo: belongsTo,
                find: find
            };
        };

        if(records.length > 0){
            records.map((record) => {
                if(record.boxes.length > 0){
                    record.boxes.map((box) => {
                        if(box.fields){
                            box.fields
                                .map((field) => {
                                    metaFields.push({
                                        label: '['+find+'] - ' + field.ui_name,
                                        group: field.group,
                                        value: JSON.stringify(formatField(record.name, box, field))
                                    });
                                });
                        }
                    });
                }
            });
        }
    });
});

export default metaFields;


