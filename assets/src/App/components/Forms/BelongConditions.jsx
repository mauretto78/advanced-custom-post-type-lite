import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";
import {styleVariants} from "../../constants/styles";
import BelongCondition from "./BelongCondition";
import {isEmpty} from "../../utils/objects";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const BelongConditions = ({id, control, register, handleAddBelong, handleDeleteBelong, conditions, values, errors, resetField, setValue, clearErrors, format='all'}) => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;
    const globals = documentGlobals.globals;

    // auto-animate
    const [parent] = useAutoAnimate();

    return (
        <React.Fragment>
            <div className={`${!isEmpty(values) && conditions && conditions.length > 0 ? "flex-column s-12" : ""}`}>
                <label className="form-label px-24">
                    {useTranslation("Location")}
                </label>
                {!isEmpty(values) && conditions && conditions.length > 0 ? (
                    <div className="responsive">
                        <table className={`acpt-table ${globals.is_rtl ? 'rtl' : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        {useTranslation("Location")}
                                    </th>
                                    <th style={{maxWidth: "100px"}}>
                                        {useTranslation("Condition")}
                                    </th>
                                    <th>
                                        {useTranslation("Value")}
                                    </th>
                                    <th style={{maxWidth: "100px"}}>
                                        {useTranslation("Logic")}
                                    </th>
                                    <th/>
                                </tr>
                            </thead>
                            <tbody ref={parent}>
                                {conditions.map((belong, belongIndex) => (
                                    <BelongCondition
                                        id={id}
                                        format={format}
                                        register={register}
                                        errors={errors}
                                        control={control}
                                        belong={belong}
                                        index={belongIndex}
                                        handleDeleteBelong={handleDeleteBelong}
                                        values={values}
                                        isLast={belongIndex === (conditions.length-1)}
                                        resetField={resetField}
                                        setValue={setValue}
                                        clearErrors={clearErrors}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="b-top-1 p-24">
                            <Button
                                type="button"
                                style={styleVariants.SECONDARY}
                                onClick={() => {
                                    handleAddBelong()
                                }}
                            >
                                {useTranslation("Add condition")}
                            </Button>
                        </div>
                    </div>

                ) : (
                    <div className="m-24 b-maxi b-rounded p-24 flex-column s-8 text-center">
                        <span>
                            {useTranslation("No conditions are present, click on \"Add condition\" button to add the first one.")}
                        </span>
                        <div>
                            <Button
                                type="button"
                                style={styleVariants.SECONDARY}
                                onClick={() => {
                                    handleAddBelong()
                                }}
                            >
                                {useTranslation("Add condition")}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    )
};

BelongConditions.propTypes = {
    id: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    append: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    unregister: PropTypes.func.isRequired,
    resetField: PropTypes.func.isRequired,
    conditions: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    handleDeleteBelong: PropTypes.func.isRequired,
    handleAddBelong: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    format: PropTypes.oneOf([
        'all',
        'reduced',
    ]),
};

export default BelongConditions;