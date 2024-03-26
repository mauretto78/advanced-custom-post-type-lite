import React, {useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {deselectAllElements} from "../../../redux/reducers/metaStateSlice";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";

const CopyMetaBoxesModal = ({boxIds, modalOpen, setModalOpen}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [group, setGroup] = useState(null);
    const [deleteBoxes, setDeleteBoxes] = useState(false);

    const handleSubmit = () => {

        let boxIdsArray = [];
        boxIds.map((b)=> { boxIdsArray.push(b.id); });

        wpAjaxRequest('copyMetaBoxesAction', {
            boxIds: boxIdsArray,
            targetGroupId: group,
            delete: deleteBoxes
        })
            .then(res => {
                if(res.success){
                    toast.success(`${useTranslation("Meta box was successfully copied")}.${useTranslation("The browser will refresh after 5 seconds.")}`);
                    setModalOpen(!modalOpen);
                    dispatch(deselectAllElements());
                    refreshPage(5000);
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => console.err(err))
        ;
    };

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Copy selected meta boxes')}
                visible={modalOpen}
                buttons={[]}
            >
                <div className="flex-column s-24">
                    <div>
                        <label
                            className="form-label i-flex-center s-4"
                            htmlFor="group"
                        >
                            {useTranslation("Meta group")}
                        </label>
                        <div className="acpt-select">
                            <select
                                id="group"
                                className="form-control default"
                                onChangeCapture={e => setGroup(e.target.value) }
                            >
                                {globals.find.meta.map((g) => (
                                    <option value={g.value}>
                                        {g.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {group && group !== 'Select' && (
                        <div>
                            <div className="w-100 i-flex-center s-4 mb-8">
                                <input type="checkbox" defaultValue={deleteBoxes} onClick={() => setDeleteBoxes(!deleteBoxes)} id="deleteBoxes" />
                                <label htmlFor="deleteBoxes">
                                    {useTranslation("Delete after copying")}
                                </label>
                            </div>
                            <Button
                                onClick={() => handleSubmit() }
                                style={styleVariants.PRIMARY}
                            >
                                {useTranslation("Copy")}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </React.Fragment>
    );
};

CopyMetaBoxesModal.propTypes = {
    boxIds: PropTypes.array.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    setModalOpen: PropTypes.func.isRequired,
};

export default CopyMetaBoxesModal;