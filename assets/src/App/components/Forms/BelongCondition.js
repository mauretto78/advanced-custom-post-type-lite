import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import Select from "./Select";
import useTranslation from "../../hooks/useTranslation";
import InputHidden from "./InputHidden";
import {Icon} from "@iconify/react";
import {metaTypes} from "../../constants/metaTypes";
import {useWatch} from "react-hook-form";
import {useSelector} from "react-redux";
import SelectMulti from "./SelectMulti";
import Tooltip from "../Tooltip";

const BelongCondition = ({id, control, register, errors, belong, handleDeleteBelong, values, isLast, index, resetField, setValue, clearErrors, format = 'all'}) => {

    // manage global state
    const {data: group} = useSelector(state => state.fetchMeta);

    const formId = (value) => {
        return `${id}.${index}.${value}`;
    };

    const watchedBelongsTo = useWatch({
        control,
        name: formId("belongsTo")
    });

    const watchedOperator = useWatch({
        control,
        name: formId("operator")
    });

    const watchedFind = useWatch({
        control,
        name: formId("find")
    });

    useEffect(() => {
        if(isLast){
            resetField(formId("logic"));
        }
    }, [isLast]);

    useEffect(() => {
        if(watchedBelongsTo !== belong.belongsTo){
            resetField(formId("find"));
        }
    }, [watchedBelongsTo]);

    /**
     *
     * @return {*[]|*}
     */
    const findValues = () => {

        if(watchedBelongsTo){
            return values[watchedBelongsTo] ? values[watchedBelongsTo] : [];
        }

        if(group.belongs && group.belongs[index]){
            return values[group.belongs[index].belongsTo] ? values[group.belongs[index].belongsTo] : [];
        }

        return [];
    };

    /**
     *
     * @return {string|array}
     */
    const findDefaultValues = () => {

        if(watchedFind){
            if(typeof watchedFind === 'string'){
                return watchedFind.split(",");
            }

            return watchedFind;
        }

        return [];
    };

    /**
     *
     * @return {[{label: *, value: null}, {options: [{label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}], label: *}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}, {options: [{label: *, value: string}], label: *}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}]|[{label: *, value: null}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}]}
     */
    const belongsTo = () => {

        if(format === 'reduced'){
            return [
                {value: null, label: useTranslation("Select")},
                {
                    label: useTranslation("Posts"),
                    options: [
                        {value: metaTypes.CUSTOM_POST_TYPE, label: useTranslation("Post type")},
                        {value: "POST_ID", label: useTranslation("Post")},
                    ]
                },
                {
                    label: useTranslation("Taxonomies"),
                    options: [
                        {value: metaTypes.TAXONOMY, label: useTranslation("Taxonomy")},
                        {value: "TERM_ID", label: useTranslation("Term")},
                    ]
                },
            ];
        }

        return [
            {value: null, label: useTranslation("Select")},
            {
                label: useTranslation("Posts"),
                options: [
                    {value: metaTypes.CUSTOM_POST_TYPE, label: useTranslation("Post type")},
                    {value: "POST_ID", label: useTranslation("Post")},
                    {value: "POST_CAT", label: useTranslation("Post category")},
                    {value: "POST_TAX", label: useTranslation("Post taxonomy")},
                    {value: "POST_TEMPLATE", label: useTranslation("Post template")},
                ]
            },
            {
                label: useTranslation("Taxonomies"),
                options: [
                    {value: metaTypes.TAXONOMY, label: useTranslation("Taxonomy")},
                    {value: "TERM_ID", label: useTranslation("Term")},
                ]
            },
            {
                label: useTranslation("Option pages"),
                options: [
                    {value: metaTypes.OPTION_PAGE, label: useTranslation("Option page")},
                ]
            },
            {
                label: useTranslation("Users"),
                options: [
                    {value: metaTypes.USER, label: useTranslation("All users")},
                    {value: "USER_ID", label: useTranslation("User")},
                ]
            },
        ];
    };

    const operators = [
        {value: null, label: useTranslation("Select")},
        { value: "=", label: useTranslation('is equal to') },
        { value: "!=", label: useTranslation('is not equal to') },
        { value:"IN", label: useTranslation("is included in") },
        { value:"NOT_IN", label: useTranslation("is not included in") },
    ];

    const logics = [
        {value: null, label: useTranslation("Select")},
        {label:useTranslation("AND"), value:"AND"},
        {label:useTranslation("OR"), value:"OR"},
    ];

    /**
     *
     * @return {boolean}
     */
    const isDisabled = () => {

        if(watchedBelongsTo === metaTypes.USER){
            return true;
        }

        return !watchedBelongsTo;
    };

    /**
     *
     * @return {{required: *}}
     */
    const validate = () => {
        if(watchedBelongsTo === metaTypes.USER){
            return {
                required: false
            };
        }

        return {
            required: useTranslation("This field is mandatory"),
        };
    };

    return (
        <div id={belong.id} className="i-flex-center s-8">
            <InputHidden
                register={register}
                id={formId("id")}
                value={belong.id}
            />
            <div className="w-100">
                <Select
                    register={register}
                    id={formId("belongsTo")}
                    values={belongsTo()}
                    errors={errors}
                    onChangeCapture={() => {
                        resetField(formId("find"));
                        setValue(formId("find"), []);
                    }}
                    validate={{
                        required: useTranslation("This field is mandatory"),
                    }}
                />
            </div>
            <div className="w-40">
                <Select
                    muted={true}
                    register={register}
                    id={formId("operator")}
                    values={operators}
                    defaultValue="="
                    errors={errors}
                    disabled={isDisabled()}
                    validate={validate()}
                />
            </div>
            <div className="w-100">
                {watchedOperator === 'IN' || watchedOperator === 'NOT_IN' ? (
                    <SelectMulti
                        register={register}
                        id={formId("find")}
                        values={findValues()}
                        errors={errors}
                        disabled={isDisabled()}
                        validate={validate()}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        defaultValue={findDefaultValues()}
                    />
                ) : (
                    <Select
                        register={register}
                        id={formId("find")}
                        values={findValues()}
                        errors={errors}
                        disabled={isDisabled()}
                        validate={validate()}
                    />
                )}
            </div>
            <div className="w-40">
                {!isLast && (
                    <Select
                        muted={true}
                        register={register}
                        id={formId("logic")}
                        values={logics}
                        errors={errors}
                        validate={{
                            required: useTranslation("This field is mandatory"),
                        }}
                    />
                )}
            </div>
            <div>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        handleDeleteBelong(index, belong.id);
                    }}
                >
                    <Tooltip
                        icon={false}
                        tip={useTranslation("Delete")}
                        label={<Icon icon="bx-minus"/>}
                    />
                </a>
            </div>
        </div>
    );
};

BelongCondition.propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    belong: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    handleDeleteBelong: PropTypes.func.isRequired,
    resetField: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    format: PropTypes.oneOf([
        'all',
        'reduced',
    ]),
};

export default BelongCondition;