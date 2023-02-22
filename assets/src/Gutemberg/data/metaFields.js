import {metaTypes} from "../../App/constants/metaTypes";

const fetchMeta = async () => {
    let formData = new FormData();
    formData.append('action', 'fetchMetaAction');
    formData.append('data', JSON.stringify({belongsTo: metaTypes.CUSTOM_POST_TYPE, find: typenow}));

    let response = await fetch(ajaxurl, {
        method: 'POST',
        body: formData
    });

    return await response.json();
};

let metaFields = [{ value: null, label: "--Select---", box: "", field: "", type: "" }];

fetchMeta().then( boxes => {
    boxes.map((box) => {
        if(box.fields){
            box.fields.map((field) => {
                metaFields.push({
                    value: field.db_name,
                    label: field.ui_name,
                    box: box.title,
                    field: field.name,
                    type: field.type
                });
            });
        }
    });
});

export default metaFields;


