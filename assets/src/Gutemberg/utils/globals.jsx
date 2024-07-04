/**
 *
 * @param f
 * @return {*[]}
 */
export const fetchPreviewElement = (f) => {

    if(!document.globals){
        return [];
    }

    if(!document.globals.globals){
        return [];
    }

    const globals = document.globals.globals;
    const { __ } = wp.i18n;

    if(f.belongsTo === "customPostType"){
        if(!globals['POST_ID']){
            return [];
        }

        let elements = [{value: null, label: __("--Select---", 'acpt')}];

        globals['POST_ID'].map((el) => {
            if(el.label === f.find){
                elements = [...elements, ...el.options];
            }
        });

        return elements;
    } else if(f.belongsTo === "taxonomy"){
        if(!globals['TERM_ID']){
            return [];
        }

        let elements = [{value: null, label: __("--Select---", 'acpt')}];

        globals['TERM_ID'].map((el) => {
            if(el.label === f.find){
                elements = [...elements, ...el.options];
            }
        });

        return elements;
    }

    return [];
};