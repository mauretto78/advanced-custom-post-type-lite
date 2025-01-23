import React from "react";
import PropTypes from 'prop-types';
import {styleVariants} from "../../../../../../constants/styles";
import useTranslation from "../../../../../../hooks/useTranslation";
import {v4 as uuidv4} from "uuid";
import {addBlock, setBlocks} from "../../../../../../redux/reducers/metaStateSlice";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../../../../utils/fields";
import {arrayMove} from "@dnd-kit/sortable";
import SortableList from "../../../../../../components/SortableList";
import MetaBlock from "../../../../MetaBlock";
import Button from "../../../../../../components/Button";

const VerticalBlockList = ({boxIndex, boxId, blocks, parentFieldIndex, parentFieldId, addBlockEnabled = true}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: `${getFormId(group.boxes, boxId, parentFieldId)}.blocks`,
    });

    const onDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);
        const sortedBlocks = arrayMove(blocks, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setBlocks({boxId, parentFieldId, sortedBlocks}));
    };

    const handleAddBlock = () => {

        const block = {
            id: uuidv4(),
            boxId: boxId,
            fieldId: parentFieldId,
            label: 'new-block',
            name: 'new_block',
            fields: [],
            isSaved: false,
        };

        dispatch(addBlock({boxId, parentFieldId, block}));
    };

    return (
        <React.Fragment>
            {blocks && blocks.length > 0 ? (
                <React.Fragment>
                    <div className="s-24 flex-column">
                        <SortableList
                            onDragEnd={onDragEnd}
                            items={blocks}
                        >
                            {blocks && blocks.map((block, blockIndex) => (
                                <MetaBlock
                                    parentFieldId={parentFieldId}
                                    boxIndex={boxIndex}
                                    parentFieldIndex={parentFieldIndex}
                                    blockIndex={blockIndex}
                                    boxId={boxId}
                                    block={block}
                                />
                            ))}
                        </SortableList>
                    </div>
                    {addBlockEnabled && (
                        <div className="mt-24">
                            <Button
                                type="button"
                                style={styleVariants.SECONDARY}
                                onClick={e => {
                                    e.preventDefault();
                                    handleAddBlock();
                                }}
                            >
                                {useTranslation("Add block")}
                            </Button>
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <div className={`mt-24 b-maxi b-rounded p-24 flex-column s-12 text-center`}>
                    <span>
                        {useTranslation('No blocks already created. Create the first one now by clicking the button "Add block"!')}
                    </span>
                    {addBlockEnabled && (
                        <div>
                            <Button
                                type="button"
                                style={styleVariants.SECONDARY}
                                onClick={e => {
                                    e.preventDefault();
                                    handleAddBlock();
                                }}
                            >
                                {useTranslation("Add block")}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

VerticalBlockList.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    blocks: PropTypes.array.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    addBlockEnabled: PropTypes.bool
};

export default VerticalBlockList;