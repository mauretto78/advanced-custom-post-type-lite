import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {useDispatch} from "react-redux";
import {addOption} from "../../../redux/reducers/productDataFieldsStateSlice";
import {v4 as uuidv4} from "uuid";
import {toast} from "react-hot-toast";

const LoadDatasetModal = ({fieldId, fieldIndex}) => {

    // manage global state
    const dispatch = useDispatch();

    // mange local state
    const [loading, isLoading] = useState(false);
    const [data, setData] = useState(null);
    const [dataset, setDataset] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if(modalOpen){
            isLoading(true);

            wpAjaxRequest("fetchDatasetsAction", {})
                .then(res => {

                    let options = [{
                        value: null,
                        label: useTranslation("Select"),
                        items: []
                    }];
                    res.records && res.records.map((d) => {
                        options.push({
                            value: d.id,
                            label: d.label ? d.label : d.name,
                            items: d.items ? d.items : [],
                        });
                    });

                    setData(options);
                    isLoading(false);
                })
                .catch(err => {
                    console.error(err.message);
                    isLoading(false);
                })
            ;
        }
    }, [modalOpen]);

    const handleLoadDataset = () => {
        const selectedDataset = data.filter(d => d.value === dataset);

        if(selectedDataset.length !== 1){
            return;
        }

        const items = selectedDataset[0].items;

        items.map((item)=>{
            const option = {
                id: uuidv4(),
                fieldId: fieldId,
                label: item.label,
                value: item.value
            };

            dispatch(addOption({fieldIndex, option}));
        });

        toast.success(useTranslation("Dataset loaded correctly"));
        setModalOpen(!modalOpen);
    };

    const buttons = [
        <Button
            style={styleVariants.PRIMARY}
            disabled={dataset === null}
            onClick={(e) => {
                e.preventDefault();
                handleLoadDataset();
            }}
        >
            {useTranslation("Load dataset")}
        </Button>,
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
                title={useTranslation('Load dataset')}
                visible={modalOpen}
                padding={0}
                buttons={buttons}
            >
                {loading ? (
                    <div className="p-24">
                        {useTranslation("Loading...")}
                    </div>
                ) : (
                    <div className="p-24">
                        <select
                            id="dataset"
                            className="form-control default"
                            onChangeCapture={e => setDataset(e.target.value) }
                        >
                            {data && data.map((d) => (
                                <option value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Load dataset")}
            </a>
        </React.Fragment>
    );
};

LoadDatasetModal.propTypes = {
    fieldId: PropTypes.string.isRequired,
    fieldIndex: PropTypes.number.isRequired,
};

export default LoadDatasetModal;