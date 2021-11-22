import React from "react";
import {
    ADDRESS,
    COLOR,
    CURRENCY,
    DATE,
    EDITOR,
    EMAIL,
    EMBED,
    FILE,
    GALLERY,
    HTML,
    IMAGE,
    LENGTH,
    LIST,
    NUMBER,
    PHONE,
    POST,
    SELECT,
    SELECT_MULTI,
    TEXT,
    TEXTAREA,
    TOGGLE,
    URL,
    VIDEO,
    WEIGHT
} from "../../../App/constants/fields";
import {Icon} from "@iconify/react";

const ShortcodeIcon = ({type}) => {

    const resolveIconClass = (type) => {
        switch (type ) {
            case ADDRESS:
                return 'bx:bx-map';

            case COLOR:
                return 'bx:bx-color-fill';

            case CURRENCY:
                return 'bx:bx-euro';

            case WEIGHT:
                return 'bx:bx-tachometer';

            case LENGTH:
                return 'bx:bx-ruler';

            case DATE:
                return 'bx:bx-calendar';

            case EDITOR:
                return 'bx:bx-font-color';

            case EMAIL:
                return 'bx:bx-envelope';

            case NUMBER:
                return 'bx:bx-list-ol';

            case PHONE:
                return 'bx:bx-phone';

            case TEXT:
                return 'bx:bx-text';

            case TEXTAREA:
                return 'bx:bx-pen';

            case LIST:
                return 'bx:bx-list-ul';

            case HTML:
                return 'bx:bx-code-alt';

            case URL:
                return 'bx:bx-link';

            case SELECT:
                return 'bx:bx-select-multiple';

            case SELECT_MULTI:
                return 'bx:bxs-select-multiple';

            case TOGGLE:
                return 'bx:bx-toggle-right';

            case EMBED:
                return 'bx:bx-extension';

            case FILE:
                return 'bx:bx-cloud-upload';

            case GALLERY:
                return 'bx:bx-images';

            case IMAGE:
                return 'bx:bx-image';

            case VIDEO:
                return 'bx:bx-video';

            case POST:
                return 'bx:bx-repost';
        }
    };

    return (
        <Icon icon={resolveIconClass(type)} width="18px" />
    );
};

export default ShortcodeIcon;