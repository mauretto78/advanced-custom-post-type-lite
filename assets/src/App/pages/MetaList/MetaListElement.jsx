import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import DeleteMetaModal from "./Modal/DeleteMetaModal";
import BelongsModal from "../../components/Modal/BelongsModal";
import {useFormContext} from "react-hook-form";
import {fieldGroupsDisplay} from "../../constants/fields";
import {styleVariants} from "../../constants/styles";
import Badge from "../../components/Badge";
import {wpAjaxRequest} from "../../utils/ajax";
import {metaTypes} from "../../constants/metaTypes";
import {toast} from "react-hot-toast";
import {setCookieMessage} from "../../utils/cookies";
import {scrollToTop} from "../../utils/scroll";
import {refreshPage} from "../../utils/misc";

const MetaListElement = memo(({record, page}) => {

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
     * @param display
     * @return {*}
     */
    const displayAs = (display) => {

        let variant;
        let label;

        switch (display) {
            default:
            case fieldGroupsDisplay.STANDARD:
                variant = styleVariants.INFO;
                label = useTranslation("Standard view");
                break;
            case fieldGroupsDisplay.ACCORDION:
                variant = styleVariants.SUCCESS;
                label = useTranslation("Accordion");
                break;
            case fieldGroupsDisplay.HORIZONTAL_TABS:
                variant = styleVariants.WARNING;
                label = useTranslation("Horizontal tabs");
                break;
            case fieldGroupsDisplay.VERTICAL_TABS:
                variant = styleVariants.DANGER;
                label = useTranslation("Vertical tabs");
                break;
        }

        if(!variant){
            return null;
        }

        if(!label){
            return null;
        }

        return (
            <Badge style={variant}>
                {label}
            </Badge>
        );
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
                    <label className="checkbox" htmlFor={formId}>
                        <input
                            type="checkbox"
                            id={formId}
                            name={formId}
                            defaultChecked={false}
                            {...register(formId)}
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
                    {displayAs(record.display)}
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
                    <div className="i-flex-center s-8">
                        <Link to={`/edit_meta/${record.id}`}>
                            {useTranslation("Edit")}
                        </Link>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleDuplicate();
                            }}
                        >
                            {useTranslation("Duplicate")}
                        </a>
                        <DeleteMetaModal
                            id={record.id}
                            page={page}
                        />
                    </div>
                </td>
            </tr>
        </React.Fragment>
    );
});

MetaListElement.propTypes = {
    page: PropTypes.number.isRequired,
    record: PropTypes.object.isRequired
};

export default MetaListElement;