import useTranslation from "../hooks/useTranslation";

/**
 *
 * @type {{FILL_META: string, CUSTOM: string, PHP: string, EMAIL: string, AJAX: string}}
 */
export const formActions = {
    EMAIL: "EMAIL",
    PHP: "PHP",
    AJAX: "AJAX",
    CUSTOM: "CUSTOM",
    FILL_META: "FILL_META",
};

export const formActionsList = [
    { label: useTranslation("Select"), value: null },
    { label: useTranslation("Ajax"), value: formActions.AJAX },
    { label: useTranslation("Custom"), value: formActions.CUSTOM },
    { label: useTranslation("Post management"), value: formActions.FILL_META },
    { label: useTranslation("PHP"), value: formActions.PHP }
];