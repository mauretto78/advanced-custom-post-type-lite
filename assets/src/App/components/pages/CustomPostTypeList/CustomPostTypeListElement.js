import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import {isset} from "../../../utils/objects";
import Tippy from "../../reusable/Tippy";
import {Icon} from "@iconify/react";
import Modal from "../../reusable/Modal";

const CustomPostTypeListElement = ({id, element, handeDeleteTemplate}) => {

    // manage local state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTemplateType, setModalTemplateType] = useState(false);

    // manage redirect
    const openDeleteModal = (templateType) => {
        setModalTemplateType(templateType);
        setModalVisible(!modalVisible);
    };

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
                <div className="m-0 mb-1">
                    {element.isNative
                        ?
                        <strong>{element.name}</strong>
                        :
                        <Tippy
                            html={(
                                <div style={{
                                    padding: "5px"
                                }}>
                                    <a href={`#/view/${element.name}`}>
                                        <Icon icon="bx:bx-search-alt" width="24px"/>
                                    </a>
                                    <a href={`#/edit/${element.name}`}>
                                        <Icon icon="bx:bx-edit" width="24px"/>
                                    </a>
                                    <a href={`#/delete/${element.name}`}>
                                        <Icon icon="bx:bx-trash" width="24px"/>
                                    </a>
                                </div>
                            )}
                        >
                            <strong>{element.name}</strong>
                        </Tippy>
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
                <Icon icon={`dashicons:${element.icon}`} color="#0e3367" width="24px" />
            </td>
            <td className="backend">
                {isset(element, "meta") &&  element.meta.length > 0 && element.meta.map((m) =>
                    <span className="acpt-badge mr-1">
                        <span className="label">{m.name}</span>
                        <span className="value">{m.count}</span>
                    </span>
                )}
                <Link
                    to={`meta/${element.name}`}
                    className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                >
                    <Icon icon="bx:bxs-inbox" width="24px"/>
                    Manage
                </Link>
            </td>
            <td>
                {isset(element, "taxonomies") &&  element.taxonomies.length > 0 && element.taxonomies.map((taxonomy) =>
                    <span className="acpt-badge mr-1">
                        <span className="label">{taxonomy.slug}</span>
                    </span>
                )}
                &nbsp;
                <Link
                    to={`/assoc-taxonomy-post/${element.name}`}
                    className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                >
                    <Icon icon="bx:bx-purchase-tag" width="24px"/>
                    Manage
                </Link>
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
                    <Icon icon="fluent:premium-16-filled" width="24px" />
                    Buy a Premium Plan
                </a>
            </td>
            <td className="frontend">
                <a
                    className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                    href="https://acpt.io/"
                    target="_blank"
                >
                    <Icon icon="fluent:premium-16-filled" width="24px" />
                    Buy a Premium Plan
                </a>
            </td>
        </tr>
        </React.Fragment>
    );
};

export default CustomPostTypeListElement;