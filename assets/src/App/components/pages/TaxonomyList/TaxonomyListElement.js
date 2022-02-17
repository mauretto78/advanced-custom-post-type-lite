import React from 'react';
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";
import {isset} from "../../../utils/objects";

const TaxonomyListElement = ({id, element}) => {

    return(
        <tr>
            <td className="backend">
                <div className="m-0 mb-1">
                    <strong>{element.slug}</strong>
                    {!element.isNative && (
                        <div>
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
                {element.isNative
                    ?
                    <span className={`acpt-badge acpt-badge-native ml-1`}>
                            <span className="label">
                                Native
                            </span>
                        </span>
                    :
                    <span className={`acpt-badge acpt-badge-${element.isWooCommerce === true ? 'woocommerce' : 'custom' } ml-1`}>
                            <span className="label">
                                {element.isWooCommerce === true ? 'WooCommerce' : 'Custom' }
                            </span>
                        </span>
                }
            </td>
            <td>
                {element.singular}
            </td>
            <td>
                {element.plural}
            </td>
            <td className="with-border">
                <span className="acpt-badge">
                    <span className="label">
                        {element.postCount}
                    </span>
                </span>
            </td>
            <td>
                {isset(element, "customPostTypes") &&  element.customPostTypes.length > 0 && element.customPostTypes.map((customPostType) =>
                    <Link
                        to={`/assoc-taxonomy-post/${customPostType.name}`}
                        className="acpt-btn acpt-btn-sm acpt-btn-info-o mr-1"
                    >
                        <Icon icon="bx:bx-purchase-tag" width="24px"/>
                        {customPostType.name}
                    </Link>
                )}
            </td>
        </tr>
    )
};

export default TaxonomyListElement;