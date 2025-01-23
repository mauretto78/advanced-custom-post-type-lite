import React from "react";
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../../../hooks/useTranslation";
import {useDispatch, useSelector} from "react-redux";
import Tooltip from "../../../../components/Tooltip";
import {saveIsClosed} from "../../../../utils/localStorage";
import DeleteMetaBlockModal from "../../Modal/DeleteMetaBlockModal";
import {cloneBlock} from "../../../../utils/cloners";
import {addBlock, addField, hideElement, showElement} from "../../../../redux/reducers/metaStateSlice";
import {delay} from "../../../../utils/misc";
import {scrollToId} from "../../../../utils/scroll";
import {getFormId} from "../../../../utils/fields";
import CopyMetaBlockModal from "../../Modal/CopyMetaBlockModal";
import {v4 as uuidv4} from "uuid";
import {fieldTypes} from "../../../../constants/fields";

const MetaBlockActions = ({boxId, block, blockIndex, parentFieldId}) => {

    // manage global state
    const {group, closedElements} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, control } = useFormContext();

    const watchedBlock = useWatch({
        control,
        name: getFormId(group.boxes, boxId, block.id),
    });

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === block.id);

        return filter.length === 1;
    };

    // manage global state
    const dispatch = useDispatch();

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(block.id);

        if((isClosed())){
            dispatch(showElement({id: block.id}));
        } else {
            dispatch(hideElement({id: block.id}));
        }
    };

    const handleAddChildField = () => {

        const field = {
            id: uuidv4(),
            boxId: boxId,
            name: 'meta_box_field',
            label: 'meta box field',
            type: fieldTypes.TEXT,
            defaultValue: "",
            description: "",
            isRequired: false,
            showInArchive: false,
            quickEdit: false,
            filterableInAdmin: false,
            sort: 1,
            advancedOptions: [],
            options: [],
            blocks: [],
            blockId: block.id,
            validationRules: [],
            visibilityConditions: [],
            hasManyRelation: [],
            children: [],
            parentId: null,
            isATextualField: true,
            isFilterable: true,
            isSaved: false
        };

        dispatch(addField({boxId, parentFieldId: null, parentBlockId: block.id, field}));
        dispatch(showElement({id: block.id}));
    }

    /**
     *
     * @return {boolean}
     */
    const canCopyTheBlock = () => {

        if(typeof block.isSaved !== 'undefined' && block.isSaved === false){
            return false
        }

        return true;
    };

    return (
        <span className="i-flex-center s-8">
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            const duplicatedBlock = cloneBlock(boxId, parentFieldId, watchedBlock);
                            dispatch(addBlock({boxId, parentFieldId, block: duplicatedBlock}));

                            delay(1).then(()=>{
                                scrollToId(duplicatedBlock.id);
                            });
                        }}
                    >
                        <Icon icon="bx:duplicate" width={18} />
                    </a>
                }
                tip={useTranslation("Duplicate this block")}
                icon={false}
            />
            {canCopyTheBlock() && (
                <Tooltip
                    label={
                        <CopyMetaBlockModal block={block} />
                    }
                    tip={useTranslation("Copy this meta block")}
                    icon={false}
                />
            )}
            <Tooltip
                label={
                    <DeleteMetaBlockModal
                        boxId={boxId}
                        blockId={block.id}
                        blockIndex={blockIndex}
                        parentFieldId={parentFieldId}
                    />
                }
                tip={useTranslation("Delete this block")}
                icon={false}
            />
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleAddChildField();
                        }}
                    >
                        <Icon icon="bx:plus-circle" width={18} />
                    </a>
                }
                tip={useTranslation("Add field")}
                icon={false}
            />
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleToggleClose();
                        }}
                    >
                        <Icon icon="bx:expand-alt" width={18} />
                    </a>
                }
                tip={useTranslation("Hide/show this block")}
                icon={false}
            />
        </span>
    );
};

MetaBlockActions.propTypes = {
    blockIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string,
    block: PropTypes.object.isRequired
};

export default MetaBlockActions;