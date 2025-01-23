import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";
import {metaTypes} from "../../constants/metaTypes";
import useTranslation from "../../hooks/useTranslation";
import Badge from "../Badge";
import {wpAjaxRequest} from "../../utils/ajax";

const BelongBadge = ({belongsTo, find}) => {

    const [findValue, setFindValue] = useState(find);

    let style = styleVariants.SECONDARY;

    if(belongsTo === metaTypes.TAXONOMY || belongsTo === 'TERM_ID'){
        style = styleVariants.WARNING;
    }

    if(belongsTo === metaTypes.OPTION_PAGE){
        style = styleVariants.INFO;
    }

    if(belongsTo === metaTypes.COMMENT){
        style = styleVariants.BORDERED;
    }

    if(belongsTo === "USER_ID"){
        style = styleVariants.DANGER;
    }

    const fetchFind = () => {
        wpAjaxRequest("fetchFindAction", {belongsTo :belongsTo, id:find})
            .then(res => {
                setFindValue(res);
            })
            .catch(err => {
                console.error(err.message);
            })
        ;
    };

    if(
        belongsTo === "PARENT_POST_ID" ||
        belongsTo === "POST_ID" ||
        belongsTo === "POST_TAX" ||
        belongsTo === "POST_CAT" ||
        belongsTo === "POST_TEMPLATE" ||
        belongsTo === "TERM_ID" ||
        belongsTo === "USER_ID"
    ){
        fetchFind();
    }

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
    belongsTo: PropTypes.string.isRequired,
    find: PropTypes.string.isRequired
};

export default BelongBadge;