import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import {isset} from "../../../utils/objects";
import Tippy from "../../reusable/Tippy";
import {Icon} from "@iconify/react";
import Modal from "../../reusable/Modal";
import MetaBoxMiniTable from "./MetaBoxMiniTable";
import TaxonomiesMiniTable from "./TaxonomiesMiniTable";
import WoocommerceMiniTable from "./WoocommerceMiniTable";

const CustomPostTypeListElement = ({id, thereIsWooCommerce, element, handeDeleteTemplate}) => {

    // manage local state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTemplateType, setModalTemplateType] = useState(false);

    return (
        <React.Fragment>
            <Modal title={`Confirm deleting this template?`} visible={modalVisible}>
                <p>Are you sure?</p>
                <p>
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                            handeDeleteTemplate(element.name, modalTemplateType);
                        }}
                    >
                        Yes
                    </a>
                    &nbsp;
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary-o"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }}
                    >
                        No
                    </a>
                </p>
            </Modal>
            <tr>
                <td className="backend">
                    <Icon icon={`dashicons:${element.icon}`} color="#7e9ebd" width="18px" />
                </td>
                <td className="backend">
                    <div className="m-0 mb-1">
                        <strong>{element.name}</strong>
                        {!element.isNative &&
                            <div className="element-buttons">
                                <a href={`#/view/${element.name}`}>
                                    View
                                </a>
                                &nbsp;
                                <a href={`#/edit/${element.name}`}>
                                    Edit
                                </a>
                                &nbsp;
                                <a href={`#/delete/${element.name}`}>
                                    Delete
                                </a>
                            </div>
                        }
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
                <td className="backend">
                    {isset(element, "meta") &&  element.meta.length > 0 ?
                        <Tippy
                            placement='end'
                            html={(
                                <MetaBoxMiniTable postType={element.name} elements={element.meta}/>
                            )}
                        >
                            <Link
                                to={`meta/${element.name}`}
                                className="acpt-btn acpt-btn-sm acpt-btn-info-o"
                            >
                                <Icon icon="bx:bxs-inbox" width="18px"/>
                                &nbsp;
                                Manage
                            </Link>
                        </Tippy>
                        :
                        <Link
                            to={`meta/${element.name}`}
                            className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                        >
                            <Icon icon="bx:bxs-inbox" width="18px"/>
                            &nbsp;
                            Create
                        </Link>
                    }
                </td>
                {thereIsWooCommerce === true && (
                    <td className="backend">
                        {element.isWooCommerce === true && (
                            <React.Fragment>
                                {isset( element, "woocommerceProductData" ) && element.woocommerceProductData.length > 0 ?
                                    <Tippy
                                        placement='top'
                                        html={(
                                            <WoocommerceMiniTable postType={element.name} elements={element.woocommerceProductData}/>
                                        )}
                                    >
                                        <Link
                                            to={`/product-data/${element.name}`}
                                            className="acpt-btn acpt-btn-sm acpt-btn-info-o"
                                        >
                                            <Icon icon="icon-park-outline:ad-product" width="18px"/>
                                            &nbsp;
                                            Manage
                                        </Link>
                                    </Tippy>
                                    :
                                    <Link
                                        to={`/product-data/${element.name}`}
                                        className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                                    >
                                        <Icon icon="icon-park-outline:ad-product" width="18px"/>
                                        &nbsp;
                                        Create
                                    </Link>
                                }
                            </React.Fragment>
                        ) }
                    </td>
                )}
                <td>
                    {isset(element, "taxonomies") &&  element.taxonomies.length > 0 ?
                        <Tippy
                            placement='top'
                            html={(
                                <TaxonomiesMiniTable postType={element.name} elements={element.taxonomies}/>
                            )}
                        >
                            <Link
                                to={`/assoc-taxonomy-post/${element.name}`}
                                className="acpt-btn acpt-btn-sm acpt-btn-info-o"
                            >
                                <Icon icon="bx:bxs-inbox" width="18px"/>
                                &nbsp;
                                Manage
                            </Link>
                        </Tippy>
                        :
                        <Link
                            to={`/assoc-taxonomy-post/${element.name}`}
                            className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                        >
                            <Icon icon="bx:bxs-inbox" width="18px"/>
                            &nbsp;
                            Associate
                        </Link>
                    }
                </td>
                <td className="backend with-border">
                    <span className="acpt-badge">
                        <span className="label">
                            {element.postCount}
                        </span>
                    </span>
                </td>
                <td className="frontend">
                    <a
                        className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                        href="https://acpt.io/"
                        target="_blank"
                    >
                        <Icon icon="fluent:premium-16-filled" width="18px" />
                        Buy a Premium Plan
                    </a>
                </td>
                <td className="frontend">
                    <a
                        className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                        href="https://acpt.io/"
                        target="_blank"
                    >
                        <Icon icon="fluent:premium-16-filled" width="18px" />
                        Buy a Premium Plan
                    </a>
                </td>
            </tr>
        </React.Fragment>
    );
};

export default CustomPostTypeListElement;