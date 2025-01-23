import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import Label from "../../../components/Forms/Label";
import {isEmpty} from "../../../utils/objects";
import BelongConditions from "../../../components/Forms/BelongConditions";
import {v4 as uuidv4} from "uuid";
import {addBelong, deleteBelong} from "../../../redux/reducers/metaStateSlice";
import Select from "../../../components/Forms/Select";
import {fieldGroupsDisplay} from "../../../constants/fields";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {Icon} from "@iconify/react";

const MetaGroupSettings = ({groupId}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);
    const findBelongsValues = globals.find;

    // auto-animate
    const [parent] = useAutoAnimate();

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
            operator: null,
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
    const {id} = useParams();
    const [settingsVisible, setSettingsVisible] = useState(typeof id !== 'string');

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

    /**
     *
     * @return {[{label: string, value: string}, {label: string, value: string}, {label: string, value: string}]}
     */
    const contextOptions = () => {
        return [
            {label: 'advanced', value: 'advanced'},
            {label: 'normal', value: 'normal'},
            {label: 'side', value: 'side'},
        ];
    };

    /**
     *
     * @return {[{label: string, value: string}, {label: string, value: string}, {label: string, value: string}, {label: string, value: string}]}
     */
    const priorityOptions = () => {
        return [
            {label: 'default', value: 'default'},
            {label: 'core', value: 'core'},
            {label: 'high', value: 'high'},
            {label: 'low', value: 'low'},
        ];
    };

    return (
        <div ref={parent}>
            <div className="i-flex-center s-8 mb-24">
                <Icon icon="bx:cog" width={24} color="#007CBA" />
                <h3>
                    {useTranslation("Settings")}
                </h3>
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setSettingsVisible(!settingsVisible);
                }}>
                    {useTranslation(`${settingsVisible ? 'Close' : 'Edit'}`)}
                </a>
            </div>
            {!settingsVisible && (
                <div className="line-separator mb-24" />
            )}
            {settingsVisible && (
                <div className="mb-24 bg-white b-rounded with-shadow flex-column b-top-1 pt-24" style={{marginTop: "0"}}>
                    <div className="container p-24">
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
                        <div className="col-4">
                            <Label
                                id="context"
                                label={useTranslation("Context")}
                            />
                            <Select
                                id="context"
                                register={register}
                                errors={errors}
                                values={contextOptions()}
                                defaultValue={!isEmpty(group) && group.context ? group.context : 'advanced'}
                            />
                        </div>
                        <div className="col-4">
                            <Label
                                id="priority"
                                label={useTranslation("Priority")}
                            />
                            <Select
                                id="priority"
                                register={register}
                                errors={errors}
                                values={priorityOptions()}
                                defaultValue={!isEmpty(group) && group.priority ? group.priority : 'default'}
                            />
                        </div>
                    </div>
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
                </div>
            )}
        </div>
    );
};

MetaGroupSettings.propTypes = {
    groupId: PropTypes.string.isRequired
};

export default MetaGroupSettings;