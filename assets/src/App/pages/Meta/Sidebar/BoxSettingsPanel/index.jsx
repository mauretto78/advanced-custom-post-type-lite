import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {grayColor} from "../../../../utils/colors.jsx";
import useTranslation from "../../../../hooks/useTranslation.jsx";
import {unsetActiveBox} from "../../../../redux/reducers/metaStateSlice.jsx";
import DeleteMetaBoxModal from "../../Modal/DeleteMetaBoxModal.jsx";
import MetaBoxSettings from "./MetaBoxSettings.jsx";
import {useFormContext} from "react-hook-form";
import Input from "../../../../components/Forms/Input.jsx";
import Button from "../../../../components/Button/index.jsx";
import {styleVariants} from "../../../../constants/styles.jsx";
import Label from "../../../../components/Forms/Label.jsx";
import {slugify, transliterate} from "transliteration";
import {alphanumericallyValid} from "../../../../utils/validation.jsx";
import {debounce} from "../../../../utils/debounce.jsx";
import useWatchedFieldValue from "../../../../hooks/useWatchedFieldValue.jsx";
import useMetaBoxNameValidator from "../../../../hooks/useMetaBoxNameValidator.jsx";

const BoxSettingsPanel = () => {

    const dispatch = useDispatch();
    const {activeBox, group} = useSelector(state => state.metaState);

    const box   = group.boxes?.find(b => b.id === activeBox?.id);
    const index = activeBox?.index ?? 0;

    const {register, formState: {errors}, setValue, setError, clearErrors, resetField} = useFormContext();

    const boxLabel = useWatchedFieldValue(`boxes.${index}.label`, box?.label);
    const boxName  = useWatchedFieldValue(`boxes.${index}.name`, box?.name);

    // manage local state
    // Starts ON for a brand-new/untouched box, but stays OFF for a name
    // already customized away from what auto-slug would generate -- so
    // reopening an existing box to tweak its label can't silently wipe an
    // intentional custom slug.
    const [autoSlug, setAutoSlug] = useState(() => !boxName || boxName === slugify(transliterate(boxLabel ?? '')));

    // Box names must be globally unique because getMetaFieldByName() resolves values by
    // box name with no group scope — shared with the inline canvas rename editor
    // (CanvasBoxHeader.jsx) so both stay backed by the same uniqueness check.
    const checkIfNameIsValid = useMetaBoxNameValidator({boxIndex: index, box: box ?? {}});

    if (!box) return null;

    /**
     * Auto-slug label → name
     * @param label
     */
    const onChangeLabel = async (label) => {
        if (autoSlug) {
            const slugified = slugify(transliterate(label));
            setValue(`boxes.${index}.name`, slugified);

            if (await checkIfNameIsValid(slugified)) {
                setError(`boxes.${index}.name`, {message: useTranslation("No Meta box duplicate names are allowed")});
            } else {
                clearErrors(`boxes.${index}.name`);
            }
        }
    };

    return (
        <div className="h-100 b-right-1 flex-column">
            <div className="flex-between b-bottom-1 p-24">
                <h3 className="i-flex-center s-8">
                    <span>{boxLabel}</span>
                    <span className="color-medium-gray font-size-sm">{boxName}</span>
                </h3>
                <Icon
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-hidden={false}
                    aria-label={useTranslation("Deselect")}
                    onClick={e => { e.preventDefault(); dispatch(unsetActiveBox()); }}
                    onKeyDown={e => {
                        if(e.key === 'Enter' || e.key === ' '){
                            e.preventDefault();
                            dispatch(unsetActiveBox());
                        }
                    }}
                    icon="bx:x"
                    width={18}
                    color={grayColor()}
                />
            </div>
            <div style={{marginBottom: "95px", overflowY: "auto", flex: 1}}>
                <div className="canvas-settings with-scrollbar">
                    <div className="p-24 font-sm flex-column s-12">
                        <div>
                            <Label
                                size="xs"
                                id={`boxes.${index}.label`}
                                label={
                                    <div className="flex-between">
                                        <span>{useTranslation("Label")}</span>
                                        <button
                                            type="button"
                                            className="btn-reset"
                                            style={{fontWeight: "normal"}}
                                            onClick={e => {
                                                e.preventDefault();
                                                setAutoSlug(!autoSlug);
                                            }}
                                        >
                                            {useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                                        </button>
                                    </div>
                                }
                            />
                            <Input
                                size="xs"
                                id={`boxes.${index}.label`}
                                register={register}
                                errors={errors}
                                defaultValue={box.label}
                                onChangeCapture={debounce(e => {
                                    onChangeLabel(e.target.value);
                                }, 300)}
                                onClick={e => {
                                    if(e.target.value === 'meta box title' || e.target.value === 'meta_box_title'){
                                        resetField(`boxes.${index}.label`);
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
                            <Label
                                size="xs"
                                id={`boxes.${index}.name`}
                                label={useTranslation("Name")}
                                isRequired={true}
                            />
                            <Input
                                size="xs"
                                id={`boxes.${index}.name`}
                                register={register}
                                errors={errors}
                                defaultValue={box.name}
                                onChangeCapture={e => {
                                    setValue(`boxes.${index}.name`, slugify(transliterate(e.target.value)));
                                    // A direct edit to the slug is a deliberate customization --
                                    // stop auto-syncing it from the label for the rest of this session.
                                    setAutoSlug(false);
                                }}
                                onClick={e => {
                                    if(e.target.value === 'meta_box_title'){
                                        resetField(`boxes.${index}.name`);
                                    }
                                }}
                                validate={{
                                    validate: {
                                        alphanumericallyValid,
                                        checkIfNameIsValid
                                    },
                                    required: useTranslation("This field is mandatory"),
                                    maxLength: {
                                        value: 255,
                                        message: "max length is 255"
                                    }
                                }}
                            />
                        </div>
                        <MetaBoxSettings box={box} index={index} />
                    </div>
                </div>
            </div>
            <div className="delete-element">
                <DeleteMetaBoxModal
                    index={index}
                    boxId={box.id}
                    onAfterDelete={() => dispatch(unsetActiveBox())}
                    trigger={
                        <Button size="sm" icon="bx:trash" className="w-100" style={styleVariants.OUTLINED_DANGER}>
                            {useTranslation("Delete box")}
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default BoxSettingsPanel;
