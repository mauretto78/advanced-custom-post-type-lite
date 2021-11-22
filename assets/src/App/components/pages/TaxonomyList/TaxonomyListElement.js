import React from 'react';
import Tippy from "../../reusable/Tippy";
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";
import {isset} from "../../../utils/objects";

const TaxonomyListElement = ({id, element}) => {

    return(
        <tr>
            <td className="backend">
                <div className="m-0 mb-1">
                    <Tippy
                        html={(
                            <div style={{
                                padding: "5px"
                            }}>
                                <a href={`#/view_taxonomy/${element.slug}`}>
                                    <Icon icon="bx:bx-search-alt" width="24px"/>
                                </a>
                                <a href={`#/edit_taxonomy/${element.slug}`}>
                                    <Icon icon="bx:bx-edit" width="24px"/>
                                </a>
                                <a href={`#/delete_taxonomy/${element.slug}`}>
                                    <Icon icon="bx:bx-trash" width="24px"/>
                                </a>
                            </div>
                        )}
                    >
                        <strong>{element.slug}</strong>
                    </Tippy>
                </div>
            </td>
            <td>
                <span className="acpt-badge">
                    <span className="label">
                        {element.singular}
                    </span>
                </span>
            </td>
            <td>
                <span className="acpt-badge">
                    <span className="label">
                        {element.plural}
                    </span>
                </span>
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
                        className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
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