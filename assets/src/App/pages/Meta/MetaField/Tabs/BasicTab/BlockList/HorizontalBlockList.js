import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Alert from "../../../../../../components/Alert";
import {styleVariants} from "../../../../../../constants/styles";
import useTranslation from "../../../../../../hooks/useTranslation";
import {useDispatch, useSelector} from "react-redux";
import {v4 as uuidv4} from "uuid";
import {addBlock, setBlocks} from "../../../../../../redux/reducers/metaStateSlice";
import SortableList from "../../../../../../components/SortableList";
import MetaBlock from "../../../../MetaBlock";
import Button from "../../../../../../components/Button";
import HorizontalSortableMetaBlockTab from "./HorizontalSortableMetaBlockTab";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../../../../utils/fields";
import {arrayMove} from "@dnd-kit/sortable";

const HorizontalBlockList = ({boxIndex, boxId, blocks, parentFieldIndex, parentFieldId, addBlockEnabled = true}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: `${getFormId(group.boxes, boxId, parentFieldId)}.blocks`,
    });

    // manage local state
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if(!blocks[activeTab]){
            setActiveTab(0);
        }
    },[blocks]);

    const handleOnClick = (index) => {
        setActiveTab(index);
    };

    const onDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);
        const sortedBlocks = arrayMove(blocks, oldIndex, newIndex);
        move(oldIndex, newIndex);

        setActiveTab(newIndex);
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
                    <div className="flex-wrap i-flex-center s-8 mb-12">
                        <SortableList
                            items={blocks}
                            onDragEnd={onDragEnd}
                            mode="horizontal"
                        >
                            {blocks && blocks.map((block, blockIndex) => (
                                <HorizontalSortableMetaBlockTab
                                    isActive={activeTab === blockIndex}
                                    onClick={handleOnClick}
                                    boxIndex={boxIndex}
                                    boxId={boxId}
                                    blockIndex={blockIndex}
                                    block={block}
                                    parentFieldIndex={parentFieldIndex}
                                    parentFieldId={parentFieldId}
                                    key={block.id}
                                />
                            ))}
                        </SortableList>
                        <Button
                            type="button"
                            style={styleVariants.SECONDARY}
                            size="sm"
                            onClick={e => {
                                e.preventDefault();
                                handleAddBlock();
                            }}
                        >
                            +
                        </Button>
                    </div>
                    <div>
                        {blocks && blocks.map((block, blockIndex) => (
                            <React.Fragment>
                                {blockIndex === activeTab && (
                                    <div className="b-rounded with-border p-24">
                                        <MetaBlock
                                            setActiveTab={setActiveTab}
                                            blockIndex={blockIndex}
                                            block={block}
                                            view="tabular"
                                            boxIndex={boxIndex}
                                            boxId={boxId}
                                            parentFieldIndex={parentFieldIndex}
                                            parentFieldId={parentFieldId}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No blocks already created. Create the first one now by clicking the button "Add block"!')}
                    </Alert>
                    {addBlockEnabled && (
                        <a
                            className="acpt-btn acpt-btn-secondary acpt-btn-sm mt-24"
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleAddBlock();
                            }}
                        >
                            {useTranslation("Add block")}
                        </a>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

HorizontalBlockList.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    blocks: PropTypes.array.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    addBlockEnabled: PropTypes.bool
};

export default HorizontalBlockList;