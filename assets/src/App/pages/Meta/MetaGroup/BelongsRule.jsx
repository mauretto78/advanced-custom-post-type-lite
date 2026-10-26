import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {useFormContext, useWatch} from "react-hook-form";
import {Icon} from "@iconify/react";
import useTranslation from "../../../hooks/useTranslation.jsx";
import Tooltip from "../../../components/Tooltip/index.jsx";
import Select from "../../../components/Forms/Select.jsx";
import SelectMulti from "../../../components/Forms/SelectMulti.jsx";
import InputHidden from "../../../components/Forms/InputHidden.jsx";
import {metaTypes} from "../../../constants/metaTypes.jsx";
import {dangerColor} from "../../../utils/colors.jsx";
import LogicPill from "../../../components/Forms/LogicPill.jsx";
import OperatorPill from "../../../components/Forms/OperatorPill.jsx";
import {belongProps} from "../../../props/metaProps.js";

const VALUELESS = [metaTypes.USER, metaTypes.COMMENT];

const BELONGS_TO_FIND_KEY = {
    [metaTypes.CUSTOM_POST_TYPE]: 'customPostType',
    [metaTypes.TAXONOMY]:         'taxonomy',
    [metaTypes.USER]:             null,
    [metaTypes.COMMENT]:          null,
    [metaTypes.MEDIA]:            'media',
    'POST_STATUS':                'post_statuses',
    'POST_ID':                    'POST_ID',
    'PARENT_POST_ID':             'PARENT_POST_ID',
    'POST_CAT':                   'POST_CAT',
    'POST_TAX':                   'POST_TAX',
    'POST_TEMPLATE':              'POST_TEMPLATE',
    'POST_FORMAT':                'POST_FORMAT',
    'TERM_ID':                    'TERM_ID',
    'USER_ID':                    'USER_ID'
};

const LOGIC_CYCLE = ['AND', 'OR'];

