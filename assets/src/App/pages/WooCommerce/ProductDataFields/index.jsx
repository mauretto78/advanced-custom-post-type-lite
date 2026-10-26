import React, {useEffect, useRef} from 'react';
import {FormProvider, useForm} from "react-hook-form";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Layout from "../../../layout/Layout";
import {useDispatch, useSelector} from "react-redux";
import DeleteAllFieldsModal from "./Modal/DeleteAllFieldsModal";
import Loader from "../../../components/Loader";
import PageNotFound from "../../404";
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import {TEXT} from "../../../constants/woocommerce_fields";
import {createField} from "./createField.js";
import {toast} from "react-hot-toast";
import {useNavigate, useParams} from "react-router-dom";
import {saveWooCommerceProductDataFields} from "../../../redux/reducers/saveWooCommerceProductDataFieldsSlice";
import {getErrorMessage} from "../../../utils/errors";
import InputHidden from "../../../components/Forms/InputHidden";
import {
    addField,
    hydrateState,
    setFields,
    unsetActiveElement,
} from "../../../redux/reducers/productDataFieldsStateSlice";
import {fetchProductDataFields} from "../../../redux/reducers/fetchProductDataFieldsSlice";
import {useState} from "react";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import DragOverlayWrapper from "./DragOverlayWrapper.jsx";
import CanvasLayout from "../../../components/CanvasLayout";
import {arrayMove} from "@dnd-kit/sortable";
import useDndSensors from "../../../hooks/useDndSensors.jsx";
import {createDndAnnouncements} from "../../../utils/dndAnnouncements.jsx";
import {useOutsideClick} from "../../../hooks/useOutsideClick";

