import React from "react";
import PropTypes from 'prop-types';
import Alert from "../../../../../../components/Alert";
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
import {useAutoAnimate} from "@formkit/auto-animate/react";

const VerticalBlockList = ({boxIndex, boxId, blocks, parentFieldIndex, parentFieldId, addBlockEnabled = true, view}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // auto-animate
    const [parent] = useAutoAnimate();

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
            <div
                className={blocks && blocks.length > 0 && view === 'list' ? "bg-pale-gray b-rounded p-24 flex-column s-24" : ""}
                ref={parent}
            >
                {blocks && blocks.length > 0 ? (
                    <SortableList
                        onDragEnd={onDragEnd}
                        items={blocks}
                    >
                        {blocks.map((block, blockIndex) => (
                            <MetaBlock
                                parentFieldId={parentFieldId}
                                boxIndex={boxIndex}
                                parentFieldIndex={parentFieldIndex}
                                blockIndex={blockIndex}
                                view={view}
                                boxId={boxId}
                                block={block}
                            />
                        ))}
                    </SortableList>
                ) : (
                    <div style={view === 'accordion' ? {
                        padding: "24px 24px 0"
                    } : {}}>
                        <Alert style={styleVariants.WARNING}>
                            {useTranslation('No blocks already created. Create the first one now by clicking the button "Add block"!')}
                        </Alert>
                    </div>
                )}
            </div>
            {addBlockEnabled && (
                <div className={view === 'accordion' ? 'p-24' : ''}>
                    <a
                        className={`acpt-btn acpt-btn-secondary acpt-btn-sm ${view !== 'accordion' ? 'mt-24' : ''}`}
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleAddBlock();
                        }}
                    >
                        {useTranslation("Add block")}
                    </a>
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