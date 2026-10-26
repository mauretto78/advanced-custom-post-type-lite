import React, {memo} from 'react';
import PropTypes from 'prop-types';
import ElementIcon from "../../components/ElementIcon";
import useTranslation from "../../hooks/useTranslation";
import {Link} from "react-router-dom";
import ElementTypeBadge from "../../components/ElementTypeBadge";
import LockedExportCode from "../../lite/LockedExportCode.jsx";
import {metaTypes} from "../../constants/metaTypes";
import {isset} from "../../utils/objects";
import DeleteCustomPostTypeModal from "./Modal/DeleteCustomPostTypeModal";
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
import {customPostTypeProps} from "../../props/cptTaxonomyProps.js";

const CustomPostTypeElement = memo(({record, showWooCommerceColumn, handleSelect, page, perPage}) => {
    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.name}`;

    /**
     *
     * @return {string}
     */
    const createLink = () => {
        if(record.name === 'attachment'){
            return `/register_meta?belongsTo=media&find=All%20formats`;
        }

        return `/register_meta?belongsTo=${metaTypes.CUSTOM_POST_TYPE}&find=${record.name}`;
    };

    const handleDuplicate = () => {
        wpAjaxRequest('duplicateAction', {belongsTo: metaTypes.CUSTOM_POST_TYPE, find: record.name})
            .then(res => {
                if(res.success === true){
                    setCookieMessage("Custom post type successfully duplicated.");
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
                            data-testid={`select-${record.name}`}
                        >
                            <input
                                type="checkbox"
                                id={formId}
                                name={formId}
                                defaultChecked={false}
                                {...register(formId)}
                                onClick={e => handleSelect(record.name, e.target.checked, e)}
                            />
                            <span/>
                        </label>
                    )}
                </td>
                <td>
                    <ElementIcon value={record.icon} />
                </td>
                <td>
                    {record.name}
                </td>
                <td>
                    <ElementTypeBadge element={record} />
                </td>
                <td>
                    {isset(record, "taxonomies") &&  record.taxonomies?.length > 0 ?
                        <Link to={`/assoc-taxonomy-post/${record.name}`}>
                            {useTranslation("Manage")}
                        </Link>
                        :
                        <Link to={`/assoc-taxonomy-post/${record.name}`}>
                            {useTranslation("Associate")}
                        </Link>
                    }
                </td>
                {showWooCommerceColumn && (
                    <td>
                        {record.isWooCommerce === true && (
                            <React.Fragment>
                                {isset( record, "woocommerceProductData" ) && record.woocommerceProductData?.length > 0 ?
                                    <Link to={`/product-data/${record.name}`}>
                                        {useTranslation("Manage")}
                                    </Link>
                                    :
                                    <Link to={`/product-data/${record.name}`}>
                                        {useTranslation("Create")}
                                    </Link>
                                }
                            </React.Fragment>
                        ) }
                    </td>
                )}
                <td>
                    <div className="i-flex-center s-8">
                        <Link to={createLink()}>
                            {useTranslation("Create")}
                        </Link>
                        <FieldGroupsModal
                            find={record.name}
                            belongsTo={metaTypes.CUSTOM_POST_TYPE}
                        />
                    </div>
                </td>
                <td>
                    {!record.isNative && (
                        <DropdownMenu
                            name="custom-post-type-menu"
                            label={`${useTranslation("Actions for")} ${record.name}`}
                            buttonClass={styleVariants.OUTLINED_SECONDARY}
                            anchor={
                                <Icon icon="bx:dots-vertical-rounded" color={primaryColor()} width={24} />
                            }
                            links={[
                                <Link to={`view/${record.name}`}>
                                    {useTranslation("View")}
                                </Link>,
                                <Link to={`edit/${record.name}`}>
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
                                <DeleteCustomPostTypeModal
                                    page={page}
                                    perPage={perPage}
                                    postType={record.name}
                                />,
                                <LockedExportCode feature="post-type" />,
                                <button
                                    type="button"
                                    className="btn-reset"
                                    onClick={e => {
                                        e.preventDefault();
                                        hideElement(record.name, metaTypes.CUSTOM_POST_TYPE);
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

CustomPostTypeElement.propTypes = {
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    record: PropTypes.shape(customPostTypeProps).isRequired,
    showWooCommerceColumn: PropTypes.bool.isRequired,
    handleSelect: PropTypes.func.isRequired,
};

export default CustomPostTypeElement;