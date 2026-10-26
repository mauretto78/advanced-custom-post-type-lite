import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {grayColor} from "../../../../utils/colors.jsx";
import useTranslation from "../../../../hooks/useTranslation.jsx";
import {unsetActiveElement} from "../../../../redux/reducers/metaStateSlice.jsx";
import DeleteMetaFieldModal from "../../Modal/DeleteMetaFieldModal.jsx";
import Accordion from "../../../../components/Accordion/index.jsx";
import Button from "../../../../components/Button/index.jsx";
import {styleVariants} from "../../../../constants/styles.jsx";
import BasicTab from "./Tabs/BasicTab/index.jsx";
import {lockedSettingsTabs} from "../../../../lite/LockedSettingsTabs.jsx";
import {metaFieldFormId} from "../../../../utils/fields.jsx";
import {useFormContext, useWatch} from "react-hook-form";
import MetaFieldSwitches from "./Commons/MetaFieldSwitches.jsx";
import MetaFieldSnippet from "../../../../components/MetaFieldSnippet/index.jsx";
import {resolveSnippetContexts} from "../../../../utils/snippetContexts.jsx";
import {maxWidthClassName} from "../../../../utils/ui.jsx";

const FieldSettingsPanel = () => {
    const dispatch   = useDispatch();
    const {activeElement, group} = useSelector(state => state.metaState);
    const {control}  = useFormContext();

    // BUG FIX: `useWatch` used to sit *after* the `if (!activeElement) return
    // null` / `if (!field) return null` early returns below. On first mount
    // (activeElement set, field found) that's 2 extra hook calls; the moment
    // activeElement or field flips to falsy on an already-mounted instance --
    // e.g. clicking the Deselect icon, or deleting the currently-selected
    // field (DeleteMetaFieldModal's onAfterDelete dispatches
    // unsetActiveElement) -- the component re-renders, hits the early return
    // first, and calls 2 fewer hooks than the previous render. React's Rules
    // of Hooks require the same hooks to run in the same order on every
    // render; violating that throws "Rendered fewer hooks than expected",
    // crashing the whole panel instead of just closing it. Fixed by computing
    // `boxId`/`fieldId`/`field`/`formId` unconditionally up front (safe even
    // when activeElement is null: formId() just resolves to a path that
    // matches nothing) so both `useWatch` calls always run, and moving the
    // early returns below them.
    const boxId   = activeElement?.boxId;
    const fieldId = activeElement?.id;
    const {boxIndex, fieldIndex, parentFieldId, parentFieldIndex, parentBlockId} = activeElement ?? {};

    const box = group.boxes?.find(b => b.id === boxId);

    // Recursive field search by ID
    const findField = (fields) => {
        for (const f of fields ?? []) {
            if (f.id === fieldId) return f;
            const inChildren = findField(f.children);
            if (inChildren) return inChildren;
            for (const block of f.blocks ?? []) {
                const inBlock = findField(block.fields);
                if (inBlock) return inBlock;
            }
        }
        return null;
    };

    const field = findField(box?.fields);

    const formId = (value) => metaFieldFormId(group.boxes, boxId, fieldId, value);

    const watchedLabel = useWatch({control, name: formId("label")});
    const watchedName  = useWatch({control, name: formId("name")});
    const watchedBoxName = useWatch({control, name: `boxes.${boxIndex}.name`});
    // Live location rules -- the store copy (group.belongs) goes stale while the
    // user edits the Location tab (those edits only reach react-hook-form).
    const watchedBelongs = useWatch({control, name: "belongs"});

    if (!activeElement) return null;
    if (!field) return null;

    const snippetContexts = resolveSnippetContexts(watchedBelongs ?? group.belongs ?? []);

    const flatFields = box?.fields ?? [];
    const parentFieldObj = parentFieldId ? flatFields.find(f => f.id === parentFieldId) : null;
    const parentField = parentFieldObj?.name;
    const parentBlockIndex = (parentBlockId && parentFieldObj)
        ? (parentFieldObj.blocks ?? []).findIndex(b => b.id === parentBlockId)
        : -1;
    const blockName = parentBlockIndex > -1 ? parentFieldObj.blocks[parentBlockIndex].name : undefined;
    const blockIndex = parentBlockIndex > -1 ? parentBlockIndex : undefined;

    const tabs = [{
        title: useTranslation("Basic options"),
        content: (
            <div className="canvas-settings with-scrollbar">
                <BasicTab
                    formId={formId}
                    boxIndex={boxIndex}
                    fieldIndex={fieldIndex}
                    boxId={boxId}
                    field={field}
                />
            </div>
        )
    }];

    return (
        <div className="h-100 b-right-1 flex-column">
            <div className="flex-between b-bottom-1 p-24">
                <div className="flex-column s-8">
                    <h3 className="i-flex-center s-8">
                        <span className={maxWidthClassName(watchedLabel || field.label)}>{watchedLabel || field.label}</span>
                        <span className={`${maxWidthClassName(watchedName || field.name)} color-medium-gray font-size-sm`}>{watchedName || field.name}</span>
                        <MetaFieldSwitches boxId={boxId} field={field} />
                    </h3>
                </div>
                <Icon
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-hidden={false}
                    aria-label={useTranslation("Deselect")}
                    onClick={e => { e.preventDefault(); dispatch(unsetActiveElement()); }}
                    onKeyDown={e => {
                        if(e.key === 'Enter' || e.key === ' '){
                            e.preventDefault();
                            dispatch(unsetActiveElement());
                        }
                    }}
                    icon="bx:x"
                    width={18}
                    color={grayColor()}
                />
            </div>
            <div className="text-monospace px-24 py-12 b-bottom-1">
                <MetaFieldSnippet
                    box={watchedBoxName || box?.name}
                    field={watchedName || field.name}
                    contexts={snippetContexts}
                    parentField={parentField}
                    blockName={blockName}
                    blockIndex={blockIndex}
                />
            </div>
            <div className="with-scrollbar" style={{flex: 1, overflowY: "auto", marginBottom: "95px"}}>
                <Accordion items={[...tabs, ...lockedSettingsTabs()]} defaultTab={0} />
            </div>
            <div className="delete-element">
                <DeleteMetaFieldModal
                    boxId={boxId}
                    fieldId={fieldId}
                    fieldIndex={fieldIndex}
                    parentFieldId={parentFieldId}
                    parentBlockId={parentBlockId}
                    onAfterDelete={() => dispatch(unsetActiveElement())}
                    trigger={
                        <Button size="sm" icon="bx:trash" className="w-100" style={styleVariants.OUTLINED_DANGER}>
                            {useTranslation("Delete field")}
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default FieldSettingsPanel;
