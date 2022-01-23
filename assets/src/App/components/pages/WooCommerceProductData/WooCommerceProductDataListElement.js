import React from 'react';
import {Link} from 'react-router-dom'
import Tippy from "../../reusable/Tippy";
import {Icon} from "@iconify/react";
import '../../../scss/woocommerce.scss';
import Boolean from "../../reusable/Boolean";
import WooCommerceProductDataVisibility from "../../reusable/WooCommerceProductDataVisibility";

const WooCommerceProductDataListElement = ({id, element}) => {
    return (
        <React.Fragment>
            <tr>
                <td className="backend">
                    <Tippy
                        html={(
                            <div style={{
                                padding: "5px"
                            }}>
                                <a href={`#/product-data/product/view/${id}`}>
                                    <Icon icon="bx:bx-search-alt" width="24px"/>
                                </a>
                                <a href={`#/product-data/product/edit/${id}`}>
                                    <Icon icon="bx:bx-edit" width="24px"/>
                                </a>
                                <a href={`#/product-data/product/delete/${id}`}>
                                    <Icon icon="bx:bx-trash" width="24px"/>
                                </a>
                            </div>
                        )}
                    >
                        <strong>{element.name}</strong>
                    </Tippy>
                </td>
                <td className="backend">
                    <span className={`wcicon-${element.icon.icon}`} />
                </td>
                <td className="backend">
                    <Boolean status={element.showInUI}/>
                </td>
                <td className="backend">
                    <WooCommerceProductDataVisibility visibility={element.visibility} />
                </td>
                <td className="backend">
                    <span className="acpt-badge mr-1">
                        <span className="label">
                            {element.fields.length}
                        </span>
                    </span>
                    <Link
                        to={`/product-data/product/fields/${element.id}`}
                        className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                    >
                        <Icon icon="bx:bxs-inbox" width="24px"/>
                        &nbsp;
                        Manage
                    </Link>
                </td>
            </tr>
        </React.Fragment>
    );
};

export default WooCommerceProductDataListElement;