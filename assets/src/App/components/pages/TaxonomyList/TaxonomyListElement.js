import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {isset} from "../../../utils/objects";
import Tippy from "../../reusable/Tippy";
import CustomPostTypeLabel from "../../reusable/CustomPostType/CustomPostTypeLabel";
import CustomPostTypesMiniTable from "./CustomPostTypesMiniTable";
import MetaBoxMiniTable from "../../reusable/Meta/MetaBoxMiniTable";
import ProFeatureAlert from "../../reusable/ProFeatureAlert";

const TaxonomyListElement = ({id, element, handleDeleteTemplate}) => {

    return(
        <React.Fragment>
            <tr>
                <td className="backend">
                    <div className="m-0 mb-1">
                        <strong>{element.slug}</strong>
                        {!element.isNative && (
                            <div className="element-buttons">
                                <a href={`#/view_taxonomy/${element.slug}`}>
                                    View
                                </a>
                                &nbsp;
                                <a href={`#/edit_taxonomy/${element.slug}`}>
                                    Edit
                                </a>
                                &nbsp;
                                <a href={`#/delete_taxonomy/${element.slug}`}>
                                    Delete
                                </a>
                            </div>
                        )}
                    </div>
                </td>
                <td>
                    <CustomPostTypeLabel element={element} />
                </td>
                <td>
                    {isset(element, "meta") &&  element.meta.length > 0 ?
                        <Link
                            to={`meta-taxonomy/${element.slug}`}
                            className="acpt-btn no-border acpt-btn-sm acpt-btn-info-o"
                        >
                            Manage
                        </Link>
                        :
                        <Link
                            to={`/meta-taxonomy/${element.slug}`}
                            className="acpt-btn no-border acpt-btn-sm acpt-btn-primary-o"
                        >
                            Create
                        </Link>
                    }
                </td>
                <td>
                    {isset(element, "customPostTypes") &&  element.customPostTypes.length > 0 ?
                        <Link
                            to={`/assoc-post-taxonomy/${element.slug}`}
                            className="acpt-btn no-border acpt-btn-sm acpt-btn-info-o"
                        >
                            Manage
                        </Link>
                        :
                        <Link
                            to={`/assoc-post-taxonomy/${element.slug}`}
                            className="acpt-btn no-border acpt-btn-sm acpt-btn-primary-o"
                        >
                            Associate
                        </Link>
                    }
                </td>
                <td className="with-border">
                    <span className="acpt-badge acpt-badge-success">
                        <span className="label">
                            {element.postCount}
                        </span>
                    </span>
                </td>
                <td className="frontend">
                    <ProFeatureAlert />
                </td>
            </tr>
        </React.Fragment>
    )
};

export default TaxonomyListElement;