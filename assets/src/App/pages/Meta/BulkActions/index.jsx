import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {cloneBlock, cloneBox, cloneField} from "../../../utils/cloners";
import {
    addBlock,
    addBox,
    addField,
    deleteBlock,
    deleteBox,
    deleteField,
    deselectAllElements
} from "../../../redux/reducers/metaStateSlice";
import {useFormContext, useWatch} from "react-hook-form";
import {getFormId, hydrateElement} from "../../../utils/fields";
import PropTypes from "prop-types";
import CopyMetaBoxesModal from "../Modal/CopyMetaBoxesModal";
import CopyMetaFieldsModal from "../Modal/CopyMetaFieldsModal";

const BulkActions = ({view, setFieldTab, setBoxTab, setBlockTab}) => {

    // manage global state
    const dispatch = useDispatch();
    const {selectedElements, selectedElementsType} = useSelector(state => state.metaState);

    // manage form state
    const { control, setValue, getValues } = useFormContext();
    const watchedBoxes = useWatch({
        control,
        name: "boxes"
    });

    // manage local state
    const ref = useRef(null);
    const [action, setAction] = useState(null);
    const [copyBoxesModalVisible, setCopyBoxesModalVisible] = useState(false);
    const [copyFieldsModalVisible, setCopyFieldsModalVisible] = useState(false);
    const [copyBlocksModalVisible, setCopyBlocksModalVisible] = useState(false);

    const executeAction = () => {
        selectedElements.map((element) => {
            switch (action) {

                // copy
                case "copy":
                    if(selectedElementsType === 'box'){
                        setCopyBoxesModalVisible(!copyBoxesModalVisible);
                    } else if(selectedElementsType === 'block'){
                        setCopyBlocksModalVisible(!copyBlocksModalVisible);
                    } else {
                        setCopyFieldsModalVisible(!copyFieldsModalVisible);
                    }
                    break;

                // duplicate
                case "duplicate":
                    if(selectedElementsType === 'box'){
                        const boxIndex =  watchedBoxes.findIndex((b) => b.id === element.id);
                        const watchedBox = watchedBoxes[boxIndex];
                        const duplicatedBox = cloneBox(watchedBox);

                        watchedBoxes.push(duplicatedBox);
                        setValue("boxes", watchedBoxes);
                        dispatch(addBox(duplicatedBox));
                    } else if(selectedElementsType === 'block'){
                        const block = hydrateElement(watchedBoxes, element.boxId, element.id);
                        const duplicatedBlock = cloneBlock(element.boxId, element.parentFieldId, block);
                        const formId = getFormId(watchedBoxes, element.boxId, element.id, false);
                        const savedValues = getValues(formId);

                        savedValues.push(duplicatedBlock);
                        setValue(formId, savedValues);

                        dispatch(addBlock({
                            boxId: element.boxId,
                            parentFieldId: element.parentFieldId,
                            block: duplicatedBlock
                        }));

                    } else {
                        const field = hydrateElement(watchedBoxes, element.boxId, element.id);
                        const duplicatedField = cloneField(element.boxId, field);
                        const formId = getFormId(watchedBoxes, element.boxId, element.id, false);
                        const savedValues = getValues(formId);

                        savedValues.push(duplicatedField);
                        setValue(formId, savedValues);

                        dispatch(addField({
                            boxId: element.boxId,
                            field: duplicatedField,
                            parentFieldId: element.parentFieldId,
                            parentBlockId: element.parentBlockId
                        }));
                    }

                    break;

                // delete
                case "delete":
                    if(selectedElementsType === 'box'){
                        setValue("boxes", watchedBoxes.filter(b => b.id !== element.id));

                        if(setBoxTab){
                            setBoxTab(0);
                        }

                        dispatch(deleteBox(element.id));
                    } else if(selectedElementsType === 'block'){
                        const formId = getFormId(watchedBoxes, element.boxId, element.id, false);
                        const blocks = getValues(formId).filter(f => f.id !== element.id);

                        setValue(formId, blocks);

                        if(setBlockTab){
                            setBlockTab(0);
                        }

                        dispatch(deleteBlock({
                            boxId: element.boxId,
                            parentFieldId: element.parentFieldId,
                            blockId: element.id
                        }));

                    } else {
                        const formId = getFormId(watchedBoxes, element.boxId, element.id, false);
                        const fields = getValues(formId).filter(f => f.id !== element.id);

                        setValue(formId, fields);

                        if(setFieldTab){
                            setFieldTab(0);
                        }

                        dispatch(deleteField({
                            boxId: element.boxId,
                            fieldId: element.id,
                            parentFieldId: element.parentFieldId,
                            parentBlockId: element.parentBlockId
                        }));
                    }

                    break;
            }
        });

        if(action === 'delete' || action === 'duplicate'){
            dispatch(deselectAllElements());
        }

        ref.current.value = "";
    };

    return (
        <React.Fragment>
            <CopyMetaBoxesModal
                boxIds={selectedElements}
                modalOpen={copyBoxesModalVisible}
                setModalOpen={setCopyBoxesModalVisible}
            />
            <CopyMetaFieldsModal
                fieldIds={selectedElements}
                modalOpen={copyFieldsModalVisible}
                setModalOpen={setCopyFieldsModalVisible}
            />
            {selectedElements && selectedElements.length > 0 && (
                <div className={`flex-between ${view === 'tab' ? 'mb-24' : ''}`}>
                    <div>
                        {selectedElements.length} {useTranslation("Selected items")}
                    </div>
                    <div className="i-flex-center s-8">
                        <select
                            ref={ref}
                            className="form-control sm"
                            onChange={e => {
                                setAction(e.target.value !== "" ? e.target.value : null);
                            }}
                        >
                            <option value="">{useTranslation("Select")}</option>
                            <option value="copy">{useTranslation("Copy")}</option>
                            <option value="duplicate">{useTranslation("Duplicate")}</option>
                            <option value="delete">{useTranslation("Delete")}</option>
                        </select>
                        <Button
                            style={styleVariants.WHITE}
                            size="sm"
                            disabled={action === null}
                            onClick={(e)=>{
                                e.preventDefault();
                                executeAction();
                            }}
                        >
                            {useTranslation("Execute")}
                        </Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

BulkActions.propTypes = {
    view: PropTypes.oneOf([
        "tab",
        "accordion",
        "list"
    ]).isRequired,
    setBoxTab: PropTypes.func,
    setFieldTab: PropTypes.func,
    setBlockTab: PropTypes.func,
};

export default BulkActions;