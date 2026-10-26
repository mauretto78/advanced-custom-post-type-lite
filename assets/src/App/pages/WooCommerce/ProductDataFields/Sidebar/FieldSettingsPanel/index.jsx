import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {get, useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../../../../hooks/useTranslation.jsx";
import {unsetActiveElement} from "../../../../../redux/reducers/productDataFieldsStateSlice";
import {SELECT_MULTI, WooCommerceFieldsList, canFieldHaveOptions} from "../../../../../constants/woocommerce_fields.jsx";
import Label from "../../../../../components/Forms/Label";
import Input from "../../../../../components/Forms/Input";
import Select from "../../../../../components/Forms/Select";
import Textarea from "../../../../../components/Forms/Textarea";
import Toggle from "../../../../../components/Forms/Toggle";
import InputHidden from "../../../../../components/Forms/InputHidden";
import {debounce} from "../../../../../utils/debounce";
import {alphanumericallyValid} from "../../../../../utils/validation";
import {slugify, transliterate} from "transliteration";
import {grayColor} from "../../../../../utils/colors";
import useProductFieldTypeChange from "../../../../../hooks/useProductFieldTypeChange.jsx";
import {maxWidthClassName} from "../../../../../utils/ui.jsx";
import useProductFieldNameValidator from "../../../../../hooks/useProductFieldNameValidator.jsx";
import ProductDataFieldOptionsList from "./ProductDataFieldOptionsList/index.jsx";

const FieldSettingsPanel = () => {

    const dispatch = useDispatch();
    const {activeElement, fields} = useSelector(state => state.productDataFieldsState);

    // Derive field from the live fields array so any Redux mutation
    // (addOption, deleteOption, setOptions, updateField) is reflected
    // immediately without needing to re-open the settings panel.
    const index = fields.findIndex(f => f.id === activeElement?.id);
    const field = index !== -1 ? fields[index] : null;

    // manage form state
    const {
        formState: {errors},
        register,
        setValue,
        clearErrors,
        setError,
        resetField,
        control: formControl,
    } = useFormContext();

    // Local state
    const [autoSlug, setAutoSlug] = useState(true);

    // ── Form field path helper ────────────────────────────────────────────
    const formId = (key) => `fields.${index}.${key}`;

    // ── Watched values ────────────────────────────────────────────────────
    const watchedName = useWatch({formControl, name: formId('name')});
    const watchedType = useWatch({formControl, name: formId('type')});

    // ── Shared hooks (must run unconditionally, before the early return) ──
    const changeType         = useProductFieldTypeChange({field: field ?? {type: null}, formId});
    const checkIfNameIsValid = useProductFieldNameValidator({index});

    if (!field || index === -1) return null;

    // ── Derived display values ────────────────────────────────────────────
    const fieldName = () => {
        const error = get(errors, formId('name'));
        if (error) {
            return <span className="invalid-feedback">{useTranslation(error.message)}</span>;
        }
        return watchedName || field.name;
    };

    const fieldType = () => watchedType || field.type;

    // ── Name change → auto-slug ───────────────────────────────────────────
    const onChangeName = (rawName) => {
        if (!autoSlug) return;
        const slugified = slugify(transliterate(rawName));
        setValue(formId('name'), slugified);

        if (checkIfNameIsValid(slugified)) {
            setError(formId('name'), {message: useTranslation('Name is already taken')});
        } else {
            clearErrors(formId('name'));
        }
    };

    return (
        <div className="h-100 b-right-1">

            {/* ── Panel header ── */}
            <div className="flex-between b-bottom-1 p-24">
                <div className="i-flex-center s-8 w-100">
                    <strong className={maxWidthClassName(watchedName || field.name)}>{fieldName()}</strong>
                    <span className="color-medium-gray font-size-sm">{fieldType()}</span>
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

            {/* ── Form body ── */}
            <div
                className="p-24 font-sm flex-column s-12 with-scrollbar"
                style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}
            >
                <InputHidden
                    id={formId('id')}
                    value={field.id}
                    register={register}
                />

                {/* Name / slug */}
                <div>
                    <Label
                        size="xs"
                        isRequired={true}
                        id={formId('name')}
                        label={useTranslation('Field name')}
                    />
                    <Input
                        size="xs"
                        id={formId('name')}
                        register={register}
                        errors={errors}
                        defaultValue={field.name}
                        placeholder={useTranslation('Field slug (e.g. my_field)')}
                        onClick={e => { if (e.target.value === 'field') resetField(formId('name')); }}
                        onChangeCapture={debounce(e => { onChangeName(e.target.value); }, 300)}
                        validate={{
                            validate:  {alphanumericallyValid, checkIfNameIsValid},
                            required:  useTranslation('This field is mandatory'),
                            maxLength: {value: 255, message: 'max length is 255'},
                        }}
                    />
                </div>

                {/* Type */}
                <div>
                    <Label
                        size="xs"
                        isRequired={true}
                        id={formId('type')}
                        label={useTranslation('Field type')}
                    />
                    <Select
                        size="xs"
                        id={formId('type')}
                        register={register}
                        errors={errors}
                        defaultValue={field.type}
                        values={WooCommerceFieldsList}
                        onChangeCapture={e => { changeType(e.target.value); }}
                    />
                </div>

                {/* Required */}
                <div>
                    <Label
                        size="xs"
                        id={formId('isRequired')}
                        label={useTranslation('Required')}
                    />
                    <Toggle
                        size="xs"
                        id={formId('isRequired')}
                        register={register}
                        errors={errors}
                        defaultValue={field.isRequired}
                    />
                </div>

                {/* Default value */}
                <div>
                    <Label
                        size="xs"
                        id={formId('defaultValue')}
                        label={useTranslation('Default value')}
                    />
                    <Input
                        size="xs"
                        id={formId('defaultValue')}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation('Default value')}
                        defaultValue={field.defaultValue}
                        validate={{maxLength: {value: 255, message: 'max length is 255'}}}
                    />
                </div>

                {/* Description */}
                <div>
                    <Label
                        size="xs"
                        id={formId('description')}
                        label={useTranslation('Description')}
                    />
                    <Textarea
                        size="xs"
                        id={formId('description')}
                        register={register}
                        errors={errors}
                        defaultValue={field.description || ''}
                        placeholder={useTranslation('A brief description (shown only in the admin panel)')}
                        characterLimit={255}
                        rows={3}
                        validate={{maxLength: {value: 255, message: 'max length is 255'}}}
                    />
                </div>

                {/* Options list — Select / SelectMulti / Radio */}
                {canFieldHaveOptions(fieldType()) && (
                    <ProductDataFieldOptionsList
                        fieldId={field.id}
                        fieldIndex={index}
                        options={field.options ?? []}
                        isMulti={fieldType() === SELECT_MULTI}
                    />
                )}
            </div>
        </div>
    );
};

export default FieldSettingsPanel;
