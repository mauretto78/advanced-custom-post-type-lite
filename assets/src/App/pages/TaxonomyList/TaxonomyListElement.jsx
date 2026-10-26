import React, {memo} from 'react';
import PropTypes from 'prop-types';
import LockedExportCode from "../../lite/LockedExportCode.jsx";
import {metaTypes} from "../../constants/metaTypes";
import useTranslation from "../../hooks/useTranslation";
import ElementTypeBadge from "../../components/ElementTypeBadge";
import {isset} from "../../utils/objects";
import {Link} from "react-router-dom";
import DeleteTaxonomyModal from "./Modal/DeleteTaxonomyModal";
import {useFormContext} from "react-hook-form";
import FieldGroupsModal from "../../components/Modal/FieldGroupsModal";
import {wpAjaxRequest} from "../../utils/ajax";
import {setCookieMessage} from "../../utils/cookies";
import {scrollToTop} from "../../utils/scroll";
import {refreshPage} from "../../utils/misc";
import {toast} from "react-hot-toast";
import {Icon} from "@iconify/react";
import {primaryColor} from "../../utils/colors";
import DropdownMenu from "../../components/DropdownMenu";
import {styleVariants} from "../../constants/styles";
import {hideElement} from "../../utils/localStorage.jsx";
import {taxonomyProps} from "../../props/cptTaxonomyProps.js";

const TaxonomyListElement = memo(({record, page, perPage, handleSelect}) => {
    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.slug}`;

    const handleDuplicate = () => {
        wpAjaxRequest('duplicateAction', {belongsTo: metaTypes.TAXONOMY, find: record.slug})
            .then(res => {
                if(res.success === true){
                    setCookieMessage("Taxonomy successfully duplicated.");
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

    return (
        <React.Fragment>
            <tr>
                <td style={{
                    width: "24px"
                }}>
                    {!record.isNative && (
                        <label
                            className="checkbox"
                            htmlFor={formId}
                            data-testid={`select-${record.slug}`}
                        >
                            <input
                                type="checkbox"
                                id={formId}
                                name={formId}
                                defaultChecked={false}
                                {...register(formId)}
                                onClick={e => handleSelect(record.slug, e.target.checked, e)}
                            />
                            <span/>
                        </label>
                    )}
                </td>
                <td>
                    {record.slug}
                </td>
                <td>
                    <ElementTypeBadge element={record}/>
                </td>
                <td>
                    {isset(record, "customPostTypes") &&  record.customPostTypes.length > 0 ?
                        <Link to={`/assoc-post-taxonomy/${record.slug}`}>
                            {useTranslation("Manage")}
                        </Link>
                        :
                        <Link to={`/assoc-post-taxonomy/${record.slug}`}>
                            {useTranslation("Associate")}
                        </Link>
                    }
                </td>
                <td>
                    <div className="i-flex-center s-8">
                        <Link to={`/register_meta?belongsTo=${metaTypes.TAXONOMY}&find=${record.slug}`}>
                            {useTranslation("Create")}
                        </Link>
                        <FieldGroupsModal
                            find={record.slug}
                            belongsTo={metaTypes.TAXONOMY}
                        />
                    </div>
                </td>
                <td>
                    {!record.isNative && (
                        <DropdownMenu
                            name="block-menu"
                            label={`${useTranslation("Actions for")} ${record.slug}`}
                            buttonClass={styleVariants.OUTLINED_SECONDARY}
                            anchor={
                                <Icon icon="bx:dots-vertical-rounded" color={primaryColor()} width={24} />
                            }
                            links={[
                                <Link to={`/view_taxonomy/${record.slug}`}>
                                    {useTranslation("View")}
                                </Link>,
                                <Link to={`/edit_taxonomy/${record.slug}`}>
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
                                <DeleteTaxonomyModal
                                    page={page}
                                    perPage={perPage}
                                    taxonomy={record.slug}
                                />,
                                <LockedExportCode feature="taxonomy" />,
                                <button
                                    type="button"
                                    className="btn-reset"
                                    onClick={e => {
                                        e.preventDefault();
                                        hideElement(record.slug, metaTypes.TAXONOMY);
                                        const event = new Event('hideElement');
                                        document.dispatchEvent(event);
                                    }}>
                                    {useTranslation("Hide")}
                                </button>,
                            ]}
                        />
                    )}
                </td>
            </tr>
        </React.Fragment>
    );
});

TaxonomyListElement.propTypes = {
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    record: PropTypes.shape(taxonomyProps).isRequired,
    handleSelect: PropTypes.func.isRequired,
};

export default TaxonomyListElement;