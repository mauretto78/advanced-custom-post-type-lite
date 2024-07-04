import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";
import {styleVariants} from "../../constants/styles";
import Alert from "../Alert";
import BelongCondition from "./BelongCondition";
import {isEmpty} from "../../utils/objects";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const BelongConditions = ({id, control, register, handleAddBelong, handleDeleteBelong, conditions, values, errors, resetField, setValue, clearErrors, format='all'}) => {

    // auto-animate
    const [parent] = useAutoAnimate();

    return (
        <React.Fragment>
            <div
                className={`mb-12 ${!isEmpty(values) && conditions && conditions.length > 0 ? "flex-column s-12" : ""}`}
                ref={parent}
            >
                {!isEmpty(values) && conditions && conditions.length > 0 ? (
                    <React.Fragment>
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
                    </React.Fragment>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation("No conditions are present, click on \"Add condition\" button to add the first one.")}
                    </Alert>
                )}
            </div>
            <Button
                type="button"
                style={styleVariants.SECONDARY}
                onClick={() => {
                    handleAddBelong()
                }}
            >
                {useTranslation("Add condition")}
            </Button>
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