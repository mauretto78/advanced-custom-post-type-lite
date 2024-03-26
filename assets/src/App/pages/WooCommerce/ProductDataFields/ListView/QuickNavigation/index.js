import React from "react";
import PropTypes from 'prop-types';
import QuickNavigationField from "./QuickNavigationField";
import useTranslation from "../../../../../hooks/useTranslation";

const QuickNavigation = ({fields}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    if(fields.length === 0){
        return null;
    }

    return (
        <div className="b-rounded with-shadow bg-white p-24">
            <h3 className="mb-24 flex-between s-8">
                <span className="text-ellipsis cursor-pointer">
                    {useTranslation("product data fields")}
                </span>
            </h3>
            <div className={`tree ${globals.is_rtl === true ? `rtl` : ``}`}>
                {fields.map((field, index) => (
                    <QuickNavigationField
                        index={index}
                        field={field}
                    />
                ))}
            </div>
        </div>
    );
};

QuickNavigation.propTypes = {
    fields: PropTypes.array.isRequired,
};

export default QuickNavigation;