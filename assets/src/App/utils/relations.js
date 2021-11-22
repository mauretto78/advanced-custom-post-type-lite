import {MANY_TO_MANY_BI, MANY_TO_ONE_BI, ONE_TO_MANY_BI, ONE_TO_ONE_BI} from "../constants/relationships";

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