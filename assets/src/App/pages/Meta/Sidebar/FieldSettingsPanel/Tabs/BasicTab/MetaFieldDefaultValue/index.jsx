import { useState } from "react";
import PropTypes from 'prop-types';
import Label from "../../../../../../../components/Forms/Label";
import useTranslation from "../../../../../../../hooks/useTranslation";
import Input from "../../../../../../../components/Forms/Input";
import {useFormContext, useWatch} from "react-hook-form";
import {fieldTypes} from "../../../../../../../constants/fields";
import {isValidJSON} from "../../../../../../../utils/strings";
import Select from "../../../../../../../components/Forms/Select";
import SelectMulti from "../../../../../../../components/Forms/SelectMulti";
import {metaFieldProps} from "../../../../../../../props/metaProps.js";

const MetaFieldDefaultValue = ({formId, field}) => {
    // manage form state
    const { register, control, formState: {errors}, setValue, clearErrors } = useFormContext();

    const watchedAdvancedOptions = useWatch({
        control,
        name: formId("advancedOptions")
    });

    const watchedDefaultValue = useWatch({
        control,
        name: formId("defaultValue")
    });

    const watchedRelations = useWatch({
        control,
        name: formId("relations")
    });

    /**
     *
     * @return {any}
     */
    const getDefaultValue = () => {
        if(isValidJSON(field.defaultValue)){
            return JSON.parse(field.defaultValue);
        }

        return field.defaultValue
    };

    // manage local state
    const defaultValue = getDefaultValue();
    const [mediaValue, setMediaValue] = useState(defaultValue);
    const [from, setFrom] = useState(defaultValue && defaultValue.from ? defaultValue.from : null);
    const [to, setTo] = useState(defaultValue && defaultValue.to ? defaultValue.to : null);
    const [url, setUrl] = useState(defaultValue && defaultValue.url ? defaultValue.url : null);
    const [urlLabel, setUrlLabel] = useState(defaultValue && defaultValue.urlLabel ? defaultValue.urlLabel : null);
    const [currencyValue, setCurrencyValue] = useState(defaultValue && defaultValue.currencyValue ? defaultValue.currencyValue : null);
    // BUG FIX: currency/length/weight used to default their state to `null` while
    // their own <select> below defaults its *displayed* DOM value to "USD"/
    // "KILOMETER"/"KILOGRAM" (`defaultValue={currency ? currency : "USD"}` etc.) --
    // so a user who typed only the numeric amount/length/weight and never touched
    // the unit dropdown got a silently wrong saved value (`{"currency":null,...}`)
    // even though the UI visibly showed "USD" selected. Seeding the state with the
    // same fallback the select displays keeps the two in sync from first render.
    const [currency, setCurrency] = useState(defaultValue && defaultValue.currency ? defaultValue.currency : "USD");
    const [length, setLength] = useState(defaultValue && defaultValue.length ? defaultValue.length : "KILOMETER");
    const [lengthValue, setLengthValue] = useState(defaultValue && defaultValue.lengthValue ? defaultValue.lengthValue : null);
    const [weight, setWeight] = useState(defaultValue && defaultValue.weight ? defaultValue.weight : "KILOGRAM");
    const [weightValue, setWeightValue] = useState(defaultValue && defaultValue.weightValue ? defaultValue.weightValue : null);

    const noShowFields = [fieldTypes.SELECT];


    if(!field.type){
        return null;
    }

    // no show
    if(
        noShowFields.includes(field.type)
    ){
        return null;
    }

    switch (field.type) {
    // EMAIL
    case fieldTypes.EMAIL:
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        size="xs"
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        size="xs"
                        type="email"
                        id={formId("defaultValue")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Default value")}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : null}
                        validate={{
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </div>
            </div>
        );
    // DATE
    case fieldTypes.DATE:
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        size="xs"
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        size="xs"
                        type="date"
                        id={formId("defaultValue")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Default value")}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : null}
                        validate={{
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </div>
            </div>
        );
    // DEFAULT
    default:
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        size="xs"
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        size="xs"
                        id={formId("defaultValue")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Default value")}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : null}
                        validate={{
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
};

MetaFieldDefaultValue.propTypes = {
    formId: PropTypes.func.isRequired,
    field: PropTypes.shape(metaFieldProps).isRequired,
};

export default MetaFieldDefaultValue;