import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {isset} from "../../../utils/objects";
import Tippy from "../../reusable/Tippy";
import CustomPostTypeLabel from "../../reusable/CustomPostType/CustomPostTypeLabel";
import CustomPostTypesMiniTable from "./CustomPostTypesMiniTable";
import MetaBoxMiniTable from "../../reusable/Meta/MetaBoxMiniTable";

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
                        <Tippy
                            placement='end'
                            html={(
                                <MetaBoxMiniTable taxonomy={element.slug} elements={element.meta}/>
                            )}
                        >
                            <Link
                                to={`meta-taxonomy/${element.slug}`}
                                className="acpt-btn no-border acpt-btn-sm acpt-btn-info-o"
                            >
                                Manage
                            </Link>
                        </Tippy>
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
                        <Tippy
                            placement='top'
                            html={(
                                <CustomPostTypesMiniTable taxonomy={element.slug} elements={element.customPostTypes}/>
                            )}
                        >
                            <Link
                                to={`/assoc-post-taxonomy/${element.slug}`}
                                className="acpt-btn no-border acpt-btn-sm acpt-btn-info-o"
                            >
                                Manage
                            </Link>
                        </Tippy>
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
                    <span className="acpt-badge">
                        <span className="label">
                            {element.postCount}
                        </span>
                    </span>
                </td>
                <td className="frontend">
                    <a
                        className="acpt-btn no-border acpt-btn-sm acpt-btn-primary-o text-danger"
                        href="https://acpt.io/checkout"
                        target="_blank"
                    >
                        Buy a PRO license
                    </a>
                </td>
            </tr>
        </React.Fragment>
    )
};

export default TaxonomyListElement;