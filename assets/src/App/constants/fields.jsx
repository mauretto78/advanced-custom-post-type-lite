import useTranslation from "../hooks/useTranslation";
import {resolveField} from "../utils/resolvers";

export const fieldGroupsDisplay = {
    STANDARD: "standard",
    ACCORDION: 'accordion',
    VERTICAL_TABS: 'verticalTabs',
    HORIZONTAL_TABS: 'horizontalTabs'
};

/**
 *
 * @return {[{label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}]}
 */
export const displayOptions = [
    {
        label: useTranslation("Standard view"),
        value: fieldGroupsDisplay.STANDARD
    },
    {
        label: useTranslation("Accordion"),
        value: fieldGroupsDisplay.ACCORDION
    },
    {
        label: useTranslation("Horizontal tabs"),
        value: fieldGroupsDisplay.HORIZONTAL_TABS
    },
    {
        label: useTranslation("Vertical tabs"),
        value: fieldGroupsDisplay.VERTICAL_TABS
    }
];

/**
 *
 * @return {[{label: string, value: string}, {label: string, value: string}, {label: string, value: string}]}
 */
export const contextOptions = [
        {label: 'advanced', value: 'advanced'},
        {label: 'normal', value: 'normal'},
        {label: 'side', value: 'side'},
    ];

/**
 *
 * @return {[{label: string, value: string}, {label: string, value: string}, {label: string, value: string}, {label: string, value: string}]}
 */
export const priorityOptions = [
        {label: 'default', value: 'default'},
        {label: 'core', value: 'core'},
        {label: 'high', value: 'high'},
        {label: 'low', value: 'low'},
    ];

export const fieldSettings = {
    MAX_NESTING: 4,
};

export const checkboxRenderOptions = [
    {value:"block", label: "Block"},
    {value:"inline", label: "Inline"},
];

export const IDOptions = [
    {value:"uuid_v1", label: "UUID(v1)"},
    {value:"uuid_v4", label: "UUID(v4)"},
    {value:"uuid_v7", label: "UUID(v7)"},
    {value:"ulid", label: "ULID"},
    {value:"auto_inc", label: "Auto-increment"},
    {value:"random", label: "Random int"},
];

export const renderMediaOptions = [
    {value:"html", label: "HTML"},
    {value:"url", label: "URL"},
    {value:"id", label: "ID"},
];

export const renderUrlOptions = [
    {value:"html", label: "HTML"},
    {value:"url", label: "URL"},
    {value:"label", label: "Label"},
];

export const dateOptions = [
    {label: useTranslation("Select"), value: ""},
    {value:"F j, Y", label: "F j, Y (ex. July 29, 2025)"},
    {value:"j F, Y", label: "j F, Y (ex. 29 July, 2025)"},
    {value:"Y-m-d", label: "yyyy-mm-dd (ex. 1990-10-28)"},
    {value:"y-m-d", label: "yy-mm-dd (ex. 90-10-28)"},
    {value:"d-M-y", label: "dd-mmm-yy (ex. 28-OCT-90)"},
    {value:"d-M-Y", label: "dd-mmm-yyyy (ex. 28-OCT-1990)"},
    {value:"d M y", label: "mmm yy (ex. 28 OCT 90)"},
    {value:"d M Y", label: "mmm yyyy (ex. 28 OCT 1990)"},
    {value:"d/m/y", label: "dd/mm/yy (ex. 28/10/90)"},
    {value:"d/m/Y", label: "dd/mm/yyyy (ex. 28/10/1990)"},
    {value:"m/d/y", label: "mm/dd/yy (ex. 10/28/90)"},
    {value:"m/d/Y", label: "mm/dd/yyyy (ex. 10/28/1990)"},
    {value:"d.m.y", label: "dd.mm.yy (ex. 28.10.90)"},
    {value:"d.m.Y", label: "dd.mm.yyyy (ex. 28.10.1990)"}
];

export const timeOptions = [
    {label: useTranslation("Select"), value: ""},
    {value:"H:i:s", label: "H:i:s (ex. 21:18:19)"},
    {value:"H:i", label: "H:i (ex. 21:18)"},
    {value:"g:i a", label: "g:i a (ex. 9:18 pm)"},
    {value:"g:i A", label: "g:i A (ex. 9:18 PM)"},
];

export const yesOrNoOptions = (checked = false) => {
    return [
        {label: useTranslation("Yes"), value: "1", checked: checked === true},
        {label: useTranslation("No"), value: "0", checked: checked === false},
    ];
}

export const toolbarOptions = [
    {value:"full", label: "Full"},
    {value:"basic", label: "Basic"},
];

export const tabsOptions = [
    {value:"full", label: "Visual and Text"},
    {value:"visual", label: "Visual Only"},
    {value:"text", label: "Text Only"},
];

export const relationalFieldOptions = [
    {value:"advanced", label: "Advanced"},
    {value:"select2", label: "Select2"},
];

export const fieldTypes = {
    DATE: 'Date',
    EMAIL: 'Email',
    SELECT: 'Select',
    TEXT: 'Text',
    TEXTAREA: 'Textarea'
};

export const fieldListElement = (fieldType) => {
    const {label} = resolveField(fieldType);

    return {label: useTranslation(label), value: fieldType};
};

/**
 *
 * @return {{label: *, value: *}[]}
 */
export const blockControlsList = () => {
    return [
        {
            label: useTranslation("BASIC"),
            options: [
                fieldListElement(fieldTypes.TEXT),
                fieldListElement(fieldTypes.TEXTAREA),
            ]
        },
        {
            label: useTranslation("ENUM"),
            options: [fieldListElement(fieldTypes.SELECT)]
        },
        {
            label: useTranslation("NUMERIC"),
            options: []
        },
        {
            label: useTranslation("SPECIALIZED FIELDS"),
            options: [fieldListElement(fieldTypes.EMAIL)]
        },
    ];
};

/**
 *
 * @return {[{options: [{label, value: string}, {label, value: string}], label: *}, {options: [], label: *}, {options: [], label: *}, {options: [], label: *}, {options: [], label: *}]}
 */
export const fieldsList = (nestingLevel) => {
    let baseOptions = [
        {
            label: useTranslation("BASIC"),
            options: [fieldListElement(fieldTypes.TEXT), fieldListElement(fieldTypes.TEXTAREA)]
        },
        {
            label: useTranslation("ENUM"),
            options: [fieldListElement(fieldTypes.SELECT)]
        },
        {
            label: useTranslation("NUMERIC"),
            options: []
        },
        {
            label: useTranslation("DATE & TIME"),
            options: [fieldListElement(fieldTypes.DATE)]
        },
        {
            label: useTranslation("SPECIALIZED FIELDS"),
            options: [fieldListElement(fieldTypes.EMAIL)]
        },
        {
            label: useTranslation("UNIT OF MEASURE"),
            options: []
        },
        {
            label: useTranslation("MEDIA"),
            options: []
        },
    ];

    if(nestingLevel < 3){
        let groupedFields = [];

        if(nestingLevel === 0){}

        baseOptions.push({
            label: useTranslation("GROUPED"),
            options: groupedFields
        });
    }

    baseOptions.push({
        label: useTranslation("RELATIONS"),
        options: []
    });

    return baseOptions.filter(group => group.options.length > 0);
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldHasOptions = (fieldType) => {
    return fieldType === fieldTypes.SELECT;
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldIsRepeater = (fieldType) => {
    return false;
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldIsFlexible = (fieldType) => {
    return false;
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldIsRelational = (fieldType) => {
    return false;
};