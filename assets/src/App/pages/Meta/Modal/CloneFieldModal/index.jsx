import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";
import {styleVariants} from "../../../../constants/styles";
import {Icon} from "@iconify/react";
import Alert from "../../../../components/Alert";
import {wpAjaxRequest} from "../../../../utils/ajax";
import {useFormContext, useWatch} from "react-hook-form";
import CloneFieldSelectedFields from "./CloneFieldSelectedFields";
import CloneFieldGroupTable from "./CloneFieldGroupTable";

const CloneFieldModal = ({id, field}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;
    const isRtl = globals.is_rtl;

    // manage form state
    const { control, getValues } = useFormContext();

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);
    const [meta, setMeta] = useState([]);
    const [loading, setLoading] = useState(false);

    const watchedDefaultValue = useWatch({
        control,
        name: id
    });

    /**
     *
     * @return {*[]|any}
     */
    const watchedDefaultValueObject = () => {

        if(watchedDefaultValue){

            if(typeof watchedDefaultValue === 'object'){
                return watchedDefaultValue;
            }

            try {
                return JSON.parse(watchedDefaultValue);
            } catch (e) {
                try {
                    return JSON.parse(`["${watchedDefaultValue}"]`);
                } catch (e) {
                    return [];
                }
            }
        }

        return [];
    };

    useEffect(() => {
        fetchMeta();
    }, []);

    /**
     * Fetching meta fields every time the modal is visible
     */
    useEffect(() => {
        if(modalOpen === true){
           fetchMeta();
        }
    }, [modalOpen]);

    const fetchMeta = () => {
        setLoading(true);
        wpAjaxRequest("fetchMetaAction", {page: 1, perPage: 999})
            .then(m => {

                let fetchedMeta = [];

                if(m.records && m.records.length > 0){
                    fetchedMeta = m.records;
                }

                // merge fetched meta with watched fields
                const watchedGroup = getValues();

                fetchedMeta && fetchedMeta.length > 0 && fetchedMeta.map((group, index) => {
                    if(watchedGroup.id === group.id){
                        fetchedMeta[index] = watchedGroup;
                    }
                });

                setMeta(fetchedMeta);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            })
        ;
    };

    const buttons = [
        <Button
            style={styleVariants.DANGER} onClick={(e) => {
            e.preventDefault();
            setModalOpen(!modalOpen);
        }}
        >
            {useTranslation("Close")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Select fields to clone')}
                visible={modalOpen}
                buttons={buttons}
            >
                <React.Fragment>
                    {loading ?
                        <div className="p-24 text-center">
                            Loading...
                        </div>
                        :
                        <React.Fragment>
                            {meta && meta.length > 0 ?
                                <div className="flex-column s-24">
                                    <div
                                        className="flex-column s-24"
                                        style={{
                                            maxHeight: "450px",
                                            overflowY: "auto",
                                            overflowX: "hidden",
                                            padding: "0 12px"
                                        }}
                                    >
                                        {meta.map((group, gindex) => (
                                            <CloneFieldGroupTable
                                                group={group}
                                                field={field}
                                                id={id}
                                                gindex={gindex}
                                                watchedDefaultValueObject={watchedDefaultValueObject()}
                                            />
                                        ))}
                                    </div>
                                </div>
                                :
                                <Alert style={styleVariants.SECONDARY}>
                                    {useTranslation("No fields registered.")}
                                </Alert>
                            }
                        </React.Fragment>
                    }
                </React.Fragment>
            </Modal>
            <fieldset className="acpt-fieldset">
                <legend>
                    {useTranslation("Fields to clone")}
                </legend>
                <div
                    style={{
                        alignItems: "center"
                    }}
                    className="flex-column s-24"
                >
                    {loading ?
                        <div>
                            Loading...
                        </div>
                        :
                        <React.Fragment>
                            {watchedDefaultValueObject() && typeof watchedDefaultValueObject() === 'object' && watchedDefaultValueObject().length > 0 && (
                                <CloneFieldSelectedFields
                                    fields={watchedDefaultValueObject()}
                                    meta={meta}
                                    id={id}
                                />
                            )}
                        </React.Fragment>
                    }
                    <a
                        style={{margin:"auto"}}
                        className="acpt-btn acpt-btn acpt-btn-secondary"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalOpen(!modalOpen);
                        }}
                    >
                        <div className="i-flex-center s-4">
                            <Icon icon="bx:bx-copy-alt" width={18} />
                            <span>
                                {useTranslation("Select fields to clone")}
                            </span>
                        </div>
                    </a>
                </div>
            </fieldset>
        </React.Fragment>
    );
};

CloneFieldModal.propTypes = {
    field: PropTypes.object.isRequired
};

export default CloneFieldModal;