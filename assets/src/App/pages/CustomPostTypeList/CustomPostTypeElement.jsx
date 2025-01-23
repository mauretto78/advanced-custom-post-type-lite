import React, {memo} from 'react';
import PropTypes from 'prop-types';
import ElementIcon from "../../components/ElementIcon";
import useTranslation from "../../hooks/useTranslation";
import {Link} from "react-router-dom";
import ElementTypeBadge from "../../components/ElementTypeBadge";
import ExportCodeModal from "../../components/Modal/ExportCodeModal";
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

const CustomPostTypeElement = memo(({record, showWooCommerceColumn, page, perPage}) => {

    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.name}`;

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
                            data-cy={`select-${record.name}`}
                        >
                            <input
                                type="checkbox"
                                id={formId}
                                name={formId}
                                defaultChecked={false}
                                {...register(formId)}
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
                    {isset(record, "taxonomies") &&  record.taxonomies.length > 0 ?
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
                                {isset( record, "woocommerceProductData" ) && record.woocommerceProductData.length > 0 ?
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
                        <Link to={`/register_meta?belongsTo=${metaTypes.CUSTOM_POST_TYPE}&find=${record.name}`}>
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
                        <div className="i-flex-center s-8">
                            <Link to={`view/${record.name}`}>
                                {useTranslation("View")}
                            </Link>
                            <Link to={`edit/${record.name}`}>
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
                            <DeleteCustomPostTypeModal
                                page={page}
                                perPage={perPage}
                                postType={record.name}
                            />
                            <ExportCodeModal belongsTo={metaTypes.CUSTOM_POST_TYPE} find={record.name} />
                            <Link
                                to={`/permissions/post/${record.name}/${record.id}`}
                                className="color-warning"
                            >
                                {useTranslation("Permissions")}
                            </Link>
                        </div>
                    )}
                </td>
            </tr>
        </React.Fragment>

    );
});

CustomPostTypeElement.propTypes = {
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    record: PropTypes.object.isRequired,
    showWooCommerceColumn: PropTypes.bool.isRequired,
};

export default CustomPostTypeElement;