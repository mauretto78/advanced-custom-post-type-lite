import React, {useEffect, useState} from "react";
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {refreshPage, isRTLOrientation} from "../../../utils/misc";
import {toast} from "react-hot-toast";
import Alert from "../../../components/Alert";
import {setCookieMessage} from "../../../utils/cookies";

const SyncTaxonomiesModal = () => {

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);
    const [taxonomies, setTaxonomies] = useState([]);
    const [fetchingTaxonomies, setFetchingTaxonomies] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if(modalOpen === true){
            setFetchingTaxonomies(true);
            wpAjaxRequest("fetchRegisteredTaxonomiesAction", {})
                .then(res => {
                    setTaxonomies(res);
                    setFetchingTaxonomies(false);
                })
                .catch(err => {
                    console.error(err.message);
                    setFetchingTaxonomies(false);
                })
            ;
        }
    }, [modalOpen]);

    const handleSyncTaxonomies = () => {
        wpAjaxRequest("syncTaxonomiesAction", {taxonomies: selected})
            .then(res => {

                if(res.success){
                    setCookieMessage("Successfully taxonomy sync.");
                    refreshPage();
                }

                if(res.error){
                    toast.error(error);
                }

                setModalOpen(!modalOpen);

            })
            .catch(err => {
                console.error(err.message);
            })
        ;
    };

    const handleTaxonomyClick = (taxonomy, checked) => {
        if(checked === true){
            setSelected(selected => [...selected, taxonomy]);
        } else {
            setSelected(p => p.filter(item => item !== taxonomy));
        }
    };

    const buttons = [
        <Button
            style={styleVariants.PRIMARY}
            size="sm"
            icon="bx:refresh"
            disabled={selected.length === 0}
            onClick={() => {
                handleSyncTaxonomies();
            }}
        >
            {useTranslation("Sync")}
        </Button>,
        <Button
            style={styleVariants.OUTLINED_SECONDARY}
            size="sm"
            icon="bx:arrow-back"
            onClick={() => {
                setModalOpen(!modalOpen);
            }}
        >
            {useTranslation("Return back to list")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal title={useTranslation('Sync with taxonomies')} buttons={buttons} visible={modalOpen}>
                {fetchingTaxonomies
                    ?
                        <div>Loading...</div>
                    :
                        <React.Fragment>
                            {taxonomies && taxonomies.length > 0 ?
                                <div className="responsive">
                                    <table className={`acpt-table spaceless ${isRTLOrientation()}`}>
                                        <tbody>
                                        {taxonomies.map((taxonomy) => (
                                            <tr>
                                                <td>
                                                    <label className="checkbox" htmlFor={`select_${taxonomy.name}`}>
                                                        <input
                                                            name={`select_${taxonomy.name}`}
                                                            defaultChecked={false}
                                                            type="checkbox"
                                                            id={`select_${taxonomy.name}`}
                                                            onChange={(e) => handleTaxonomyClick(taxonomy.name, e.target.checked)}
                                                        />
                                                        <span>{taxonomy.label}</span>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <Alert style={styleVariants.SECONDARY}>
                                    {useTranslation("No taxonomy found.")}
                                </Alert>
                            }
                        </React.Fragment>
                }
            </Modal>
            <Button
                type="button"
                style={styleVariants.OUTLINED_PRIMARY}
                size="sm"
                icon="bx:refresh"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Sync with taxonomies")}
            </Button>
        </React.Fragment>
    );
};

export default SyncTaxonomiesModal;