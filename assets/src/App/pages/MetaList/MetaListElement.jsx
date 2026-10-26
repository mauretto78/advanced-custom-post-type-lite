import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import DeleteMetaModal from "./Modal/DeleteMetaModal";
import BelongsModal from "../../components/Modal/BelongsModal";
import {useFormContext} from "react-hook-form";
import {styleVariants} from "../../constants/styles";
import Badge from "../../components/Badge";
import {wpAjaxRequest} from "../../utils/ajax";
import {metaTypes} from "../../constants/metaTypes";
import {toast} from "react-hot-toast";
import {setCookieMessage} from "../../utils/cookies";
import {scrollToTop} from "../../utils/scroll";
import {refreshPage} from "../../utils/misc";
import {Icon} from "@iconify/react";
import {primaryColor} from "../../utils/colors";
import DropdownMenu from "../../components/DropdownMenu";
import LockedExportCode from "../../lite/LockedExportCode.jsx";
import {hideElement} from "../../utils/localStorage.jsx";
import DisplayBadge from "../../components/DisplayBadge/index.jsx";

const MetaListElement = memo(({record, page, handleSelect}) => {
    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.id}`;

    const handleDuplicate = () => {
        wpAjaxRequest('duplicateAction', {belongsTo: metaTypes.META, find: record.id})
            .then(res => {
                if(res.success === true){
                    setCookieMessage("Meta group successfully duplicated.");
                    scrollToTop();
                    refreshPage();
                } else {
                    toast.error(res.error);
                }
            }).catch(err => {
                console.error(err);
                toast.error(useTranslation("Unknown error, please retry later"));
            })
        ;
    };

    /**
     *
     * @param context
     * @return {*}
     */
    const context = (context) => {
        let variant;

        switch (context) {
            case "advanced":
                variant = styleVariants.SUCCESS;
                break;

            case "normal":
                variant = styleVariants.INFO;
                break;

            case "side":
                variant = styleVariants.DANGER;
                break;
        }

        if(!variant){
            return null;
        }

        return (
            <Badge style={variant}>
                {context}
            </Badge>
        );
    };

    /**
     *
     * @param priority
     * @return {*}
     */
    const priority = (priority) => {
        let variant;

        switch (priority) {
            case "default":
                variant = styleVariants.SUCCESS;
                break;

            case "core":
                variant = styleVariants.INFO;
                break;

            case "high":
                variant = styleVariants.WARNING;
                break;

            case "low":
                variant = styleVariants.DANGER;
                break;
        }

        if(!variant){
            return null;
        }

        return (
            <Badge style={variant}>
                {priority}
            </Badge>
        );
    };

    return (
        <React.Fragment>
            <tr>
                <td style={{
                    width: "24px"
                }}>
                    <label className="checkbox" htmlFor={formId} data-testid={`select-${record.name}`}>
                        <input
                            type="checkbox"
                            id={formId}
                            name={formId}
                            defaultChecked={false}
                            {...register(formId)}
                            onClick={e => handleSelect(record.id, e.currentTarget.checked, e)}
                        />
                        <span/>
                    </label>
                </td>
                <td>
                    {record.name}
                </td>
                <td>
                    {record.label}
                </td>
                <td>
                    <DisplayBadge display={record.display} />
                </td>
                <td>
                    {context(record.context)}
                </td>
                <td>
                    {priority(record.priority)}
                </td>
                <td>
                    <BelongsModal belongs={record.belongs} />
                </td>
                <td>
                    {record.fieldsCount}
                </td>
                <td>
                    <DropdownMenu
                        name="meta-field-menu"
                        label={`${useTranslation("Actions for")} ${record.label || record.name}`}
                        buttonClass={styleVariants.OUTLINED_SECONDARY}
                        anchor={
                            <Icon icon="bx:dots-vertical-rounded" color={primaryColor()} width={24} />
                        }
                        links={[
                            <Link to={`/edit_meta/${record.id}`}>
                                {useTranslation("Edit")}
                            </Link>,
                            <button
                                type="button"
                                className="btn-reset"
                                onClick={e => {
                                e.preventDefault();
                                handleDuplicate();
                            }}>
                                {useTranslation("Duplicate")}
                            </button>,
                            <DeleteMetaModal
                                id={record.id}
                                page={page}
                            />,
                            <LockedExportCode feature="field-group" />,
                            <button
                                type="button"
                                className="btn-reset"
                                onClick={e => {
                                    e.preventDefault();
                                    hideElement(record.id, metaTypes.META);
                                    const event = new Event('hideElement');
                                    document.dispatchEvent(event);
                                }}>
                                {useTranslation("Hide")}
                            </button>,
                        ]}
                    />
                </td>
            </tr>
        </React.Fragment>
    );
});

MetaListElement.propTypes = {
    page: PropTypes.number.isRequired,
    record: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
};

export default MetaListElement;