import React from "react";
import PropTypes from 'prop-types';
import Badge from "../../../components/Badge";
import {styleVariants} from "../../../constants/styles";
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../utils/scroll";
import {getFormId} from "../../../utils/fields";
import {useSelector} from "react-redux";

const QuickNavigationField = ({level, boxId, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const watchedFieldName = useWatch({
        control,
        name: `${getFormId(group.boxes, boxId, field.id)}.name`
    });

    return (
        <React.Fragment>
            <div key={field.id} className={`tree-el flex-between s-8`} style={{"--level": level}}>
                <span
                    className={`cursor-pointer text-ellipsis`}
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`${field.id}`);
                    }}
                >
                    {watchedFieldName ? watchedFieldName : field.name}
                </span>
                <Badge style={styleVariants.SECONDARY}>
                    C
                </Badge>
            </div>
        </React.Fragment>
    );
};

QuickNavigationField.propTypes = {
    level: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
};

export default QuickNavigationField;