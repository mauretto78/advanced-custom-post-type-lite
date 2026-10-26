import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import {wpAjaxRequest} from "../../../utils/ajax";
import {Icon} from "@iconify/react";
import {styleVariants} from "../../../constants/styles";
import Alert from "../../../components/Alert";
import {dangerColor} from "../../../utils/colors.jsx";

const ManageCacheModal = ({items}) => {

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);
    const [cacheItems, setCacheItems] = useState(items);
    const [search, setSearch] = useState('');

    const handleDeleteCacheItem = (key) => {
        wpAjaxRequest("deleteCacheItemAction", {key: key})
            .then(res => {
                if(res.success){
                    setCacheItems(it => it.filter(i => i.key !== key));
                }
            })
            .catch(err => console.error(err))
        ;
    };

    if(!cacheItems){
        return null;
    }

    return (
        <React.Fragment>
            <Modal
                size="large"
                title={useTranslation('Manage cache items')}
                visible={modalOpen}
                buttons={[]}
            >
                <input
                    type="text"
                    placeholder={useTranslation("Search an element saved in cache by its content.")}
                    className="form-control mb-24"
                    onChangeCapture={e => {
                        setSearch(e.target.value);
                    }}
                />
                {cacheItems?.filter(i => i.data.includes(search)).length > 0 ? (
                    <table className="no-border-spacing with-border b-rounded w-100">
                        <thead>
                            <tr>
                                <th className="p-8 b-bottom-1">
                                    {useTranslation('Key')}
                                </th>
                                <th className="p-8 b-bottom-1">
                                    {useTranslation('Data')}
                                </th>
                                <th className="p-8 b-bottom-1">
                                    {useTranslation('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cacheItems.filter(i => i.data.includes(search)).map((item, index)=>(
                                <tr key={index}>
                                    <td className={`vertical-top p-8 ${index !== cacheItems.length - 1 ? "b-bottom-1" : ""}`}>
                                        <code className="with-border b-rounded p-2 font-sm">
                                            {item.key}
                                        </code>
                                    </td>
                                    <td className={`vertical-top p-8 ${index !== cacheItems.length -1 ? "b-bottom-1" : ""}`}>
                                        <code style={{
                                            maxWidth: "300px"
                                        }} className="break-word font-sm">
                                            {item.data}
                                        </code>
                                    </td>
                                    <td className={`vertical-top p-8 ${index !== cacheItems.length - 1 ? "b-bottom-1" : ""}`}>
                                        <button
                                            type="button"
                                            className="btn-reset"
                                            aria-label={useTranslation("Delete")}
                                            onClick={e => {
                                                e.preventDefault();
                                                handleDeleteCacheItem(item.key);
                                            }}
                                        >
                                            <Icon icon="bx-trash" width={18} color={dangerColor()} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <Alert style={styleVariants.SECONDARY}>
                        {useTranslation("No records found.")}
                    </Alert>
                )}
            </Modal>
            <button
                type="button"
                className="btn-reset"
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Manage")}
            </button>
        </React.Fragment>
    );
};

ManageCacheModal.propTypes = {
    items: PropTypes.array.isRequired,
};

export default ManageCacheModal;