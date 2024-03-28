import React, {memo} from 'react';
import PropTypes from 'prop-types';
import ExportCodeModal from "../../components/Modal/ExportCodeModal";
import {metaTypes} from "../../constants/metaTypes";
import useTranslation from "../../hooks/useTranslation";
import ElementTypeBadge from "../../components/ElementTypeBadge";
import {isset} from "../../utils/objects";
import {Link} from "react-router-dom";
import DeleteTaxonomyModal from "./Modal/DeleteTaxonomyModal";
import {useFormContext} from "react-hook-form";
import FieldGroupsModal from "../../components/Modal/FieldGroupsModal";

const TaxonomyListElement = memo(({record}) => {

    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.slug}`;

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
                            data-cy={`select-${record.slug}`}
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
                        <div className="i-flex-center s-8">
                            <a href={`#/view_taxonomy/${record.slug}`}>
                                {useTranslation("View")}
                            </a>
                            <a href={`#/edit_taxonomy/${record.slug}`}>
                                {useTranslation("Edit")}
                            </a>
                            <DeleteTaxonomyModal taxonomy={record.slug} />
                            <ExportCodeModal
                                belongsTo={metaTypes.TAXONOMY}
                                find={record.slug}
                            />
                        </div>
                    )}
                </td>
            </tr>
        </React.Fragment>
    );
});

TaxonomyListElement.propTypes = {
    record: PropTypes.object.isRequired
};

export default TaxonomyListElement;