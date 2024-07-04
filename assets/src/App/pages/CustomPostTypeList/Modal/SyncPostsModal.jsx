import React, {useEffect, useState} from "react";
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {refreshPage} from "../../../utils/misc";
import {toast} from "react-hot-toast";
import Alert from "../../../components/Alert";

const SyncPostsModal = () => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);
    const [postTypes, setPostTypes] = useState([]);
    const [fetchingPostTypes, setFetchingPostTypes] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if(modalOpen === true){
            setFetchingPostTypes(true);
            wpAjaxRequest("fetchPostTypesAction", {})
                .then(res => {
                    setPostTypes(res);
                    setFetchingPostTypes(false);
                })
                .catch(err => {
                    console.error(err.message);
                    setFetchingPostTypes(false);
                })
            ;
        }
    }, [modalOpen]);

    const handleSyncPostTypes = () => {
        wpAjaxRequest("syncPostsAction", {postTypes: selected})
            .then(res => {

                if(res.success){
                    toast.success(useTranslation("Successfully post sync. The browser will refresh after 5 seconds."));
                    refreshPage(5000);
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

    const handlePostTypeClick = (postType, checked) => {
        if(checked === true){
            setSelected(selected => [...selected, postType]);
        } else {
            setSelected(p => p.filter(item => item !== postType));
        }
    };

    const buttons = [
        <Button
            style={styleVariants.PRIMARY}
            disabled={selected.length === 0}
            onClick={() => {
                handleSyncPostTypes();
            }}
        >
            {useTranslation("Sync")}
        </Button>,
        <Button
            style={styleVariants.SECONDARY}
            onClick={() => {
                setModalOpen(!modalOpen);
            }}
        >
            {useTranslation("Return back to list")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal title={useTranslation('Sync with post types')} buttons={buttons} visible={modalOpen}>
                {fetchingPostTypes
                    ?
                        <div>Loading...</div>
                    :
                        <React.Fragment>
                            {postTypes && postTypes.length > 0 ?
                                <div className="responsive">
                                    <table className={`acpt-table spaceless ${globals.is_rtl ? 'rtl' : ''}`}>
                                        <tbody>
                                        {postTypes.map((postType) => (
                                            <tr>
                                                <td>
                                                    <label className="checkbox" htmlFor={`select_${postType.name}`}>
                                                        <input
                                                            name={`select_${postType.name}`}
                                                            defaultChecked={false}
                                                            type="checkbox"
                                                            id={`select_${postType.name}`}
                                                            onChange={(e) => handlePostTypeClick(postType.name, e.target.checked)}
                                                        />
                                                        <span>{postType.label}</span>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <Alert style={styleVariants.SECONDARY}>
                                    {useTranslation("No custom post type found.")}
                                </Alert>
                            }
                        </React.Fragment>
                }
            </Modal>
            <Button
                type="button"
                style={styleVariants.SECONDARY}
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Sync with post types")}
            </Button>
        </React.Fragment>
    );
};

export default SyncPostsModal;