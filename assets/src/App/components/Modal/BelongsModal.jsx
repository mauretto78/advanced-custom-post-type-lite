import Modal from "./index";
import PropTypes from 'prop-types';
import React, {useState} from "react";
import useTranslation from "../../hooks/useTranslation";
import {styleVariants} from "../../constants/styles";
import Alert from "../Alert";
import BelongBadge from "../BelongBadge";
import {metaTypes} from "../../constants/metaTypes";
import {isArray} from "../../utils/objects.jsx";
import {belongShape} from "../../constants/propShapes.jsx";
import {isRTLOrientation} from "../../utils/misc";

const BelongsModal = ({belongs}) => {

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    /**
     *
     * @param belong
     * @return {string|*}
     */
    const belongsTo = (belong) => {

        const b = belong.belongsTo ?? belong.rule ?? null;

        if(!b){
            return '';
        }

        let string = '';

        switch (b) {
        case metaTypes.CUSTOM_POST_TYPE:
            string = "Custom post type";
            break;
        case metaTypes.TAXONOMY:
            string = "Taxonomy";
            break;
        case metaTypes.USER:
            string = "All users";
            break;
        case metaTypes.COMMENT:
            string = "All comments";
            break;
        case metaTypes.MEDIA:
            string = "Attachment";
            break;
        case "PARENT_POST_ID":
            string = "Post parent";
            break;
        case "POST_ID":
            string = "Post";
            break;
        case "POST_TEMPLATE":
            string = "Post template";
            break;
        case "POST_FORMAT":
            string = "Post format";
            break;
        case "POST_TAX":
            string = "Post taxonomy";
            break;
        case "POST_CAT":
            string = "Post category";
            break;
        case "TERM_ID":
            string = "Term";
            break;
        case "USER_ID":
            string = "User";
            break;
        }

        return useTranslation(string);
    };

    /**
     *
     * @param belong
     * @return {*}
     */
    const operator = (belong) => {

        if(!belong.operator){
            return '';
        }

        const OPERATOR_CLASSES = {
            '=':           'acpt-pill-op-eq',
            '!=':          'acpt-pill-op-neq',
            '>':           'acpt-pill-op-gt',
            '<':           'acpt-pill-op-lt',
            '>=':          'acpt-pill-op-gte',
            '<=':          'acpt-pill-op-lte',
            'IN':          'acpt-pill-op-in',
            'NOT_IN':      'acpt-pill-op-not-in',
            'LIKE':        'acpt-pill-op-like',
            'NOT_LIKE':    'acpt-pill-op-not-like',
            'BLANK':       'acpt-pill-op-blank',
            'NOT_BLANK':   'acpt-pill-op-not-blank',
            'NULL':        'acpt-pill-op-null',
            'NOT_NULL':    'acpt-pill-op-null',
            'CHECKED':     'acpt-pill-op-checked',
            'NOT_CHECKED': 'acpt-pill-op-not-checked',
            'MAX':         'acpt-pill-op-gt',
            'MIN':         'acpt-pill-op-lt',
            'REGEX':       'acpt-pill-op-like',
        };
        const variantClass  = OPERATOR_CLASSES[belong.operator]  ?? '';

        return (
            <span className={`acpt-pill acpt-pill-operator ${variantClass}`}>
                {belong.operator}
            </span>
        );
    };

    /**
     *
     * @param belong
     * @return {*}
     */
    const find = (belong) => {

        const f = belong.find ?? belong.value ?? null;

        if(!f || f === ''){
            return '';
        }

        const finds = isArray(f) ? f : f.split(",");

        if(finds.length > 0){
            return (
                <div className="i-flex-center flex-wrap s-4">
                    {finds.map((find) => (
                        <BelongBadge
                            key={find}
                            belongsTo={belong.belongsTo ?? belong.rule}
                            find={find}
                        />
                    ))}
                </div>
            );
        }

        return '';
    };

    return (
        <React.Fragment>
            <Modal title={useTranslation("Location")} visible={modalOpen} textAlign="left">
                {belongs?.length > 0 ? (
                    <div className="responsive">
                        <table className={`acpt-table spaceless ${isRTLOrientation()}`}>
                            <tbody>
                            {belongs.map((belong, index) => {

                                const isLast = (index === (belongs.length-1));

                                return (
                                    <tr key={belong.id ?? index}>
                                        <td>
                                            {belongsTo(belong)}
                                        </td>
                                        <td>
                                            {operator(belong)}
                                        </td>
                                        <td>
                                            {find(belong)}
                                        </td>
                                        <td>
                                            {!isLast && belong.logic && (
                                                <span className={`acpt-pill acpt-pill-${belong.logic.toLowerCase()}`}>
                                                    {belong.logic}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Alert style={styleVariants.SECONDARY}>
                        {useTranslation("No conditions are present.")}
                    </Alert>
                )}
            </Modal>
            <button
                type="button"
                className="btn-reset"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Show")}
            </button>
        </React.Fragment>
    );
};

BelongsModal.propTypes = {
    belongs: PropTypes.arrayOf(belongShape).isRequired,
};

export default BelongsModal;