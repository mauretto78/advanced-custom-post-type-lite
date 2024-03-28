import React from 'react';
import PropTypes from 'prop-types';
import {useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../hooks/useTranslation";
import {isEmpty} from "../../utils/objects";
import InputHidden from "../../components/Forms/InputHidden";
import {useSelector} from "react-redux";

const MetaGroupHeader = ({groupId, settingsVisible, setSettingsVisible}) => {

    // manage form state
    const { register, formState: {errors}, control } = useFormContext();
    const watchedName = useWatch({
        control,
        name: "name"
    });
    const watchedLabel = useWatch({
        control,
        name: "label"
    });

    // manage global state
    const {group} = useSelector(state => state.metaState);

    /**
     *
     * @return {string|*}
     */
    const name = () => {

        if(errors && errors['name']){
            return (
                <span className="invalid-feedback">
                    {useTranslation("Group name error(s). Please fix it.")}
                </span>
            );
        }

        if(errors && errors['belongs']){
            return (
                <span className="invalid-feedback">
                    {useTranslation("Location rules error(s). Please fix it.")}
                </span>
            );
        }

        if(watchedName){
            return (
                <span>{watchedName}</span>
            );
        }

        return (
            <span>{!isEmpty(group) ? group.name : "group_name"}</span>
        );
    };

    /**
     *
     * @return {null|*}
     */
    const label = () => {

        if(watchedLabel){
            return (
                <span className="color-gray">{watchedLabel}</span>
            );
        }

        if(!isEmpty(group) && group.label){
            return (
                <span className="color-gray">{group.label}</span>
            );
        }

        return useTranslation("Group name");
    };

    return (
        <React.Fragment>
            <InputHidden
                id="id"
                value={groupId}
                register={register}
            />
            <div className="i-flex-center s-8">
                <h3>
                    {name()}
                </h3>
                {label() && (
                    <span className="top-1">{label()}</span>
                )}
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        setSettingsVisible(!settingsVisible);
                    }}
                >
                    {useTranslation(settingsVisible ? "Close settings" : "Open settings")}
                </a>
            </div>
        </React.Fragment>
    );
};

MetaGroupHeader.propTypes = {
    groupId: PropTypes.string.isRequired,
    settingsVisible: PropTypes.bool.isRequired,
    setSettingsVisible: PropTypes.func.isRequired,
};

export default MetaGroupHeader;