import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";
import {metaTypes} from "../../constants/metaTypes";
import useTranslation from "../../hooks/useTranslation";
import Badge from "../Badge";
import {wpAjaxRequest} from "../../utils/ajax";

// Types that trigger the ajax find-value lookup below.
const allowedBelongsTo = [
    "PARENT_POST_ID",
    "POST_ID",
    "POST_TAX",
    "POST_CAT",
    "POST_TEMPLATE",
    "TERM_ID",
    "USER_ID"
];

// Every type this component actually renders a styled badge for -- includes
// allowedBelongsTo (ajax-backed) plus the types handled only by the style/
// branch checks below (e.g. BelongsModal passes these for its "find" column).
// POST_FORMAT is deliberately NOT in allowedBelongsTo: FetchFindQuery's $id is
// typed `int`, so a non-numeric find value (a template filename or, here, a
// format slug) always casts to 0 -- same pre-existing gap POST_TEMPLATE has.
// Showing the raw slug (e.g. "video") via the initial `find` prop is a better
// fallback than a broken ajax round trip that resolves to an empty string.
const supportedBelongsTo = [
    ...allowedBelongsTo,
    'POST_FORMAT',
    metaTypes.CUSTOM_POST_TYPE,
    metaTypes.TAXONOMY,
    metaTypes.USER,
    metaTypes.COMMENT,
    metaTypes.MEDIA
];

const BelongBadge = ({belongsTo, find}) => {
    const [findValue, setFindValue] = useState(find);

    let style = styleVariants.SECONDARY;

    if(belongsTo === metaTypes.TAXONOMY || belongsTo === 'TERM_ID'){
        style = styleVariants.WARNING;
    }

    if(belongsTo === metaTypes.COMMENT){
        style = styleVariants.BORDERED;
    }

    if(belongsTo === "USER_ID"){
        style = styleVariants.DANGER;
    }

    useEffect(() => {
        if(allowedBelongsTo.includes(belongsTo) && find !== "0"){
            wpAjaxRequest("fetchFindAction", {belongsTo :belongsTo, id:find})
                .then(res => {
                    setFindValue(res);
                })
                .catch(err => {
                    console.error(err.message);
                })
            ;
        }
    }, [belongsTo, find]);

    if(belongsTo === metaTypes.USER){
        return <Badge style={styleVariants.DANGER}>{useTranslation("User")}</Badge>
    }

    return (
        <Badge style={style}>
            {findValue}
        </Badge>
    );
};

BelongBadge.propTypes = {
    belongsTo: PropTypes.oneOf(supportedBelongsTo).isRequired,
    find: PropTypes.string.isRequired
};

export default BelongBadge;