import useTranslation from "../hooks/useTranslation";

/**
 *
 * @type {{FILL_META: string, FILL_TABLE: string, CUSTOM: string, PHP: string, EMAIL: string, AJAX: string}}
 */
export const formActions = {
    NONE: "NONE",
    EMAIL: "EMAIL",
    PHP: "PHP",
    AJAX: "AJAX",
    CUSTOM: "CUSTOM",
    FILL_META: "FILL_META",
    FILL_TABLE: "FILL_TABLE",
};

export const formActionsList = [
    { label: useTranslation("Select"), value: null },
    { label: useTranslation("None"), value: formActions.NONE },
    { label: useTranslation("Email"), value: formActions.EMAIL },
    { label: useTranslation("Ajax"), value: formActions.AJAX },
    { label: useTranslation("Custom"), value: formActions.CUSTOM },
    { label: useTranslation("Post management"), value: formActions.FILL_META },
    { label: useTranslation("Table record"), value: formActions.FILL_TABLE },
    { label: useTranslation("PHP"), value: formActions.PHP }
];

export const sizes = [
    'default',
    'sm',
    'xs',
    'lg',
    'xl',
];