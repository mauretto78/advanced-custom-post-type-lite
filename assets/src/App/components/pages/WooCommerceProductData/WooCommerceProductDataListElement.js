import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from "@iconify/react";
import '../../../scss/woocommerce.scss';
import Boolean from "../../reusable/Boolean";
import WooCommerceProductDataVisibility from "../../reusable/WooCommerceProductDataVisibility";
import MetaBoxMiniTable from "../CustomPostTypeList/MetaBoxMiniTable";
import Tippy from "../../reusable/Tippy";
import WooCommerceFieldsMiniTable from "./WooCommerceFieldsMiniTable";

const WooCommerceProductDataListElement = ({id, element}) => {
    return (
        <React.Fragment>
            <tr>
                <td className="backend">
                    <strong>{element.name}</strong>
                    <div className="element-buttons">
                        <a href={`#/product-data/product/view/${id}`}>
                            View
                        </a>
                        &nbsp;
                        <a href={`#/product-data/product/edit/${id}`}>
                            Edit
                        </a>
                        &nbsp;
                        <a href={`#/product-data/product/delete/${id}`}>
                            Delete
                        </a>
                    </div>
                </td>
                <td className="backend">
                    <span className={`wcicon-lg wcicon-${element.icon.icon}`} />
                </td>
                <td className="backend">
                    <Boolean status={element.showInUI}/>
                </td>
                <td className="backend">
                    <WooCommerceProductDataVisibility visibility={element.visibility} />
                </td>
                <td className="backend">
                    {element.fields.length > 0
                        ?
                        <Tippy
                            placement='top'
                            html={(
                                <WooCommerceFieldsMiniTable id={element.id} elements={element.fields}/>
                            )}
                        >
                            <Link
                                to={`/product-data/product/fields/${element.id}`}
                                className="acpt-btn acpt-btn-sm acpt-btn-info-o"
                            >
                                <Icon icon="bx:bxs-inbox" width="24px"/>
                                &nbsp;
                                Manage
                            </Link>
                        </Tippy>
                        :
                        <Link
                            to={`/product-data/product/fields/${element.id}`}
                            className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                        >
                            <Icon icon="bx:bxs-inbox" width="24px"/>
                            &nbsp;
                            Create
                        </Link>
                    }
                </td>
            </tr>
        </React.Fragment>
    );
};

export default WooCommerceProductDataListElement;