import useTranslation from "../hooks/useTranslation";

export const ONE_TO_ONE_UNI = 'OneToOneUni';
export const ONE_TO_ONE_BI = 'OneToOneBi';
export const ONE_TO_MANY_UNI = 'OneToManyUni';
export const ONE_TO_MANY_BI = 'OneToManyBi';
export const MANY_TO_ONE_UNI = 'ManyToOneUni';
export const MANY_TO_ONE_BI = 'ManyToOneBi';
export const MANY_TO_MANY_UNI = 'ManyToManyUni';
export const MANY_TO_MANY_BI = 'ManyToManyBi';

export const relationshipList = [
    { value: null, label: useTranslation("Select") },
    { value: ONE_TO_ONE_UNI, label: useTranslation("One to One - Unidirectional") },
    { value: ONE_TO_ONE_BI, label: useTranslation("One to One - Bidirectional") },
    { value: ONE_TO_MANY_UNI, label: useTranslation("One to Many - Unidirectional") },
    { value: ONE_TO_MANY_BI, label: useTranslation("One to Many - Bidirectional") },
    { value: MANY_TO_ONE_UNI, label: useTranslation("Many to One - Unidirectional") },
    { value: MANY_TO_ONE_BI, label: useTranslation("Many to One - Bidirectional") },
    { value: MANY_TO_MANY_UNI, label: useTranslation("Many to Many - Unidirectional") },
    { value: MANY_TO_MANY_BI, label: useTranslation("Many to Many - Bidirectional") },
];

export const unidirectionalRelationshipList = [
    { value: null, label: useTranslation("Select") },
    { value: ONE_TO_ONE_UNI, label: useTranslation("One to One - Unidirectional") },
    { value: ONE_TO_MANY_UNI, label: useTranslation("One to Many - Unidirectional") },
    { value: MANY_TO_ONE_UNI, label: useTranslation("Many to One - Unidirectional") },
    { value: MANY_TO_MANY_UNI, label: useTranslation("Many to Many - Unidirectional") },
];

export const isBidirectional = (relation) => {
    return relation === ONE_TO_ONE_BI || relation === ONE_TO_MANY_BI || relation === MANY_TO_ONE_BI || relation === MANY_TO_MANY_BI;
};

export const opposite = (relation) => {
    switch (relation) {
        case ONE_TO_ONE_BI:
            return ONE_TO_ONE_BI;

        case ONE_TO_MANY_BI:
            return MANY_TO_ONE_BI;

        case MANY_TO_ONE_BI:
            return ONE_TO_MANY_BI;

        case MANY_TO_MANY_BI:
            return MANY_TO_MANY_BI;
    }
};