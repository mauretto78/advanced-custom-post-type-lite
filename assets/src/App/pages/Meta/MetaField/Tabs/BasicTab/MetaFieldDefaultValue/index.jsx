import React, {useState} from "react";
import PropTypes from 'prop-types';
import Label from "../../../../../../components/Forms/Label";
import useTranslation from "../../../../../../hooks/useTranslation";
import Input from "../../../../../../components/Forms/Input";
import {useFormContext, useWatch} from "react-hook-form";
import {fieldTypes} from "../../../../../../constants/fields";
import {isValidJSON} from "../../../../../../utils/strings";
import CodeMirror from '@uiw/react-codemirror';
import ColorPicker from "../../../../../../components/Forms/ColorPicker";
import Select from "../../../../../../components/Forms/Select";
import SelectMulti from "../../../../../../components/Forms/SelectMulti";
import CloneFieldModal from "../../../../Modal/CloneFieldModal";

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
    const [from, setFrom] = useState(defaultValue.from ? defaultValue.from : null);
    const [to, setTo] = useState(defaultValue.to ? defaultValue.to : null);
    const [url, setUrl] = useState(defaultValue.url ? defaultValue.url : null);
    const [urlLabel, setUrlLabel] = useState(defaultValue.urlLabel ? defaultValue.urlLabel : null);
    const [currencyValue, setCurrencyValue] = useState(defaultValue.currencyValue ? defaultValue.currencyValue : null);
    const [currency, setCurrency] = useState(defaultValue.currency ? defaultValue.currency : null);
    const [length, setLength] = useState(defaultValue.length ? defaultValue.length : null);
    const [lengthValue, setLengthValue] = useState(defaultValue.lengthValue ? defaultValue.lengthValue : null);
    const [weight, setWeight] = useState(defaultValue.weight ? defaultValue.weight : null);
    const [weightValue, setWeightValue] = useState(defaultValue.weightValue ? defaultValue.weightValue : null);

    const noShowFields = [
        fieldTypes.ICON,
        fieldTypes.TABLE,
        fieldTypes.REPEATER,
        fieldTypes.FLEXIBLE,
        fieldTypes.PASSWORD,
        fieldTypes.POST,
        fieldTypes.SELECT_MULTI,
        fieldTypes.SELECT,
        fieldTypes.RADIO,
        fieldTypes.CHECKBOX,
        fieldTypes.FILE,
        fieldTypes.IMAGE,
        fieldTypes.GALLERY,
        fieldTypes.VIDEO,
    ];

    /**
     *
     * @param isMulti
     * @param data
     * @return {*}
     */
    const relationObjectSelector = (isMulti, data) => {

        if(isMulti){
            return (
                <div className="container align-end">
                    <div className="col-12">
                        <Label
                            id={formId("defaultValue")}
                            label={useTranslation("The default value for this field")}
                        />
                        <SelectMulti
                            id={formId("defaultValue")}
                            register={register}
                            errors={errors}
                            placeholder={useTranslation("Default value")}
                            defaultValue={typeof defaultValue === 'object' ? defaultValue : null}
                            values={data}
                            clearErrors={clearErrors}
                            setValue={setValue}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Select
                        id={formId("defaultValue")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Default value")}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : null}
                        values={data}
                    />
                </div>
            </div>
        );
    };


    if(!field.type){
        return null;
    }

    // no show
    if(
        noShowFields.includes(field.type)
    ){
        return null;
    }

    // EMAIL
    if(field.type === fieldTypes.EMAIL){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
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
    }

    // DATE
    if(field.type === fieldTypes.DATE){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
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
    }

    // DATE_TIME
    if(field.type === fieldTypes.DATE_TIME){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        type="datetime-local"
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

    // TIME
    if(field.type === fieldTypes.TIME){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        type="time"
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

    // COLOR
    if(field.type === fieldTypes.COLOR){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <ColorPicker
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

    // HTML
    if(field.type === fieldTypes.HTML){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <CodeMirror
                        value={defaultValue}
                        height="250px"
                        editable={true}
                        theme="light"
                        onChange={(value) => {
                            setValue(formId("defaultValue"), value);
                        }}
                    />
                </div>
            </div>
        );
    }

    // RANGE
    if(field.type === fieldTypes.RANGE || field.type === fieldTypes.NUMBER){

        const min = (watchedAdvancedOptions && watchedAdvancedOptions[8] && watchedAdvancedOptions[8].value !== "") ? watchedAdvancedOptions[8].value : 1;
        const max = (watchedAdvancedOptions && watchedAdvancedOptions[9] && watchedAdvancedOptions[9].value !== "") ? watchedAdvancedOptions[9].value : 100;
        const step = (watchedAdvancedOptions && watchedAdvancedOptions[10] && watchedAdvancedOptions[10].value !== "") ? watchedAdvancedOptions[10].value : 1;

        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
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

    // RATING
    if(field.type === fieldTypes.RATING){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Select
                        type="number"
                        id={formId("defaultValue")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Default value")}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : null}
                        values={[
                            {label: "5.00/5.00", value: 10},
                            {label: "4.50/5.00", value: 9},
                            {label: "4.00/5.00", value: 8},
                            {label: "3.50/5.00", value: 7},
                            {label: "3.00/5.00", value: 6},
                            {label: "2.50/5.00", value: 5},
                            {label: "2.00/5.00", value: 4},
                            {label: "1.50/5.00", value: 3},
                            {label: "1.00/5.00", value: 2},
                            {label: "0.50/5.00", value: 1},
                        ]}
                    />
                </div>
            </div>
        );
    }

    // TOGGLE
    if(field.type === fieldTypes.TOGGLE){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <div className="toggle-group">
                        <label
                            className="toggle"
                            htmlFor={formId("defaultValue")}
                        >
                            <input
                                id={formId("defaultValue")}
                                name={formId("defaultValue")}
                                type="checkbox"
                                defaultChecked={defaultValue == 1}
                                onChangeCapture={e => {
                                    setValue(formId("defaultValue"), e.target.checked ? "1" : "0");
                                }}
                            />
                            <span className="slider round"/>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    // CURRENCY
    if(field.type === fieldTypes.CURRENCY){

        const currencies = document.globals.globals.uom.currency;

        return (
            <div className="container align-end">
                <div className="col-3">
                    <Label
                        id={formId("defaultValue_currency_value")}
                        label={useTranslation("The default value for this field")}
                    />
                    <input
                        id={formId("defaultValue_currency_value")}
                        name={formId("defaultValue_currency_value")}
                        type="number"
                        min={0.01}
                        step={0.01}
                        className={`form-control`}
                        defaultValue={currencyValue}
                        onChangeCapture={e => {
                            setCurrencyValue(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({currency: currency, currencyValue: e.target.value}));
                        }}
                    />
                </div>
                <div className="col-3">
                    <Label
                        id={formId("defaultValue_currency")}
                        label="&nbsp;"
                    />
                    <div className="acpt-select">
                        <select
                            id={formId("defaultValue_currency")}
                            name={formId("defaultValue_currency")}
                            placeholder={useTranslation("Currency")}
                            defaultValue={currency ? currency : "USD"}
                            className={`form-control`}
                            onChangeCapture={e => {
                                setCurrency(e.target.value);
                                setValue(formId("defaultValue"), JSON.stringify({currencyValue: currencyValue, currency: e.target.value}));
                            }}
                        >
                            {currencies && currencies.map((option, index) => (
                                <option
                                    key={index}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    // LENGTH
    if(field.type === fieldTypes.LENGTH){

        const lengths = document.globals.globals.uom.length;

        return (
            <div className="container align-end">
                <div className="col-3">
                    <Label
                        id={formId("defaultValue_length_value")}
                        label={useTranslation("The default value for this field")}
                    />
                    <input
                        id={formId("defaultValue_length_value")}
                        name={formId("defaultValue_length_value")}
                        type="number"
                        min={0.01}
                        step={0.01}
                        className={`form-control`}
                        defaultValue={lengthValue}
                        onChangeCapture={e => {
                            setLengthValue(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({length: length, lengthValue: e.target.value}));
                        }}
                    />
                </div>
                <div className="col-3">
                    <Label
                        id={formId("defaultValue_length")}
                        label="&nbsp;"
                    />
                    <div className="acpt-select">
                        <select
                            id={formId("defaultValue_length")}
                            name={formId("defaultValue_length")}
                            placeholder={useTranslation("Length")}
                            defaultValue={length ? length : " KILOMETER"}
                            className={`form-control`}
                            onChangeCapture={e => {
                                setLength(e.target.value);
                                setValue(formId("defaultValue"), JSON.stringify({lengthValue: lengthValue, length: e.target.value}));
                            }}
                        >
                            {lengths && lengths.map((option, index) => (
                                <option
                                    key={index}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    // WEIGHT
    if(field.type === fieldTypes.WEIGHT){

        const weights = document.globals.globals.uom.weight;

        return (
            <div className="container align-end">
                <div className="col-3">
                    <Label
                        id={formId("defaultValue_weight_value")}
                        label={useTranslation("From")}
                    />
                    <input
                        id={formId("defaultValue_weight_value")}
                        name={formId("defaultValue_weight_value")}
                        type="number"
                        min={0.01}
                        step={0.01}
                        className={`form-control`}
                        defaultValue={weightValue}
                        onChangeCapture={e => {
                            setWeightValue(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({weight: weight, weightValue: e.target.value}));
                        }}
                    />
                </div>
                <div className="col-3">
                    <Label
                        id={formId("defaultValue_currency")}
                        label="&nbsp;"
                    />
                    <div className="acpt-select">
                        <select
                            id={formId("defaultValue_weight")}
                            name={formId("defaultValue_weight")}
                            placeholder={useTranslation("Weight")}
                            defaultValue={weight ? weight : "KILOGRAM"}
                            className={`form-control`}
                            onChangeCapture={e => {
                                setWeight(e.target.value);
                                setValue(formId("defaultValue"), JSON.stringify({weightValue: weightValue, weight: e.target.value}));
                            }}
                        >
                            {weights && weights.map((option, index) => (
                                <option
                                    key={index}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    // DATE_RANGE
    if(field.type === fieldTypes.DATE_RANGE){
        return (
            <div className="container align-end">
                <div className="col-6">
                    <Label
                        id={formId("defaultValue_from")}
                        label={useTranslation("From")}
                    />
                    <input
                        id={formId("defaultValue_from")}
                        name={formId("defaultValue_from")}
                        type="date"
                        className={`form-control`}
                        defaultValue={from}
                        onChangeCapture={e => {
                            setFrom(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({to: to, from: e.target.value}));
                        }}
                    />
                </div>
                <div className="col-6">
                    <Label
                        id={formId("defaultValue_to")}
                        label={useTranslation("To")}
                    />
                    <input
                        id={formId("defaultValue_to")}
                        name={formId("defaultValue_to")}
                        type="date"
                        className={`form-control`}
                        defaultValue={to}
                        onChangeCapture={e => {
                            setTo(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({from: from , to: e.target.value}));
                        }}
                    />
                </div>
            </div>
        );
    }

    // URL
    if(field.type === fieldTypes.URL){
        return (
            <div className="container align-end">
                <div className="col-6">
                    <Label
                        id={formId("defaultValue_url")}
                        label={useTranslation("URL")}
                    />
                    <input
                        id={formId("defaultValue_url")}
                        name={formId("defaultValue_url")}
                        type="url"
                        className={`form-control`}
                        defaultValue={url}
                        onChangeCapture={e => {
                            setUrl(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({urlLabel: urlLabel, url: e.target.value}));
                        }}
                    />
                </div>
                <div className="col-6">
                    <Label
                        id={formId("defaultValue_url_label")}
                        label={useTranslation("Label")}
                    />
                    <input
                        id={formId("defaultValue_url_label")}
                        name={formId("defaultValue_url_label")}
                        type="text"
                        className={`form-control`}
                        defaultValue={urlLabel}
                        onChangeCapture={e => {
                            setUrlLabel(e.target.value);
                            setValue(formId("defaultValue"), JSON.stringify({url: url , urlLabel: e.target.value}));
                        }}
                    />
                </div>
            </div>
        );
    }

    // PHONE
    if(field.type === fieldTypes.PHONE){
        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Input
                        type="phone"
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

    // POST_OBJECT
    if(field.type === fieldTypes.POST_OBJECT || field.type === fieldTypes.POST_OBJECT_MULTI){
        const postTypes = document.globals.globals.find["POST_ID"];

        return relationObjectSelector(field.type === fieldTypes.POST_OBJECT_MULTI, postTypes);
    }

    // TERM_OBJECT
    if(field.type === fieldTypes.TERM_OBJECT || field.type === fieldTypes.TERM_OBJECT_MULTI){
        const terms = document.globals.globals.find["TERM_ID"];

        return relationObjectSelector(field.type === fieldTypes.TERM_OBJECT_MULTI, terms);
    }

    // USER
    if(field.type === fieldTypes.USER || field.type === fieldTypes.USER_MULTI){
        const users = document.globals.globals.find["USER_ID"];

        return relationObjectSelector(field.type === fieldTypes.USER_MULTI, users);
    }

    // COUNTRY
    if(field.type === fieldTypes.COUNTRY){

        const countries = [
            {
                label: "Afghanistan (‫افغانستان‬‎)",
                value: "Afghanistan (‫افغانستان‬‎)"
            }, {
                label: "Åland Islands (Åland)",
                value: "Åland Islands (Åland)"
            }, {
                label: "Albania (Shqipëri)",
                value: "Albania (Shqipëri)"
            }, {
                label: "Algeria (‫الجزائر‬‎)",
                value: "Algeria (‫الجزائر‬‎)"
            }, {
                label: "American Samoa",
                value: "American Samoa"
            }, {
                label: "Andorra",
                value: "Andorra"
            }, {
                label: "Angola",
                value: "Angola"
            }, {
                label: "Anguilla",
                value: "Anguilla"
            }, {
                label: "Antarctica",
                value: "Antarctica"
            }, {
                label: "Antigua and Barbuda",
                value: "Antigua and Barbuda"
            }, {
                label: "Argentina",
                value: "Argentina"
            }, {
                label: "Armenia (Հայաստան)",
                value: "Armenia (Հայաստան)"
            }, {
                label: "Aruba",
                value: "Aruba"
            }, {
                label: "Australia",
                value: "Australia"
            }, {
                label: "Austria (Österreich)",
                value: "Austria (Österreich)"
            }, {
                label: "Azerbaijan (Azərbaycan)",
                value: "Azerbaijan (Azərbaycan)"
            }, {
                label: "Bahamas",
                value: "Bahamas"
            }, {
                label: "Bahrain (‫البحرين‬‎)",
                value: "Bahrain (‫البحرين‬‎)"
            }, {
                label: "Bangladesh (বাংলাদেশ)",
                value: "Bangladesh (বাংলাদেশ)"
            }, {
                label: "Barbados",
                value: "Barbados"
            }, {
                label: "Belarus (Беларусь)",
                value: "Belarus (Беларусь)"
            }, {
                label: "Belgium (België)",
                value: "Belgium (België)"
            }, {
                label: "Belize",
                value: "Belize"
            }, {
                label: "Benin (Bénin)",
                value: "Benin (Bénin)"
            }, {
                label: "Bermuda",
                value: "Bermuda"
            }, {
                label: "Bhutan (འབྲུག)",
                value: "Bhutan (འབྲུག)"
            }, {
                label: "Bolivia",
                value: "Bolivia"
            }, {
                label: "Bosnia and Herzegovina (Босна и Херцеговина)",
                value: "Bosnia and Herzegovina (Босна и Херцеговина)"
            }, {
                label: "Botswana",
                value: "Botswana"
            }, {
                label: "Bouvet Island (Bouvetøya)",
                value: "Bouvet Island (Bouvetøya)"
            }, {
                label: "Brazil (Brasil)",
                value: "Brazil (Brasil)"
            }, {
                label: "British Indian Ocean Territory",
                value: "British Indian Ocean Territory"
            }, {
                label: "British Virgin Islands",
                value: "British Virgin Islands"
            }, {
                label: "Brunei",
                value: "Brunei"
            }, {
                label: "Bulgaria (България)",
                value: "Bulgaria (България)"
            }, {
                label: "Burkina Faso",
                value: "Burkina Faso"
            }, {
                label: "Burundi (Uburundi)",
                value: "Burundi (Uburundi)"
            }, {
                label: "Cambodia (កម្ពុជា)",
                value: "Cambodia (កម្ពុជា)"
            }, {
                label: "Cameroon (Cameroun)",
                value: "Cameroon (Cameroun)"
            }, {
                label: "Canada",
                value: "Canada"
            }, {
                label: "Cape Verde (Kabu Verdi)",
                value: "Cape Verde (Kabu Verdi)"
            }, {
                label: "Caribbean Netherlands",
                value: "Caribbean Netherlands"
            }, {
                label: "Cayman Islands",
                value: "Cayman Islands"
            }, {
                label: "Central African Republic (République Centrafricaine)",
                value: "Central African Republic (République Centrafricaine)"
            }, {
                label: "Chad (Tchad)",
                value: "Chad (Tchad)"
            }, {
                label: "Chile",
                value: "Chile"
            }, {
                label: "China (中国)",
                value: "China (中国)"
            }, {
                label: "Christmas Island",
                value: "Christmas Island"
            }, {
                label: "Cocos (Keeling) Islands (Kepulauan Cocos (Keeling))",
                value: "Cocos (Keeling) Islands (Kepulauan Cocos (Keeling))"
            }, {
                label: "Colombia",
                value: "Colombia"
            }, {
                label: "Comoros (‫جزر القمر‬‎)",
                value: "Comoros (‫جزر القمر‬‎)"
            }, {
                label: "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
                value: "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)"
            }, {
                label: "Congo (Republic) (Congo-Brazzaville)",
                value: "Congo (Republic) (Congo-Brazzaville)"
            }, {
                label: "Cook Islands",
                value: "Cook Islands"
            }, {
                label: "Costa Rica",
                value: "Costa Rica"
            }, {
                label: "Côte d’Ivoire",
                value: "Côte d’Ivoire"
            }, {
                label: "Croatia (Hrvatska)",
                value: "Croatia (Hrvatska)"
            }, {
                label: "Cuba",
                value: "Cuba"
            }, {
                label: "Curaçao",
                value: "Curaçao"
            }, {
                label: "Cyprus (Κύπρος)",
                value: "Cyprus (Κύπρος)"
            }, {
                label: "Czech Republic (Česká republika)",
                value: "Czech Republic (Česká republika)"
            }, {
                label: "Denmark (Danmark)",
                value: "Denmark (Danmark)"
            }, {
                label: "Djibouti",
                value: "Djibouti"
            }, {
                label: "Dominica",
                value: "Dominica"
            }, {
                label: "Dominican Republic (República Dominicana)",
                value: "Dominican Republic (República Dominicana)"
            }, {
                label: "Ecuador",
                value: "Ecuador"
            }, {
                label: "Egypt (‫مصر‬‎)",
                value: "Egypt (‫مصر‬‎)"
            }, {
                label: "El Salvador",
                value: "El Salvador"
            }, {
                label: "Equatorial Guinea (Guinea Ecuatorial)",
                value: "Equatorial Guinea (Guinea Ecuatorial)"
            }, {
                label: "Eritrea",
                value: "Eritrea"
            }, {
                label: "Estonia (Eesti)",
                value: "Estonia (Eesti)"
            }, {
                label: "Ethiopia",
                value: "Ethiopia"
            }, {
                label: "Falkland Islands (Islas Malvinas)",
                value: "Falkland Islands (Islas Malvinas)"
            }, {
                label: "Faroe Islands (Føroyar)",
                value: "Faroe Islands (Føroyar)"
            }, {
                label: "Fiji",
                value: "Fiji"
            }, {
                label: "Finland (Suomi)",
                value: "Finland (Suomi)"
            }, {
                label: "France",
                value: "France"
            }, {
                label: "French Guiana (Guyane française)",
                value: "French Guiana (Guyane française)"
            }, {
                label: "French Polynesia (Polynésie française)",
                value: "French Polynesia (Polynésie française)"
            }, {
                label: "French Southern Territories (Terres australes françaises)",
                value: "French Southern Territories (Terres australes françaises)"
            }, {
                label: "Gabon",
                value: "Gabon"
            }, {
                label: "Gambia",
                value: "Gambia"
            }, {
                label: "Georgia (საქართველო)",
                value: "Georgia (საქართველო)"
            }, {
                label: "Germany (Deutschland)",
                value: "Germany (Deutschland)"
            }, {
                label: "Ghana (Gaana)",
                value: "Ghana (Gaana)"
            }, {
                label: "Gibraltar",
                value: "Gibraltar"
            }, {
                label: "Greece (Ελλάδα)",
                value: "Greece (Ελλάδα)"
            }, {
                label: "Greenland (Kalaallit Nunaat)",
                value: "Greenland (Kalaallit Nunaat)"
            }, {
                label: "Grenada",
                value: "Grenada"
            }, {
                label: "Guadeloupe",
                value: "Guadeloupe"
            }, {
                label: "Guam",
                value: "Guam"
            }, {
                label: "Guatemala",
                value: "Guatemala"
            }, {
                label: "Guernsey",
                value: "Guernsey"
            }, {
                label: "Guinea (Guinée)",
                value: "Guinea (Guinée)"
            }, {
                label: "Guinea-Bissau (Guiné Bissau)",
                value: "Guinea-Bissau (Guiné Bissau)"
            }, {
                label: "Guyana",
                value: "Guyana"
            }, {
                label: "Haiti",
                value: "Haiti"
            }, {
                label: "Heard Island and Mcdonald Islands",
                value: "Heard Island and Mcdonald Islands"
            }, {
                label: "Honduras",
                value: "Honduras"
            }, {
                label: "Hong Kong (香港)",
                value: "Hong Kong (香港)"
            }, {
                label: "Hungary (Magyarország)",
                value: "Hungary (Magyarország)"
            }, {
                label: "Iceland (Ísland)",
                value: "Iceland (Ísland)"
            }, {
                label: "India (भारत)",
                value: "India (भारत)"
            }, {
                label: "Indonesia",
                value: "Indonesia"
            }, {
                label: "Iran (‫ایران‬‎)",
                value: "Iran (‫ایران‬‎)"
            }, {
                label: "Iraq (‫العراق‬‎)",
                value: "Iraq (‫العراق‬‎)"
            }, {
                label: "Ireland",
                value: "Ireland"
            }, {
                label: "Isle of Man",
                value: "Isle of Man"
            }, {
                label: "Israel (‫ישראל‬‎)",
                value: "Israel (‫ישראל‬‎)"
            }, {
                label: "Italy (Italia)",
                value: "Italy (Italia)"
            }, {
                label: "Jamaica",
                value: "Jamaica"
            }, {
                label: "Japan (日本)",
                value: "Japan (日本)"
            }, {
                label: "Jersey",
                value: "Jersey"
            }, {
                label: "Jordan (‫الأردن‬‎)",
                value: "Jordan (‫الأردن‬‎)"
            }, {
                label: "Kazakhstan (Казахстан)",
                value: "Kazakhstan (Казахстан)"
            }, {
                label: "Kenya",
                value: "Kenya"
            }, {
                label: "Kiribati",
                value: "Kiribati"
            }, {
                label: "Kosovo (Kosovë)",
                value: "Kosovo (Kosovë)"
            }, {
                label: "Kuwait (‫الكويت‬‎)",
                value: "Kuwait (‫الكويت‬‎)"
            }, {
                label: "Kyrgyzstan (Кыргызстан)",
                value: "Kyrgyzstan (Кыргызстан)"
            }, {
                label: "Laos (ລາວ)",
                value: "Laos (ລາວ)"
            }, {
                label: "Latvia (Latvija)",
                value: "Latvia (Latvija)"
            }, {
                label: "Lebanon (‫لبنان‬‎)",
                value: "Lebanon (‫لبنان‬‎)"
            }, {
                label: "Lesotho",
                value: "Lesotho"
            }, {
                label: "Liberia",
                value: "Liberia"
            }, {
                label: "Libya (‫ليبيا‬‎)",
                value: "Libya (‫ليبيا‬‎)"
            }, {
                label: "Liechtenstein",
                value: "Liechtenstein"
            }, {
                label: "Lithuania (Lietuva)",
                value: "Lithuania (Lietuva)"
            }, {
                label: "Luxembourg",
                value: "Luxembourg"
            }, {
                label: "Macau (澳門)",
                value: "Macau (澳門)"
            }, {
                label: "Macedonia (FYROM) (Македонија)",
                value: "Macedonia (FYROM) (Македонија)"
            }, {
                label: "Madagascar (Madagasikara)",
                value: "Madagascar (Madagasikara)"
            }, {
                label: "Malawi",
                value: "Malawi"
            }, {
                label: "Malaysia",
                value: "Malaysia"
            }, {
                label: "Maldives",
                value: "Maldives"
            }, {
                label: "Mali",
                value: "Mali"
            }, {
                label: "Malta",
                value: "Malta"
            }, {
                label: "Marshall Islands",
                value: "Marshall Islands"
            }, {
                label: "Martinique",
                value: "Martinique"
            }, {
                label: "Mauritania (‫موريتانيا‬‎)",
                value: "Mauritania (‫موريتانيا‬‎)"
            }, {
                label: "Mauritius (Moris)",
                value: "Mauritius (Moris)"
            }, {
                label: "Mayotte",
                value: "Mayotte"
            }, {
                label: "Mexico (México)",
                value: "Mexico (México)"
            }, {
                label: "Micronesia",
                value: "Micronesia"
            }, {
                label: "Moldova (Republica Moldova)",
                value: "Moldova (Republica Moldova)"
            }, {
                label: "Monaco",
                value: "Monaco"
            }, {
                label: "Mongolia (Монгол)",
                value: "Mongolia (Монгол)"
            }, {
                label: "Montenegro (Crna Gora)",
                value: "Montenegro (Crna Gora)"
            }, {
                label: "Montserrat",
                value: "Montserrat"
            }, {
                label: "Morocco (‫المغرب‬‎)",
                value: "Morocco (‫المغرب‬‎)"
            }, {
                label: "Mozambique (Moçambique)",
                value: "Mozambique (Moçambique)"
            }, {
                label: "Myanmar (Burma) (မြန်မာ)",
                value: "Myanmar (Burma) (မြန်မာ)"
            }, {
                label: "Namibia (Namibië)",
                value: "Namibia (Namibië)"
            }, {
                label: "Nauru",
                value: "Nauru"
            }, {
                label: "Nepal (नेपाल)",
                value: "Nepal (नेपाल)"
            }, {
                label: "Netherlands (Nederland)",
                value: "Netherlands (Nederland)"
            }, {
                label: "New Caledonia (Nouvelle-Calédonie)",
                value: "New Caledonia (Nouvelle-Calédonie)"
            }, {
                label: "New Zealand",
                value: "New Zealand"
            }, {
                label: "Nicaragua",
                value: "Nicaragua"
            }, {
                label: "Niger (Nijar)",
                value: "Niger (Nijar)"
            }, {
                label: "Nigeria",
                value: "Nigeria"
            }, {
                label: "Niue",
                value: "Niue"
            }, {
                label: "Norfolk Island",
                value: "Norfolk Island"
            }, {
                label: "North Korea (조선 민주주의 인민 공화국)",
                value: "North Korea (조선 민주주의 인민 공화국)"
            }, {
                label: "Northern Mariana Islands",
                value: "Northern Mariana Islands"
            }, {
                label: "Norway (Norge)",
                value: "Norway (Norge)"
            }, {
                label: "Oman (‫عُمان‬‎)",
                value: "Oman (‫عُمان‬‎)"
            }, {
                label: "Pakistan (‫پاکستان‬‎)",
                value: "Pakistan (‫پاکستان‬‎)"
            }, {
                label: "Palau",
                value: "Palau"
            }, {
                label: "Palestine (‫فلسطين‬‎)",
                value: "Palestine (‫فلسطين‬‎)"
            }, {
                label: "Panama (Panamá)",
                value: "Panama (Panamá)"
            }, {
                label: "Papua New Guinea",
                value: "Papua New Guinea"
            }, {
                label: "Paraguay",
                value: "Paraguay"
            }, {
                label: "Peru (Perú)",
                value: "Peru (Perú)"
            }, {
                label: "Philippines",
                value: "Philippines"
            }, {
                label: "Pitcairn Islands",
                value: "Pitcairn Islands"
            }, {
                label: "Poland (Polska)",
                value: "Poland (Polska)"
            }, {
                label: "Portugal",
                value: "Portugal"
            }, {
                label: "Puerto Rico",
                value: "Puerto Rico"
            }, {
                label: "Qatar (‫قطر‬‎)",
                value: "Qatar (‫قطر‬‎)"
            }, {
                label: "Réunion (La Réunion)",
                value: "Réunion (La Réunion)"
            }, {
                label: "Romania (România)",
                value: "Romania (România)"
            }, {
                label: "Russia (Россия)",
                value: "Russia (Россия)"
            }, {
                label: "Rwanda",
                value: "Rwanda"
            }, {
                label: "Saint Barthélemy (Saint-Barthélemy)",
                value: "Saint Barthélemy (Saint-Barthélemy)"
            }, {
                label: "Saint Helena",
                value: "Saint Helena"
            }, {
                label: "Saint Kitts and Nevis",
                value: "Saint Kitts and Nevis"
            }, {
                label: "Saint Lucia",
                value: "Saint Lucia"
            }, {
                label: "Saint Martin (Saint-Martin (partie française))",
                value: "Saint Martin (Saint-Martin (partie française))"
            }, {
                label: "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
                value: "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)"
            }, {
                label: "Saint Vincent and the Grenadines",
                value: "Saint Vincent and the Grenadines"
            }, {
                label: "Samoa",
                value: "Samoa"
            }, {
                label: "San Marino",
                value: "San Marino"
            }, {
                label: "São Tomé and Príncipe (São Tomé e Príncipe)",
                value: "São Tomé and Príncipe (São Tomé e Príncipe)"
            }, {
                label: "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
                value: "Saudi Arabia (‫المملكة العربية السعودية‬‎)"
            }, {
                label: "Senegal (Sénégal)",
                value: "Senegal (Sénégal)"
            }, {
                label: "Serbia (Србија)",
                value: "Serbia (Србија)"
            }, {
                label: "Seychelles",
                value: "Seychelles"
            }, {
                label: "Sierra Leone",
                value: "Sierra Leone"
            }, {
                label: "Singapore",
                value: "Singapore"
            }, {
                label: "Sint Maarten",
                value: "Sint Maarten"
            }, {
                label: "Slovakia (Slovensko)",
                value: "Slovakia (Slovensko)"
            }, {
                label: "Slovenia (Slovenija)",
                value: "Slovenia (Slovenija)"
            }, {
                label: "Solomon Islands",
                value: "Solomon Islands"
            }, {
                label: "Somalia (Soomaaliya)",
                value: "Somalia (Soomaaliya)"
            }, {
                label: "South Africa",
                value: "South Africa"
            }, {
                label: "South Georgia & South Sandwich Islands",
                value: "South Georgia & South Sandwich Islands"
            }, {
                label: "South Korea (대한민국)",
                value: "South Korea (대한민국)"
            }, {
                label: "South Sudan (‫جنوب السودان‬‎)",
                value: "South Sudan (‫جنوب السودان‬‎)"
            }, {
                label: "Spain (España)",
                value: "Spain (España)"
            }, {
                label: "Sri Lanka (ශ්‍රී ලංකාව)",
                value: "Sri Lanka (ශ්‍රී ලංකාව)"
            }, {
                label: "Sudan (‫السودان‬‎)",
                value: "Sudan (‫السودان‬‎)"
            }, {
                label: "Suriname",
                value: "Suriname"
            }, {
                label: "Svalbard and Jan Mayen (Svalbard og Jan Mayen)",
                value: "Svalbard and Jan Mayen (Svalbard og Jan Mayen)"
            }, {
                label: "Swaziland",
                value: "Swaziland"
            }, {
                label: "Sweden (Sverige)",
                value: "Sweden (Sverige)"
            }, {
                label: "Switzerland (Schweiz)",
                value: "Switzerland (Schweiz)"
            }, {
                label: "Syria (‫سوريا‬‎)",
                value: "Syria (‫سوريا‬‎)"
            }, {
                label: "Taiwan (台灣)",
                value: "Taiwan (台灣)"
            }, {
                label: "Tajikistan",
                value: "Tajikistan"
            }, {
                label: "Tanzania",
                value: "Tanzania"
            }, {
                label: "Thailand (ไทย)",
                value: "Thailand (ไทย)"
            }, {
                label: "Timor-Leste",
                value: "Timor-Leste"
            }, {
                label: "Togo",
                value: "Togo"
            }, {
                label: "Tokelau",
                value: "Tokelau"
            }, {
                label: "Tonga",
                value: "Tonga"
            }, {
                label: "Trinidad and Tobago",
                value: "Trinidad and Tobago"
            }, {
                label: "Tunisia (‫تونس‬‎)",
                value: "Tunisia (‫تونس‬‎)"
            }, {
                label: "Turkey (Türkiye)",
                value: "Turkey (Türkiye)"
            }, {
                label: "Turkmenistan",
                value: "Turkmenistan"
            }, {
                label: "Turks and Caicos Islands",
                value: "Turks and Caicos Islands"
            }, {
                label: "Tuvalu",
                value: "Tuvalu"
            }, {
                label: "Uganda",
                value: "Uganda"
            }, {
                label: "Ukraine (Україна)",
                value: "Ukraine (Україна)"
            }, {
                label: "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
                value: "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)"
            }, {
                label: "United Kingdom",
                value: "United Kingdom"
            }, {
                label: "United States",
                value: "United States"
            }, {
                label: "U.S. Minor Outlying Islands",
                value: "U.S. Minor Outlying Islands"
            }, {
                label: "U.S. Virgin Islands",
                value: "U.S. Virgin Islands"
            }, {
                label: "Uruguay",
                value: "Uruguay"
            }, {
                label: "Uzbekistan (Oʻzbekiston)",
                value: "Uzbekistan (Oʻzbekiston)"
            }, {
                label: "Vanuatu",
                value: "Vanuatu"
            }, {
                label: "Vatican City (Città del Vaticano)",
                value: "Vatican City (Città del Vaticano)"
            }, {
                label: "Venezuela",
                value: "Venezuela"
            }, {
                label: "Vietnam (Việt Nam)",
                value: "Vietnam (Việt Nam)"
            }, {
                label: "Wallis and Futuna",
                value: "Wallis and Futuna"
            }, {
                label: "Western Sahara (‫الصحراء الغربية‬‎)",
                value: "Western Sahara (‫الصحراء الغربية‬‎)"
            }, {
                label: "Yemen (‫اليمن‬‎)",
                value: "Yemen (‫اليمن‬‎)"
            }, {
                label: "Zambia",
                value: "Zambia"
            }, {
                label: "Zimbabwe",
                value: "Zimbabwe"
            }
        ];

        return (
            <div className="container align-end">
                <div className="col-12">
                    <Label
                        id={formId("defaultValue")}
                        label={useTranslation("The default value for this field")}
                    />
                    <Select
                        type="number"
                        id={formId("defaultValue")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Default value")}
                        defaultValue={typeof defaultValue === 'string' ? defaultValue : null}
                        values={countries}
                    />
                </div>
            </div>
        );
    }

    // CLONE
    if(field.type === fieldTypes.CLONE){
        return (
            <CloneFieldModal
                id={formId("defaultValue[]")}
                field={field}
            />
        );
    }

    // DEFAULT
    return (
        <div className="container align-end">
            <div className="col-12">
                <Label
                    id={formId("defaultValue")}
                    label={useTranslation("The default value for this field")}
                />
                <Input
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
};

MetaFieldDefaultValue.propTypes = {
    formId: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
};

export default MetaFieldDefaultValue;