const BelongsRule = ({belong, index, isLast, remove}) => {
    const find = document.globals.globals.find;
    const {control, register, resetField, setValue, clearErrors, formState: {errors}} = useFormContext();

    const watchedBelongsTo = useWatch({control, name: `belongs.${index}.belongsTo`});
    const watchedOperator  = useWatch({control, name: `belongs.${index}.operator`});
    const watchedLogic     = useWatch({control, name: `belongs.${index}.logic`});
    const watchedFind      = useWatch({control, name: `belongs.${index}.find`});

    const isValueless   = VALUELESS.includes(watchedBelongsTo);
    const paddingBottom = isLast ? 'pb-0' : 'pb-12';

    useEffect(() => {
        if (isLast) resetField(`belongs.${index}.logic`);
        else if (!watchedLogic) setValue(`belongs.${index}.logic`, 'AND');
    }, [isLast]);

    useEffect(() => {
        if (!isLast && !watchedLogic) setValue(`belongs.${index}.logic`, 'AND');
    }, []);

    useEffect(() => {
        if (watchedBelongsTo !== belong.belongsTo) {
            resetField(`belongs.${index}.find`);
            setValue(`belongs.${index}.find`, []);
        }
    }, [watchedBelongsTo]);

    useEffect(() => {
        if (!watchedOperator && !isValueless) setValue(`belongs.${index}.operator`, '=');
    }, [watchedOperator, isValueless]);

    useEffect(() => {
        if (isValueless) {
            register(`belongs.${index}.find`, {required: false});
            clearErrors(`belongs.${index}.find`);
        }
    }, [isValueless]);

    const valueOptions = useCallback(() => {
        if (!watchedBelongsTo || isValueless) return [];
        const key = BELONGS_TO_FIND_KEY[watchedBelongsTo];
        return key ? (find[key] ?? []) : [];
    }, [watchedBelongsTo, isValueless]);

    const isMulti    = watchedOperator === 'IN' || watchedOperator === 'NOT_IN';
    const isDisabled = !watchedBelongsTo || isValueless;

    const findDefaultValues = () => {
        if (!watchedFind) return [];
        if (typeof watchedFind === 'string') return watchedFind.split(',');
        return watchedFind;
    };

    const handleLogicCycle = () => {
        const next = LOGIC_CYCLE[(LOGIC_CYCLE.indexOf(watchedLogic) + 1) % LOGIC_CYCLE.length];
        setValue(`belongs.${index}.logic`, next);
    };

    const ruleOptions = [
        {value: null, label: useTranslation('Select')},
        {
            label: useTranslation('Posts'),
            options: [
                {value: metaTypes.CUSTOM_POST_TYPE, label: useTranslation('Post type')},
                {value: 'POST_ID',                  label: useTranslation('Post')},
                {value: 'PARENT_POST_ID',           label: useTranslation('Post parent')},
                {value: 'POST_CAT',                 label: useTranslation('Post category')},
                {value: 'POST_TAX',                 label: useTranslation('Post taxonomy')},
                {value: 'POST_TEMPLATE',            label: useTranslation('Post template')},
                {value: 'POST_FORMAT',              label: useTranslation('Post format')},
            ],
        },
        {
            label: useTranslation('Taxonomies'),
            options: [
                {value: metaTypes.TAXONOMY, label: useTranslation('Taxonomy')},
                {value: 'TERM_ID',          label: useTranslation('Term')},
            ],
        },
        {
            label: useTranslation('Attachment'),
            options: [
                {value: metaTypes.MEDIA, label: useTranslation('Attachment')},
            ],
        },
        {
            label: useTranslation('Comments'),
            options: [
                {value: metaTypes.COMMENT, label: useTranslation('All comments')},
            ],
        },
        {
            label: useTranslation('Users'),
            options: [
                {value: metaTypes.USER,  label: useTranslation('All users')},
                {value: 'USER_ID',       label: useTranslation('User')},
            ],
        },
    ];

    return (
        <tr>
            <td className="hidden">
                <InputHidden register={register} id={`belongs.${index}.id`} value={belong.id} />
            </td>
            <td className={`pl-0 pt-0 ${paddingBottom} pr-12`}>
                <Select
                    register={register}
                    id={`belongs.${index}.belongsTo`}
                    values={ruleOptions}
                    errors={errors}
                    onChangeCapture={() => {
                        resetField(`belongs.${index}.find`);
                        setValue(`belongs.${index}.find`, []);
                    }}
                    validate={{required: useTranslation("This field is mandatory")}}
                />
            </td>
            <td className={`text-center pl-0 pt-0 ${paddingBottom} pr-12`}>
                <OperatorPill
                    disabled={isValueless}
                    value={watchedOperator}
                    operators={['=', '!=', 'IN', 'NOT_IN']}
                    onClick={(next) => setValue(`belongs.${index}.operator`, next)}
                />
            </td>
            <td className={`pl-0 pt-0 ${paddingBottom} pr-12`}>
                {isValueless ? (
                    <Select
                        register={register}
                        id={`belongs.${index}.find`}
                        values={[{value: null, label: '—'}]}
                        errors={errors}
                        disabled={true}
                        validate={undefined}
                    />
                ) : isMulti ? (
                    <SelectMulti
                        register={register}
                        id={`belongs.${index}.find`}
                        values={isDisabled ? [] : valueOptions()}
                        errors={errors}
                        disabled={isDisabled}
                        validate={isValueless ? undefined : {required: useTranslation("This field is mandatory")}}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        defaultValue={findDefaultValues()}
                    />
                ) : (
                    <Select
                        register={register}
                        id={`belongs.${index}.find`}
                        values={isDisabled
                            ? [{value: null, label: useTranslation('Select a location first')}]
                            : valueOptions()
                        }
                        errors={errors}
                        disabled={isDisabled}
                        validate={isValueless ? undefined : {required: useTranslation("This field is mandatory")}}
                    />
                )}
            </td>
            <td className={`pl-0 pt-0 ${paddingBottom} pr-12`} style={{minWidth: '80px', verticalAlign: 'middle'}}>
                {!isLast && (
                    <LogicPill value={watchedLogic} onClick={handleLogicCycle} />
                )}
            </td>
            <td className={`pl-0 pt-0 ${paddingBottom} pr-0`} style={{verticalAlign: 'middle', textAlign: 'center'}}>
                <button type="button" className="btn-reset" aria-label={useTranslation("Delete")} onClick={e => {e.preventDefault(); remove(index);}}>
                    <Tooltip
                        icon={false}
                        tip={useTranslation("Delete")}
                        label={<Icon icon="bx-trash" width={16} color={dangerColor()} />}
                    />
                </button>
            </td>
        </tr>
    );
};

BelongsRule.propTypes = {
    belong: PropTypes.shape(belongProps).isRequired,
    index:  PropTypes.number.isRequired,
    isLast: PropTypes.bool.isRequired,
    remove: PropTypes.func.isRequired,
};

export default BelongsRule;
