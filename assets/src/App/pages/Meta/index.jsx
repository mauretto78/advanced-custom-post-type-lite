import React, {useEffect, useRef, useState} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import {FormProvider, useForm} from "react-hook-form";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchMeta} from "../../redux/reducers/fetchMetaSlice";
import Loader from "../../components/Loader";
import {v4 as uuidv4} from "uuid";
import {isEmpty} from "../../utils/objects";
import PageNotFound from "../404";
import {
    addBox,
    addField,
    hydrateState,
    moveField,
    setBoxes,
    setFields,
    unsetActiveBox,
    unsetActiveElement,
    updateField
} from "../../redux/reducers/metaStateSlice";
import DeleteAllMetaBoxesModal from "./Modal/DeleteAllMetaBoxesModal";
import {scrollToTop} from "../../utils/scroll";
import {saveMeta} from "../../redux/reducers/saveMetaSlice";
import toast from "react-hot-toast";
import {useConfirmTabClose} from "../../hooks/useConfirmTabClose";
import {useOutsideClick} from "../../hooks/useOutsideClick";
import MetaGroupTitle from "./MetaGroup/MetaGroupTitle";
import {flushCookieMessages} from "../../utils/cookies.jsx";
import {getErrorMessage} from "../../utils/errors.jsx";
import {pointerWithin, rectIntersection} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import useDndSensors from "../../hooks/useDndSensors.jsx";
import {createDndAnnouncements} from "../../utils/dndAnnouncements.jsx";

// pointerWithin gives better UX for overlapping mouse/touch drops, but a
// keyboard-driven drag has no real pointer position — dnd-kit falls back to
// (0,0) for its "pointer" coordinates, so pointerWithin alone never finds a
// collision during keyboard dragging (KeyboardSensor moves the active rect,
// not a virtual pointer). Fall back to rectIntersection, which is rect-based
// and therefore works for both input types, whenever pointerWithin is empty.
const collisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};
import {fieldTypes} from "../../constants/fields.jsx";
import {nestFields, isFieldOrDescendant, hydrateFormBoxes} from "../../utils/flattenFields.jsx";
import {createBox, createField} from "../../utils/fields.jsx";
import CanvasLayout from "../../components/CanvasLayout/index.jsx";
import Sidebar from "./Sidebar/index.jsx";
import Canvas from "./Canvas/index.jsx";
import DragOverlayWrapper from "./DragOverlayWrapper.jsx";
import MetaGroupSettings from "./MetaGroup/MetaGroupSettings.jsx";

