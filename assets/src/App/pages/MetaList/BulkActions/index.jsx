import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";

const BulkActions = () => {

    // manage form state
    const { control, register } = useFormContext();
    const watchedElements = useWatch({
        control,
        name: "elements"
    });

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
        <div className="flex-between s-8 mb-24">
            <span>
                {count()} {useTranslation("Selected items")}
            </span>
            <div className="i-flex-center s-8">
                <select
                    name="action"
                    className="form-control sm"
                    {...register("action")}
                >
                    <option value="">{useTranslation("Select")}</option>
                    <option value="delete">{useTranslation("Delete")}</option>
                </select>
                <Button
                    style={styleVariants.WHITE}
                    size="sm"
                >
                    {useTranslation("Execute")}
                </Button>
            </div>
        </div>
    );
};

export default BulkActions;