const ProductDataFields = () => {

    const ref        = useRef(null);
    const toolbarRef = useRef(null);

    // manage global state
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.fetchProductDataFields);
    const {fields}  = useSelector(state => state.productDataFieldsState);

    // manage local state
    const {id} = useParams();
    const [fetchError, setFetchError] = useState(false);

    // manage redirect
    const navigate = useNavigate();

    // ── Deselect active element when clicking outside canvas / toolbar ────
    useOutsideClick([ref, toolbarRef], () => {
        dispatch(unsetActiveElement());
    });

    // sensors — activation distance lets a plain click (no movement) fall
    // through to onClick handlers (e.g. click-to-add in the sidebar) while a
    // real drag still works once the pointer moves past the threshold.
    const sensors = useDndSensors({activationConstraint: {distance: 4}});

    // live-region announcements
    const getDragItemLabel = (activeOrOver) => {
        const data = activeOrOver?.data?.current;
        if (!data) return useTranslation("Item");
        if (data.field)  return `${useTranslation("Field")} "${data.field.label || data.field.name}"`;
        if (data.column) return `${useTranslation("New field")} "${data.column.label}"`;
        return useTranslation("Item");
    };
    const announcements = createDndAnnouncements(getDragItemLabel);

    // form init
    const methods = useForm({
        mode: 'all'
    });

    // ── Init ──────────────────────────────────────────────────────────────
    useEffect(() => {
        metaTitle(useTranslation("Manage product data fields"));
        changeCurrentAdminMenuLink('#/');
        dispatch(fetchProductDataFields(id))
            .then(res => {
                // createAsyncThunk dispatches never reject their returned promise, even
                // when the thunk's own try/catch calls rejectWithValue() -- they always
                // resolve, with res.error set only on the rejected-action path (res.payload
                // is then the error message STRING, not an array). This used to go
                // unchecked entirely: dispatch(hydrateState(res.payload)) ran unconditionally,
                // corrupting productDataFieldsState.fields to a string on any fetch failure,
                // and only THEN did the following res.payload.map() throw -- caught by the
                // .catch() below only as an accidental side effect of that second bug, after
                // Redux state was already corrupted.
                if(res.error){
                    setFetchError(true);
                    return;
                }

                dispatch(hydrateState(res.payload));

                // Set initial RHF values
                res.payload && res.payload.map((field, index) => {
                    methods.setValue(`fields.${index}`, field);
                });
            })
            .catch(err => {
                console.error(err);
                setFetchError(true);
            })
        ;
    }, []);

    // ── Sync Redux fields → React Hook Form ───────────────────────────────
    // When fields change in Redux (add/delete/reorder via DnD), mirror the
    // structural change into RHF while preserving user-typed values.
    const isHydrated       = useRef(false);
    const prevFieldsJson   = useRef(null);

    useEffect(() => {
        if (!fields) return;

        const json = JSON.stringify(fields);

        // Skip the very first hydration (data loading sets fields initially)
        if (!isHydrated.current) {
            isHydrated.current  = true;
            prevFieldsJson.current = json;
            return;
        }

        if (json !== prevFieldsJson.current) {
            prevFieldsJson.current = json;

            // Get current RHF values to preserve unsaved user edits
            const currentRHF = methods.getValues('fields') ?? [];

            // Merge: Redux provides structure/order, RHF provides edited values
            const merged = fields.map(reduxField => {
                const rhfField = currentRHF.find(f => f?.id === reduxField.id);
                return rhfField ? {...rhfField} : reduxField;
            });

            methods.setValue('fields', merged, {shouldDirty: false});
        }
    }, [fields]);

    // ── Add field (toolbar button) ────────────────────────────────────────
    const handleAddField = () => {
        dispatch(addField({field: createField(TEXT)}));
    };

    // ── Drag & drop ───────────────────────────────────────────────────────
    const handleOnDragEnd = (event) => {
        const {active, over} = event;
        if (!active || !over) return;

        const isSidebarElement = active.data.current?.fromSidebar;
        const isCanvasElement  = active.data.current?.fromCanvas;

        // ── A. Sidebar → Canvas: create new field ─────────────────────────
        if (isSidebarElement) {
            const type          = active.data.current.column?.type ?? TEXT;
            const overData      = over.data.current ?? {};
            const isTopHalf     = overData.isTopHalfElement;
            const targetField   = overData.field;

            const newField = createField(type);

            if (targetField) {
                // Insert before or after the field the user dropped on
                const targetIndex = fields.findIndex(f => f.id === targetField.id);
                const insertAt    = isTopHalf ? targetIndex : targetIndex + 1;
                const updated     = [...fields];
                updated.splice(insertAt < 0 ? updated.length : insertAt, 0, newField);
                dispatch(setFields({fields: updated}));
            } else {
                // Dropped on the empty canvas → append
                dispatch(addField({field: newField}));
            }
            return;
        }

        // ── B. Canvas → Canvas: reorder fields ───────────────────────────
        if (isCanvasElement) {
            const activeField = active.data.current?.field;
            const overData    = over.data.current ?? {};
            const targetField = overData.field;
            const isTopHalf   = overData.isTopHalfElement;

            if (!activeField) return;
            if (activeField.id === targetField?.id) return;

            const oldIndex = fields.findIndex(f => f.id === activeField.id);
            if (oldIndex === -1) return;

            if (targetField) {
                // Precise insertion via top/bottom half zones
                const targetIndex = fields.findIndex(f => f.id === targetField.id);
                if (targetIndex === -1) return;
                const insertAt = isTopHalf ? targetIndex : targetIndex + 1;
                const without  = fields.filter(f => f.id !== activeField.id);
                without.splice(insertAt <= oldIndex ? insertAt : insertAt - 1, 0, activeField);
                dispatch(setFields({fields: without}));
            } else {
                // Dropped on the canvas area — use id-based index
                const newIndex = fields.findIndex(f => f.id === over.id);
                if (newIndex === -1 || oldIndex === newIndex) return;
                dispatch(setFields({fields: arrayMove([...fields], oldIndex, newIndex)}));
            }
        }
    };

    // ── Form validity ─────────────────────────────────────────────────────
    const isFormValid = () => {
        return !(methods.formState.errors && methods.formState.errors.fields);
    };

    // ── Save ──────────────────────────────────────────────────────────────
    const onSubmit = (data) => {
        // A field the user never opened the Settings panel for (e.g. added
        // it, renamed it inline, and saved immediately) can reach here with
        // type/defaultValue/description/isRequired entirely absent from
        // RHF's tracked state -- those inputs only start being registered
        // once FieldSettingsPanel actually renders for that field. Redux's
        // own field objects (from createField()) always have them, so
        // merge Redux underneath whatever RHF does have before submitting.
        const mergedFields = (fields ?? []).map(reduxField => {
            const formField = data.fields?.find(f => f?.id === reduxField.id);
            return {...reduxField, ...formField};
        });

        dispatch(saveWooCommerceProductDataFields({...data, fields: mergedFields}))
            .then(res => {
                if (res.payload && res.payload.success) {
                    navigate(`/product-data/product/fields/${id}`);
                    toast.success(useTranslation("WooCommerce product data fields successfully saved"));
                    return;
                }

                // On a real thunk rejection res.payload is the error message STRING
                // (rejectWithValue(error.message)), not the {success, error} shape --
                // the old code read payload.error off that string regardless, so
                // toast.error() silently showed "undefined" instead of the real message.
                const errorMessage = (res.payload && res.payload.error)
                    || (typeof res.payload === 'string' && res.payload)
                    || (res.error && res.error.message)
                    || useTranslation("Unknown error");
                toast.error(errorMessage);
            })
            .catch(err => {
                toast.error(getErrorMessage(err));
            })
        ;
    };

    // ── Actions ───────────────────────────────────────────────────────────
    const actions = [
        <Button
            key="add-field"
            testId="add-field"
            style={styleVariants.OUTLINED_PRIMARY}
            size="sm"
            icon="bx:plus"
            type="button"
            onClick={(e) => {
                e.preventDefault();
                handleAddField();
            }}
        >
            {useTranslation("Add field")}
        </Button>,
        <Button
            key="save"
            testId="save"
            disabled={!isFormValid()}
            style={styleVariants.PRIMARY}
            size="sm"
            icon="bx:save"
        >
            {useTranslation("Save")}
        </Button>,
        <DeleteAllFieldsModal key="delete-all" />,
    ];

    if (loading) {
        return <Loader />;
    }

    if (fetchError) {
        return <PageNotFound />;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    title={useTranslation("Manage product data fields")}
                    actions={actions}
                    crumbs={[
                        {
                            label: useTranslation("Registered Custom Post Types"),
                            link: "/"
                        },
                        {
                            label: useTranslation("WooCommerce product data"),
                            link: "/product-data/product"
                        },
                        {
                            label: useTranslation("Product data fields")
                        }
                    ]}
                >
                    <InputHidden
                        register={methods.register}
                        id="productDataId"
                        value={id}
                    />
                    <CanvasLayout
                        id={`product-data-fields-canvas${id ? '-' + id : ''}`}
                        preferenceId={id}
                        wrapperRef={ref}
                        toolbarRef={toolbarRef}
                        sensors={sensors}
                        announcements={announcements}
                        onDragEnd={handleOnDragEnd}
                        sidebar={<Sidebar />}
                        canvas={<Canvas id={id} />}
                        dragOverlay={<DragOverlayWrapper />}
                    />
                </Layout>
            </form>
        </FormProvider>
    );
};

export default ProductDataFields;