const Meta = () => {

    const ref        = useRef(null);
    const toolbarRef = useRef(null);
    const location   = useLocation();

    // manage global state
    const dispatch = useDispatch();
    const {error: saveError, loading: saveLoading} = useSelector(state => state.saveMeta);
    const {loading} = useSelector(state => state.fetchMeta);
    const {group}   = useSelector(state => state.metaState);

    // manage local state
    const newGroupId = uuidv4();
    const {id}       = useParams();
    const [searchParams] = useSearchParams();
    const groupId        = id ? id : newGroupId;
    const [isSubmitting, setIsSubmitted]       = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [fetchError, setFetchError]          = useState(false);

    // manage redirect
    useNavigate();

    // sensors — default (non-sortable) KeyboardSensor coordinateGetter: this
    // one DndContext serves both the SortableContext box-reorder branch and
    // the plain useDroppable field-half-zone branch, and only the default
    // getter works reliably for both (see CLAUDE.md Phase 2 notes).
    const sensors = useDndSensors({activationConstraint: {distance: 4}});

    // live-region announcements — real box/field labels instead of dnd-kit's
    // generic "Draggable item <id>..." default text
    const getDragItemLabel = (activeOrOver) => {
        const data = activeOrOver?.data?.current;
        if (!data) return useTranslation("Item");
        if (data.box)    return `${useTranslation("Meta box")} "${data.box.label || data.box.name}"`;
        if (data.field)  return `${useTranslation("Field")} "${data.field.label || data.field.name}"`;
        if (data.column) return `${useTranslation("New field")} "${data.column.label}"`;
        return useTranslation("Item");
    };
    const announcements = createDndAnnouncements(getDragItemLabel);

    // form init
    const methods = useForm({mode: 'onChange'});

    useEffect(() => {
        metaTitle(`${useTranslation("Manage meta fields")}${hasUnsavedChanges ? '*' : ''}`);
    }, [hasUnsavedChanges]);

    useConfirmTabClose(hasUnsavedChanges);

    useOutsideClick([ref, toolbarRef], () => {
        dispatch(unsetActiveElement());
        dispatch(unsetActiveBox());
    });

    // ── Sync Redux state → React Hook Form ──────────────────────────────────
    // Whenever boxes change in the Redux store (drag, sort, delete, add),
    // merge the structural changes (order, additions, deletions) from Redux
    // with the current RHF values so user edits are preserved.
    const isHydrated = useRef(false);
    const prevBoxesJson = useRef(null);

    useEffect(() => {
        if (!group.boxes) return;

        const json = JSON.stringify(group.boxes);

        // Skip the very first hydration (data loading sets boxes initially)
        if (!isHydrated.current) {
            isHydrated.current = true;
            prevBoxesJson.current = json;
            return;
        }

        // Only sync when boxes actually changed (deep comparison)
        if (json !== prevBoxesJson.current) {
            prevBoxesJson.current = json;

            // Get current RHF values to preserve unsaved user edits
            const currentBoxes = methods.getValues('boxes') ?? [];

            // Merge: Redux provides structure/order, RHF provides edited values
            const merged = group.boxes.map(reduxBox => {
                const rhfBox = currentBoxes.find(b => b?.id === reduxBox.id);
                if (!rhfBox) return reduxBox; // new box — use Redux values

                // Preserve RHF-edited box properties, apply Redux field order
                const mergedFields = (reduxBox.fields ?? []).map(reduxField => {
                    const rhfField = (rhfBox.fields ?? []).find(f => f?.id === reduxField.id);
                    if (!rhfField) return reduxField; // new field — use Redux values

                // Keep RHF edits but ALWAYS use structural props from Redux
                    // Merge blocks: Redux is the source of truth for block data
                    // (block values are read from form BEFORE reorder dispatch)
                    const reduxBlocks = reduxField.blocks ?? [];
                    const mergedBlocks = reduxBlocks.map((reduxBlock, bi) => ({
                        ...reduxBlock,
                        sort: reduxBlock.sort ?? bi,
                    }));

                    return {
                        ...rhfField,
                        parentId: reduxField.parentId,
                        blockId: reduxField.blockId,
                        blocks: mergedBlocks,
                        visibilityConditions: reduxField.visibilityConditions ?? [],
                        validationRules: reduxField.validationRules ?? [],
                        permissions: reduxField.permissions ?? [],
                    };
                });

                return {...rhfBox, fields: mergedFields};
            });

            methods.setValue('boxes', merged, {shouldDirty: true});
            setHasUnsavedChanges(true);
        }
    }, [group.boxes, group]);

    // ── Data loading ──────────────────────────────────────────────────────────

    useEffect(() => {
        metaTitle(useTranslation("Manage meta fields"));
        changeCurrentAdminMenuLink('#/meta');

        if (id) {
            dispatch(fetchMeta({id}))
                .then(res => {
                    // createAsyncThunk dispatches never reject their returned promise, even
                    // when the thunk's own try/catch calls rejectWithValue() -- they always
                    // resolve, with res.error set only on the rejected-action path (res.payload
                    // is then the error message string, not the group object). A bare
                    // .then().catch() here left the error branch unreachable, so a failed
                    // fetch silently rendered an empty edit form instead of the 404 page --
                    // see BlockManager/index.jsx and SaveOptionPages/index.jsx for the same fix.
                    if (res.error) {
                        console.error(res.error);
                        setFetchError(true);
                        return;
                    }

                    methods.reset();
                    dispatch(hydrateState(res.payload));
                    methods.setValue('id', id);
                    methods.setValue('name', res.payload.name);
                    methods.setValue('label', res.payload.label);
                    methods.setValue('display', res.payload.display);
                    methods.setValue('context', res.payload.context);
                    methods.setValue('priority', res.payload.priority);
                    res.payload.belongs?.map((belong, index) => {
                        methods.setValue(`belongs.${index}.id`, belong.id);
                        methods.setValue(`belongs.${index}.belongsTo`, belong.belongsTo);
                        methods.setValue(`belongs.${index}.operator`, belong.operator);
                        methods.setValue(`belongs.${index}.find`, belong.find);
                        methods.setValue(`belongs.${index}.logic`, belong.logic);
                    });
                    // hydrateFormBoxes() flattens each box's fields (nested
                    // API shape -> parentId/blockId-linked flat shape,
                    // matching what Redux's hydrateState already does) so
                    // nestFields() on submit doesn't clobber Repeater/
                    // Flexible children with [] before the user ever
                    // triggers a Redux-driven RHF sync (see ticket #1231).
                    hydrateFormBoxes(res.payload.boxes).forEach((box, index) => {
                        methods.setValue(`boxes.${index}`, box);
                    });
                });
        } else {
            const find      = searchParams.get('find');
            const belongsTo = searchParams.get('belongsTo');

            const newGroupName  = `${find ? find+'_' : ''}group_name`;
            const newGroupLabel = `${find ? find+' ' : ''}group name`;

            let state = {name: newGroupName, label: newGroupLabel};

            methods.reset();
            methods.setValue('name', newGroupName);
            methods.setValue('label', newGroupLabel);

            if (find && belongsTo) {
                const newUuid = uuidv4();
                methods.setValue(`belongs.0.id`, newUuid);
                methods.setValue(`belongs.0.belongsTo`, belongsTo);
                methods.setValue(`belongs.0.operator`, "=");
                methods.setValue(`belongs.0.find`, find);
                state.belongs = [{id: newUuid, belongsTo, operator: "=", find}];
            }

            dispatch(hydrateState(state));
        }

        flushCookieMessages();

    }, [id, location]);

    // ── Add box ───────────────────────────────────────────────────────────────

    const handleAddBox = () => {
        dispatch(addBox(createBox(group.boxes ? group.boxes.length : 0)));
    };

    // ── Drag & drop ───────────────────────────────────────────────────────────

    const handleOnDragEnd = (event) => {
        const {active, over} = event;
        if (!active || !over) return;

        const isSidebarElement = active.data.current?.fromSidebar;
        const isCanvasElement  = active.data.current?.fromCanvas;
        const isBox            = active.data.current?.fromCanvasBox;

        // ── A. Sidebar → box fields area or field half ────────────────────
        if (isSidebarElement) {
            const type          = active.data.current.column?.type ?? fieldTypes.TEXT;
            const overData      = over.data.current ?? {};
            let   targetBoxId   = overData.boxId;
            const isRepeater    = overData.isRepeater;
            const isBlockFields = overData.isBlockFields;
            const targetField   = overData.field;

            // Dropped on genuinely empty canvas (zero boxes) — auto-create one
            if (!targetBoxId && overData.isCanvas) {
                const newBox = createBox(group.boxes ? group.boxes.length : 0);
                dispatch(addBox(newBox));
                targetBoxId = newBox.id;
            }

            if (!targetBoxId) return;

            // Determine parentFieldId: explicit repeater/block area, OR inherit from target field
            let parentFieldId = null;
            let parentBlockId = null;

            if (isRepeater) {
                parentFieldId = overData.parentFieldId;
            } else if (isBlockFields) {
                parentFieldId = overData.parentFieldId;
                parentBlockId = overData.parentBlockId;
            } else if (targetField) {
                // Dropping on a field's half — inherit parent context from that field
                parentFieldId = targetField.parentId || null;
                parentBlockId = targetField.blockId || null;
            }

            const newField = createField(type, targetBoxId, parentFieldId, parentBlockId);

            dispatch(addField({boxId: targetBoxId, parentFieldId, parentBlockId, field: newField}));
            return;
        }

        // ── B. Canvas box reorder (via SortableContext) ───────────────────
        if (isBox) {
            const boxes    = group.boxes ?? [];
            // A box's own fields-drop zone (CanvasBox.jsx's fieldsDrop
            // droppable, id `<boxId>-fields-drop`) fills most of its visible
            // rect, so a coarse-stepped keyboard drag — or an imprecise
            // mouse drop — often lands there rather than the thin header
            // strip. Treat it the same as the box itself for reorder intent.
            const overId   = String(over.id).replace(/-fields-drop$/, '');
            const oldIndex = boxes.findIndex(b => b.id === active.id);
            const newIndex = boxes.findIndex(b => b.id === overId);
            if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
            const sorted = arrayMove([...boxes], oldIndex, newIndex);
            dispatch(setBoxes(sorted));
            return;
        }

        // ── C. Canvas field → field half (reorder / cross-box / into repeater) ──
        if (isCanvasElement) {
            const activeField  = active.data.current?.field;
            const fromBoxId    = active.data.current?.boxId;
            const overData     = over.data.current ?? {};
            const toBoxId      = overData.boxId ?? fromBoxId;
            const isTopHalf    = overData.isTopHalfElement;
            const isBottomHalf = overData.isBottomHalfElement;
            const isLeftHalf   = overData.isLeftHalfElement;
            const isRightHalf  = overData.isRightHalfElement;
            const targetField  = overData.field;
            const isRepeater   = overData.isRepeater;
            const isBlockFields = overData.isBlockFields;

            if (!activeField || activeField.id === targetField?.id) return;

            // ── C1. Drop onto repeater/block area → move field into that parent ──
            if (isRepeater || isBlockFields) {
                const parentFieldId = overData.parentFieldId || null;
                const parentBlockId = isBlockFields ? (overData.parentBlockId || null) : null;

                // Reject dropping a field onto itself or one of its own
                // descendants (e.g. a Repeater dragged into its own "drop
                // children here" zone) -- this would create a parentId/
                // blockId cycle that crashes nestFields() on submit.
                const fromBox = group.boxes.find(b => b.id === fromBoxId);
                if (isFieldOrDescendant(fromBox?.fields ?? [], activeField.id, parentFieldId)) {
                    return;
                }

                if (fromBoxId !== toBoxId) {
                    // Cross-box: move the field first
                    dispatch(moveField({
                        fieldId: activeField.id,
                        fromBoxId,
                        toBoxId,
                        insertBeforeFieldId: null
                    }));
                }

                // Update parentId/blockId to place the field inside the repeater/block
                const updatedField = {...activeField, parentId: parentFieldId, blockId: parentBlockId};
                dispatch(updateField({field: updatedField, boxId: toBoxId}));
                return;
            }

            // ── C2. Same box — reorder or move between scopes ──
            if (fromBoxId === toBoxId) {
                const box = group.boxes.find(b => b.id === fromBoxId);

                // Determine source and target parent scopes
                const sourceParentId = activeField.parentId || null;
                const sourceBlockId  = activeField.blockId || null;
                const targetParentId = targetField?.parentId || null;
                const targetBlockId  = targetField?.blockId || null;

                // If moving between different parent scopes (e.g. out of repeater → root)
                if (sourceParentId !== targetParentId || sourceBlockId !== targetBlockId) {
                    // 1. Update parentId/blockId to move into the new scope
                    const updatedField = {...activeField, parentId: targetParentId, blockId: targetBlockId};
                    dispatch(updateField({field: updatedField, boxId: fromBoxId}));

                    // 2. Reorder within the new scope to place near the target field
                    if (targetField) {
                        const freshBox = group.boxes.find(b => b.id === fromBoxId);
                        const newScopeFields = (freshBox?.fields ?? []).filter(f => {
                            if (f.id === activeField.id) return true; // include the moved field (with its old scope data still)
                            if (targetBlockId) return f.blockId === targetBlockId;
                            if (targetParentId) return f.parentId === targetParentId && !f.blockId;
                            return !f.parentId && !f.blockId;
                        });

                        // Place the moved field next to the target
                        const withoutActive = newScopeFields.filter(f => f.id !== activeField.id);
                        const targetIdx = withoutActive.findIndex(f => f.id === targetField.id);
                        const insertIdx = (isTopHalf || isLeftHalf) ? targetIdx : targetIdx + 1;
                        withoutActive.splice(insertIdx === -1 ? withoutActive.length : insertIdx, 0, updatedField);

                        dispatch(setFields({
                            boxId: fromBoxId,
                            sortedFields: withoutActive,
                            parentFieldId: targetParentId,
                            parentBlockId: targetBlockId
                        }));
                    }
                    return;
                }

                // Same scope — reorder
                const scopeFields = (box?.fields ?? []).filter(f => {
                    if (sourceBlockId) return f.blockId === sourceBlockId;
                    if (sourceParentId) return f.parentId === sourceParentId && !f.blockId;
                    return !f.parentId && !f.blockId;
                });

                const oldIndex = scopeFields.findIndex(f => f.id === activeField.id);
                const newIndex = targetField ? scopeFields.findIndex(f => f.id === targetField.id) : scopeFields.length;
                if (oldIndex === -1) return;
                const insertAt = (isTopHalf || isLeftHalf) ? newIndex : (targetField ? newIndex + 1 : newIndex);
                const sorted   = arrayMove(scopeFields, oldIndex, insertAt <= oldIndex ? insertAt : insertAt - 1);

                dispatch(setFields({
                    boxId: fromBoxId,
                    sortedFields: sorted,
                    parentFieldId: sourceParentId,
                    parentBlockId: sourceBlockId
                }));
            } else {
                // ── C3. Cross-box — move ──
                const insertBeforeFieldId = (isTopHalf || isLeftHalf) ? targetField?.id : undefined;
                dispatch(moveField({
                    fieldId: activeField.id,
                    fromBoxId,
                    toBoxId,
                    insertBeforeFieldId: insertBeforeFieldId ?? null
                }));
            }
        }
    };

    // ── Save ──────────────────────────────────────────────────────────────────

    const isSaveButtonEnabled = () => !isSubmitting && !saveLoading && isEmpty(methods.formState.errors);

    const onSubmit = (data) => {
        // Structural safety net: checkIfNameIsValid (useMetaFieldNameValidator)
        // only ever validates a field whose name input has been registered
        // (focused/typed into) at least once -- a field left at its untouched
        // createField() default can carry a duplicate name that
        // formState.errors can never catch. The meta key is <box>_<field>, so
        // field names only need to be unique within their own box (#1421/#1422).
        const duplicates = [];
        (data.boxes ?? []).forEach((box) => {
            const seenByName = new Map();
            (box.fields ?? []).forEach((f) => {
                if (!f?.name) return;
                const key = f.name.toLowerCase();
                if (seenByName.has(key)) {
                    duplicates.push({boxLabel: box.label || box.name, name: f.name, labelA: seenByName.get(key), labelB: f.label || f.name});
                } else {
                    seenByName.set(key, f.label || f.name);
                }
            });
        });

        if (duplicates.length > 0) {
            duplicates.forEach(({boxLabel, name, labelA, labelB}) => {
                toast.error(useTranslation(`Duplicate field name "${name}" in box "${boxLabel}": "${labelA}" and "${labelB}". Rename one before saving.`));
            });
            return;
        }

        // Same structural net for box names: BoxSettingsPanel's checkIfNameIsValid
        // only validates a box whose settings panel has been opened, so a box
        // added and never clicked into can carry a colliding name. Two boxes in
        // one group sharing an internal name silently corrupts value reads
        // (getMetaFieldByName keys on <box>_<field> with no group scope).
        const boxDuplicates = [];
        const seenBoxName = new Map();
        (data.boxes ?? []).forEach((box) => {
            if (!box?.name) return;
            const key = box.name.toLowerCase();
            if (seenBoxName.has(key)) {
                boxDuplicates.push({name: box.name, labelA: seenBoxName.get(key), labelB: box.label || box.name});
            } else {
                seenBoxName.set(key, box.label || box.name);
            }
        });

        if (boxDuplicates.length > 0) {
            boxDuplicates.forEach(({name, labelA, labelB}) => {
                toast.error(useTranslation(`Duplicate box name "${name}": "${labelA}" and "${labelB}". Rename one before saving.`));
            });
            return;
        }

        setIsSubmitted(true);

        // Merge Redux-managed properties (visibilityConditions, validationRules, permissions)
        // into the form data.
        //
        // - Redux is the source of truth for WHICH items exist (add/delete modify the array).
        // - RHF is the source of truth for the CONTENT of each item (user edits type, operator, value…).
        //
        // Strategy: take the array from Redux (correct items), but for each item,
        // prefer the RHF version (which has user edits) if available.
        const mergeArrayByIdPreferForm = (formArray, reduxArray) => {
            if (!reduxArray || reduxArray.length === 0) return [];

            return reduxArray.map((reduxItem, index) => {
                if (!reduxItem) return reduxItem;

                // Try to find the form version by ID, or by index as fallback
                const formItem = formArray?.find(fi => fi?.id === reduxItem.id)
                    ?? formArray?.[index];

                // If form has a version with the same ID, use it (has user edits)
                if (formItem && formItem.id === reduxItem.id) {
                    return formItem;
                }

                // Otherwise use Redux version (newly added item, tab never opened)
                return reduxItem;
            });
        };

        const mergeReduxFieldData = (formFields, reduxFields) => {
            if (!formFields || !reduxFields) return formFields ?? [];

            return formFields.map(formField => {
                if (!formField) return formField;
                const reduxField = reduxFields.find(rf => rf?.id === formField.id);
                if (!reduxField) return formField;

                return {
                    ...formField,
                    visibilityConditions: mergeArrayByIdPreferForm(
                        formField.visibilityConditions,
                        reduxField.visibilityConditions
                    ),
                    validationRules: mergeArrayByIdPreferForm(
                        formField.validationRules,
                        reduxField.validationRules
                    ),
                    permissions: mergeArrayByIdPreferForm(
                        formField.permissions,
                        reduxField.permissions
                    ),
                };
            });
        };

        // Reconstruct nested children/block-fields for backend compatibility
        const submitData = {
            ...data,
            boxes: (data.boxes ?? []).map((box, boxIndex) => {
                const reduxBox = group.boxes?.[boxIndex] ?? group.boxes?.find(b => b.id === box?.id);
                const mergedFields = mergeReduxFieldData(box.fields, reduxBox?.fields);

                return {
                    ...box,
                    visibilityConditions: mergeArrayByIdPreferForm(
                        box.visibilityConditions,
                        reduxBox?.visibilityConditions
                    ),
                    fields: nestFields(mergedFields ?? [])
                };
            })
        };

        dispatch(saveMeta(submitData))
            .then(res => {
                const payload = res.payload;
                if (payload?.success) {
                    methods.reset({}, {keepValues: true, keepIsSubmitted: true});
                    setHasUnsavedChanges(false);
                    toast.success(useTranslation("Meta group settings successfully saved"));
                    dispatch(hydrateState(submitData));
                    updateDocumentGlobalsVar(submitData);
                    scrollToTop();
                } else {
                    // saveMeta's thunk uses rejectWithValue(error.message) on a network/thrown
                    // failure, so dispatch(saveMeta(...)) never actually rejects the promise --
                    // it resolves here with res.payload as a plain string instead of the usual
                    // {success, error} shape. payload?.error is undefined on a string, so this
                    // branch used to always fall back to the generic message and silently drop
                    // the real network error (the .catch() below is effectively unreachable).
                    const errorMessage = (payload && payload.error)
                        || (typeof payload === 'string' && payload)
                        || useTranslation("An unexpected error has occurred");
                    toast.error(errorMessage);
                }
                setIsSubmitted(false);
            })
            .catch(err => {
                const message = getErrorMessage(err);
                console.error(message);
                toast.error(message);
                setIsSubmitted(false);
            });
    };

    const updateDocumentGlobalsVar = (data) => {
        let newMeta = [];
        document.globals.globals.find.meta.map((g) => {
            newMeta.push(g.value === data.id ? {value: data.id, label: data.name} : g);
        });
        document.globals = {
            ...document.globals,
            globals: {
                ...document.globals.globals,
                find: {...document.globals.globals.find, meta: newMeta}
            }
        };
    };

    const actions = [
        <Button
            key="add-box"
            testId="add-meta-box"
            type="button"
            style={styleVariants.OUTLINED_PRIMARY}
            size="sm"
            icon="bx:plus"
            onClick={e => { e.preventDefault(); handleAddBox(); }}
        >
            {useTranslation("Add meta box")}
        </Button>,
        <Button
            key="save"
            testId="save"
            disabled={!isSaveButtonEnabled()}
            style={styleVariants.PRIMARY}
            size="sm"
            icon="bx:save"
        >
            {useTranslation("Save")}
        </Button>,
        <DeleteAllMetaBoxesModal key="delete-all" />,
    ];

    if (id && loading) return <Loader />;
    if (fetchError)    return <PageNotFound />;

    return (
        <React.Fragment>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    onChange={() => setHasUnsavedChanges(true)}
                >
                    <Layout
                        title={<MetaGroupTitle groupId={groupId} />}
                        actions={actions}
                        crumbs={[
                            {label: useTranslation("Field groups"), link: "/meta"},
                            {label: useTranslation("Manage meta fields")}
                        ]}
                    >
                        <MetaGroupSettings groupId={groupId} />
                        <CanvasLayout
                            id={`meta-canvas-layout${id ? '-'+id : ''}`}
                            preferenceId={id}
                            wrapperRef={ref}
                            toolbarRef={toolbarRef}
                            sensors={sensors}
                            announcements={announcements}
                            onDragEnd={handleOnDragEnd}
                            collisionDetection={collisionDetection}
                            sidebar={<Sidebar />}
                            canvas={<Canvas groupId={groupId} />}
                            dragOverlay={<DragOverlayWrapper />}
                        />
                    </Layout>
                </form>
            </FormProvider>
        </React.Fragment>
    );
};

export default Meta;
