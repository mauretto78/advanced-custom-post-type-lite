import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../../hooks/useTranslation";
import {useSelector} from "react-redux";
import {isEmpty} from "../../../utils/objects";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {alphanumericallyValid} from "../../../utils/validation";
import Input from "../../../components/Forms/Input";
import {slugify, transliterate} from "transliteration";
import {Icon} from "@iconify/react";
import Tooltip from "../../../components/Tooltip";
import InputHidden from "../../../components/Forms/InputHidden";


const MetaGroupTitle = ({groupId}) => {

    // manage form state
    const { register, formState: {errors}, control, setValue, resetField } = useFormContext();
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

    // manage local state
    // Starts ON for a brand-new/untouched group, but stays OFF for a name
    // already customized away from what auto-slug would generate -- so
    // reopening an existing group to tweak its label can't silently wipe an
    // intentional custom slug.
    const [autoSlug, setAutoSlug] = useState(() => {
        const currentName = !isEmpty(group) ? group.name : '';
        const currentLabel = !isEmpty(group) ? group.label : '';
        return !currentName || currentName === slugify(transliterate(currentLabel ?? ''));
    });
    const [formVisible, setFormVisible] = useState(false);

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
        <div className="i-flex-center s-8">
            <InputHidden
                id="id"
                value={groupId}
                register={register}
            />
            {formVisible ? (
                <React.Fragment>
                    <div>
                        <Input
                            id="label"
                            size="xs"
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
                    <div>
                        <Input
                            id="name"
                            size="xs"
                            register={register}
                            placeholder={useTranslation("Group name")}
                            defaultValue={!isEmpty(group) ? group.name : "group_name"}
                            errors={errors}
                            isRequired={true}
                            onChangeCapture={() => {
                                // A direct edit to the slug is a deliberate customization --
                                // stop auto-syncing it from the label for the rest of this session.
                                setAutoSlug(false);
                            }}
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
                    <div>
                        <Tooltip
                            label={
                                <span
                                    className={`acpt-btn-switch ${autoSlug === true ? 'active' : ''}`}
                                    role="switch"
                                    aria-label={useTranslation("Automatic slug")}
                                    aria-checked={autoSlug}
                                    tabIndex={0}
                                    onClick={e => {
                                        e.preventDefault();
                                        setAutoSlug(!autoSlug);
                                    }}
                                    onKeyDown={e => {
                                        if(e.key === 'Enter' || e.key === ' '){
                                            e.preventDefault();
                                            setAutoSlug(!autoSlug);
                                        }
                                    }}
                                >
                                <Icon icon="bx-link" width={18} />
                            </span>
                            }
                            tip={useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                            icon={false}
                        />
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <h1>
                        {name()}
                    </h1>
                    {label() && (
                        <span className="font-regular text-normal">
                    {label()}
                </span>
                    )}
                </React.Fragment>
            )}
            <Button
                style={styleVariants.OUTLINED_SECONDARY}
                size="sm"
                icon={formVisible ? 'bx:x' : 'bx:cog'}
                onClick={(e) => {
                e.preventDefault();
                setFormVisible(!formVisible);
            }}>
                {useTranslation(`${formVisible ? 'Close' : 'Edit'}`)}
            </Button>
        </div>
    );
};

MetaGroupTitle.propTypes = {
    groupId: PropTypes.string.isRequired,
};

export default MetaGroupTitle;