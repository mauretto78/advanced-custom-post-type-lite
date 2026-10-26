import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import {useSelector} from "react-redux";
import {useFormContext} from "react-hook-form";
import Label from "../../../components/Forms/Label";
import {isEmpty} from "../../../utils/objects";
import {primaryColor} from "../../../utils/colors";
import BelongsRules from "./BelongsRules.jsx";
import Select from "../../../components/Forms/Select";
import {contextOptions, displayOptions, fieldGroupsDisplay, priorityOptions} from "../../../constants/fields";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {Icon} from "@iconify/react";
import DisplayPicker from "../../../components/Forms/DisplayPicker.jsx";
import CardRow from "../../../components/Card/CardRow.jsx";
import Card from "../../../components/Card";

const MetaGroupSettings = ({groupId}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const { register, formState: {errors}, setValue } = useFormContext();

    // manage local state
    const {id} = useParams();
    const [settingsVisible, setSettingsVisible] = useState(typeof id !== 'string');
    const [context, setContext] = useState(true);
    const [priority, setPriority] = useState(true);

    const handleContextChange = (value) => {
        if(context){
            group.boxes.map((box, index) => {
                setValue(`boxes.${index}.settings[0].context`, value);
            });
        }
    };

    const handlePriorityChange = (value) => {
        if(priority){
            group.boxes.map((box, index) => {
                setValue(`boxes.${index}.settings[0].priority`, value);
            });
        }
    };

    return (
        <div ref={parent}>
            <div className="i-flex-center s-8 mb-24">
                <Icon icon="bx:cog" width={24} color={primaryColor()} />
                <h2>
                    {useTranslation("Settings")}
                </h2>
                <button type="button" className="btn-reset" onClick={(e) => {
                    e.preventDefault();
                    setSettingsVisible(!settingsVisible);
                }}>
                    {useTranslation(`${settingsVisible ? 'Close' : 'Edit'}`)}
                </button>
            </div>
            {settingsVisible && (
                <div className="mb-24">
                    <Card>
                        <CardRow
                            label={useTranslation("Display as")}
                            value={
                                <DisplayPicker
                                    id="display"
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                    defaultValue={!isEmpty(group) && group.display ? group.display : fieldGroupsDisplay.STANDARD}
                                />
                            }
                        />
                        <CardRow
                            label={
                                <span className="flex-column">
                                    <Label id="context" label={useTranslation("Context")} />
                                    <button
                                        type="button"
                                        className="btn-reset font-size-xs text-normal"
                                        aria-label={useTranslation(context ? "Apply to meta boxes" : "Don't apply to meta boxes")}
                                        onClick={e => {
                                            e.preventDefault();
                                            setContext(!context);
                                        }}
                                    >
                                        {useTranslation(context ? "Apply to meta boxes" : "Don't apply to meta boxes")}
                                    </button>
                                </span>
                            }
                            value={
                                <Select
                                    id="context"
                                    register={register}
                                    errors={errors}
                                    values={contextOptions}
                                    defaultValue={!isEmpty(group) && group.context ? group.context : 'advanced'}
                                    onChangeCapture={e => {
                                        handleContextChange(e.target.value);
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={
                                <span className="flex-column">
                                    <Label id="priority" label={useTranslation("Priority")} />
                                    <button
                                        type="button"
                                        className="btn-reset font-size-xs text-normal"
                                        aria-label={useTranslation(priority ? "Apply to meta boxes" : "Don't apply to meta boxes")}
                                        onClick={e => {
                                            e.preventDefault();
                                            setPriority(!priority);
                                        }}
                                    >
                                        {useTranslation(priority ? "Apply to meta boxes" : "Don't apply to meta boxes")}
                                    </button>
                                </span>
                            }
                            value={
                                <Select
                                    id="priority"
                                    register={register}
                                    errors={errors}
                                    values={priorityOptions}
                                    defaultValue={!isEmpty(group) && group.priority ? group.priority : 'default'}
                                    onChangeCapture={e => {
                                        handlePriorityChange(e.target.value);
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Location")}
                            value={<BelongsRules />}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
};

MetaGroupSettings.propTypes = {
    groupId: PropTypes.string.isRequired
};

export default MetaGroupSettings;