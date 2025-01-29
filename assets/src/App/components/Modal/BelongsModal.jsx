import Modal from "./index";
import PropTypes from 'prop-types';
import React, {useState} from "react";
import useTranslation from "../../hooks/useTranslation";
import {styleVariants} from "../../constants/styles";
import Alert from "../Alert";
import BelongBadge from "../BelongBadge";
import {metaTypes} from "../../constants/metaTypes";

const BelongsModal = ({belongs}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    /**
     *
     * @param belong
     * @return {string|*}
     */
    const belongsTo = (belong) => {

        if(!belong.belongsTo){
            return '';
        }

        let string = '';

        switch (belong.belongsTo) {
            case metaTypes.CUSTOM_POST_TYPE:
                string = "Custom post type";
                break;

            case metaTypes.TAXONOMY:
                string = "Taxonomy";
                break;

            case metaTypes.OPTION_PAGE:
                string = "Option page";
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

        let string = '';

        switch (belong.operator) {
            case "=":
                string = "is equal to";
                break;

            case "!=":
                string = "is not equal to";
                break;

            case "IN":
                string = "is included in";
                break;

            case "NOT_IN":
                string = "is not included in";
                break;
        }

        return useTranslation(string);
    };

    /**
     *
     * @param belong
     * @return {*}
     */
    const find = (belong) => {
        if(!belong.find || belong.find === ''){
            return '';
        }

        const finds = belong.find.split(",");

        if(finds.length > 0){
            return (
                <div className="i-flex-center flex-wrap s-4">
                    {finds.map((find) => (
                        <BelongBadge
                            belongsTo={belong.belongsTo}
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
                {belongs.length > 0 ? (
                    <div className="responsive">
                        <table className={`acpt-table spaceless ${globals.is_rtl ? 'rtl' : ''}`}>
                            <tbody>
                            {belongs.map((belong, index) => {

                                const isLast = (index === (belongs.length-1));

                                return (
                                    <tr>
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
                                            {!isLast && belong.logic && useTranslation(belong.logic)}
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
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Show")}
            </a>
        </React.Fragment>
    );
};

BelongsModal.propTypes = {
    belongs: PropTypes.array.isRequired,
};

export default BelongsModal;