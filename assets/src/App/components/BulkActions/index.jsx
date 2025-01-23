import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";
import {styleVariants} from "../../constants/styles";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {hiddenElements} from "../../utils/localStorage";
import PropTypes from "prop-types";
import RestoreElementsModal from "./Modal/RestoreElementsModal";

const BulkActions = ({belongsTo}) => {

    const hiddenElms = hiddenElements(belongsTo);

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const { control, register } = useFormContext();
    const watchedElements = useWatch({
        control,
        name: "elements"
    });

    /**
     *
     * @return {boolean}
     */
    const showBulkActions = () => {

        if(!watchedElements){
            return false;
        }

        for (const [key, value] of Object.entries(watchedElements)) {
            if(value === true){
                return true;
            }
        }

        return false;
    };

    /**
     *
     * @return {number}
     */
    const count = () => {

        let count = 0;

        for (const [key, value] of Object.entries(watchedElements)) {
            if(value === true){
                count++;
            }
        }

        return count;
    };

    return (
        <div ref={parent}>
            {hiddenElms && hiddenElms.length > 0 && (
                <RestoreElementsModal belongsTo={belongsTo} />
            )}
            {showBulkActions() && (
                <div
                    className="flex-between s-8 mb-24"
                    data-cy="bulk-actions"
                >
                    <span>
                        {count()} {useTranslation("Selected items")}
                    </span>
                    <div className="i-flex-center s-8">
                        <select
                            name="action"
                            data-cy="cpt-bulk-actions"
                            className="form-control sm"
                            {...register("action")}
                        >
                            <option value="">{useTranslation("Select")}</option>
                            <option value="delete">{useTranslation("Delete")}</option>
                            <option value="duplicate">{useTranslation("Duplicate")}</option>
                            <option value="hide">{useTranslation("Hide")}</option>
                        </select>
                        <Button
                            testId="cpt-bulk-actions"
                            style={styleVariants.WHITE}
                            size="sm"
                        >
                            {useTranslation("Execute")}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

BulkActions.propTypes = {
    belongsTo: PropTypes.string.isRequired,
};

export default BulkActions;