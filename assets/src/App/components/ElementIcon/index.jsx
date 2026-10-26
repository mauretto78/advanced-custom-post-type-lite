import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import {grayColor} from '../../utils/colors';
import {isValidSvg} from '../../utils/strings';

const ElementIcon = ({value}) => {

    // render SVG (HTML tags are case-insensitive, so match regardless of case).
    // The cheap substring check is just a fast-path guard before the real,
    // structural validation — garbage like "<svg this is not valid markup"
    // must not be treated as SVG just because it contains the substring.
    if(
        value &&
        value.toLowerCase().includes("<svg") &&
        isValidSvg(value)
    ){
        return (
            <img
                alt="SVG icon"
                src={`data:image/svg+xml;utf8,${encodeURIComponent(value)}`}
            />
        );
    }

    // render image if values starts by http / https
    if(
        value &&
        (value.includes("http://") || value && value.includes("https://") || value && value.includes("data:image"))
    ){
        return (
            <img src={value} width={18}  alt="" />
        );
    }

    // add dashicons: for retro-compatibility — only for a bare legacy slug
    // (e.g. "admin-home") with no icon-set prefix at all. A colon means it's
    // already a fully-qualified iconify id (e.g. "dashicons:admin-home",
    // "bx:home") and must be left untouched.
    if(value && !value.includes("dashicons") && !value.includes(":")){
        return (
            <Icon icon={`dashicons:${value}`} color={grayColor()} width="18px" />
        );
    }

    return (
        <Icon icon={value} color={grayColor()} width="18px" />
    );
};

ElementIcon.propTypes = {
    // Every branch above already guards on `value &&` and falls through to a
    // blank <Icon icon={null}/> otherwise -- child option pages legitimately
    // have no icon of their own (see CanvasPageActions.jsx's handleAddChildPage),
    // so `null`/undefined is real, supported input, not a caller error.
    value: PropTypes.string
};

export default ElementIcon;