import React, {useState} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import Label from "../../components/Forms/Label";
import Input from "../../components/Forms/Input";
import {isEmpty} from "../../utils/objects";
import {alphanumericallyValid} from "../../utils/validation";
import {slugify, transliterate} from "transliteration";
import BelongConditions from "../../components/Forms/BelongConditions";
import {v4 as uuidv4} from "uuid";
import {addBelong, deleteBelong} from "../../redux/reducers/metaStateSlice";
import Select from "../../components/Forms/Select";
import {fieldGroupsDisplay} from "../../constants/fields";

const MetaGroupSettings = ({groupId}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);
    const findBelongsValues = globals.find;

    // manage form state
    const { control, register, unregister, formState: {errors}, setValue, resetField, clearErrors } = useFormContext();
    const { append, remove } = useFieldArray({
        control,
        name: "belongs",
    });

    const handleAddBelong = () => {
        const newBelong = {
            id: uuidv4(),
            belongsTo: null,
            operator: "=",
            find: null,
            logic: null
        };

        dispatch(addBelong({belong: newBelong}));
    };

    const handleDeleteBelong = (index, id) => {
        dispatch(deleteBelong({belongId: id}));
        remove(index);
    };

    // mange local state
    const [autoSlug, setAutoSlug] = useState(true);

    /**
     *
     * @return {*}
     */
    const groupLabel = () => {
        return (
            <div className="flex-between s-8">
                <span>
                    {useTranslation("Group label")}
                </span>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        setAutoSlug(!autoSlug);
                    }}
                >
                    {useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                </a>
            </div>
        );
    };

    /**
     *
     * @return {[{label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}]}
     */
    const displayOptions = () => {
        return [
            {
                label: useTranslation("Standard view"),
                value: fieldGroupsDisplay.STANDARD
            },
            {
                label: useTranslation("Accordion"),
                value: fieldGroupsDisplay.ACCORDION
            },
            {
                label: useTranslation("Horizontal tabs"),
                value: fieldGroupsDisplay.HORIZONTAL_TABS
            },
            {
                label: useTranslation("Vertical tabs"),
                value: fieldGroupsDisplay.VERTICAL_TABS
            }
        ];
    };

    return (
        <div className="mb-24 bg-white with-shadow p-24">
            <div className="flex-column s-24">
                <div className="container">
                    <div className="col-4">
                        <Label id="label" label={groupLabel()}/>
                        <Input
                            id="label"
                            register={register}
                            placeholder={useTranslation("Group label")}
                            defaultValue={!isEmpty(group) ? group.label : null}
                            errors={errors}
                            onChangeCapture={e => {
                                if(autoSlug){
                                    setValue("name", slugify(transliterate(e.target.value)));
                                }
                            }}
                            onClick={e => {
                                if(e.target.value === 'group name'){
                                    resetField("label");
                                }
                            }}
                            validate={{
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                    <div className="col-4">
                        <Label
                            id="name"
                            label={useTranslation("Group name")}
                        />
                        <Input
                            id="name"
                            register={register}
                            placeholder={useTranslation("Group name")}
                            defaultValue={!isEmpty(group) ? group.name : "group_name"}
                            errors={errors}
                            isRequired={true}
                            validate={{
                                validate: alphanumericallyValid,
                                required: useTranslation("This field is mandatory"),
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                    <div className="col-4">
                        <Label
                            id="display"
                            label={useTranslation("Display as")}
                        />
                        <Select
                            id="display"
                            register={register}
                            errors={errors}
                            values={displayOptions()}
                            defaultValue={!isEmpty(group) && group.display ? group.display : fieldGroupsDisplay.STANDARD}
                        />
                    </div>
                </div>
                <fieldset className="acpt-fieldset">
                    <legend>
                        {useTranslation("Location")}
                    </legend>
                    <BelongConditions
                        id="belongs"
                        values={findBelongsValues}
                        conditions={group.belongs ? group.belongs : []}
                        append={append}
                        register={register}
                        unregister={unregister}
                        remove={remove}
                        errors={errors}
                        control={control}
                        handleAddBelong={handleAddBelong}
                        handleDeleteBelong={handleDeleteBelong}
                        resetField={resetField}
                        setValue={setValue}
                        clearErrors={clearErrors}
                    />
                </fieldset>
            </div>
        </div>
    );
};

MetaGroupSettings.propTypes = {
    groupId: PropTypes.string.isRequired
};

export default MetaGroupSettings;