import React from "react";
import {
    EMAIL,
    SELECT,
    TEXT,
} from "../../../App/constants/fields";
import {Icon} from "@iconify/react";

const ShortcodeIcon = ({type}) => {

    const resolveIconClass = (type) => {
        switch (type ) {
            case EMAIL:
                return 'bx:bx-envelope';

            case TEXT:
                return 'bx:bx-text';

            case SELECT:
                return 'bx:bx-select-multiple';
        }
    };

    return (
        <Icon icon={resolveIconClass(type)} width="18px" />
    );
};

export default ShortcodeIcon;