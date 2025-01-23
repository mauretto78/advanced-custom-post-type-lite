import React from "react";
import PropTypes from 'prop-types';
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../../utils/scroll";
import {styleVariants} from "../../../../constants/styles";
import Badge from "../../../../components/Badge";

const QuickNavigationField = ({field, index}) => {

    const { control } = useFormContext();
    const watchedBoxName = useWatch({
        control,
        name: `fields.${index}.name`
    });

    return (
        <React.Fragment>
            <div className="tree-el flex-between s-8" style={{"--level": 0}}>
                <span
                    className="text-ellipsis cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`${field.id}`);
                    }}
                >
                    {watchedBoxName ? watchedBoxName : field.name}
                </span>
                <Badge style={styleVariants.SECONDARY}>
                    F
                </Badge>
            </div>
        </React.Fragment>
    );
};

QuickNavigationField.propTypes = {
    field: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default QuickNavigationField;