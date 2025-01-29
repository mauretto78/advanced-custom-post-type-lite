import React, {useReducer, useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import {hiddenElements, restoreHiddenElement} from "../../../utils/localStorage";
import {metaTypes} from "../../../constants/metaTypes";

const RestoreElementsModal = ({belongsTo}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;
    const isRtl = globals.is_rtl;
    const globalFind = globals.find;

    const hiddenElms = hiddenElements(belongsTo);

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    /**
     * Get element label
     *
     * @param elm
     * @return {*}
     */
    const getElement = (elm) => {

        if(!globalFind[belongsTo]){
            return;
        }

        switch (belongsTo) {
            case "dataset":
            case "form":
            case "woo_product_data":
            case metaTypes.META:
                const find = globalFind[belongsTo].filter(el => el.value === elm);

                if(find.length !== 1){
                    return;
                }

                return find[0].label;

            case metaTypes.OPTION_PAGE:
                const page = globalFind[belongsTo].filter(el => el.id === elm);

                if(page.length !== 1){
                    return;
                }

                return page[0].label;

            default:
                return elm;
        }
    };

    if(hiddenElms.length === 0){
        return null;
    }

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Restore elements')}
                visible={modalOpen}
                buttons={[]}
            >
                <table className={`acpt-table with-border ${isRtl ? 'rtl' : ''}`}>
                    <thead>
                        <tr>
                            <th>
                                {useTranslation('Name')}
                            </th>
                            <th>
                                {useTranslation('Action')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {hiddenElms.map((elm) => (
                            <tr>
                                <td>
                                    {getElement(elm)}
                                </td>
                                <td>
                                    <a
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            restoreHiddenElement(elm, belongsTo);
                                            forceUpdate();

                                            const event = new Event('restoredElement');
                                            document.dispatchEvent(event);
                                        }}
                                    >
                                        {useTranslation("Restore")}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
            <div className="flex s-8 mb-24">
                <span>
                    {hiddenElms.length} {useTranslation("hidden elements")}
                </span>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        setModalOpen(!modalOpen);
                    }}
                >
                    {useTranslation("Restore elements")}
                </a>
            </div>
        </React.Fragment>
    );
};

RestoreElementsModal.propTypes = {
    belongsTo: PropTypes.string.isRequired,
};

export default RestoreElementsModal;