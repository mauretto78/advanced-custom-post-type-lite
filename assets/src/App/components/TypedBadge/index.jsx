import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {styleVariants} from "../../constants/styles";
import {fieldTypes} from "../../constants/fields.jsx";

const TypedBadge = ({item, hidden = false, isDragging = false, mode}) => {

    const {type, label} = item;

    const resolveStyle = () => {
        // Basic text/input types
        if ([fieldTypes.TEXT, fieldTypes.TEXTAREA].includes(type)) {
            return styleVariants.DEFAULT;
        }

        // Specialized types
        if ([fieldTypes.EMAIL].includes(type)) {
            return styleVariants.ACCENT;
        }

        // Boolean / choice types
        if ([fieldTypes.SELECT].includes(type)) {
            return styleVariants.SECONDARY;
        }

        // Date & time types
        if ([fieldTypes.DATE].includes(type)) {
            return styleVariants.WARNING;
        }

        return styleVariants.DEFAULT;
    };

    const resolveIcon = () => {
        switch (type) {
        case fieldTypes.TEXT:               return 'mdi:format-text';
        case fieldTypes.TEXTAREA:           return 'mdi:text-box-outline';
        case fieldTypes.SELECT:             return 'mdi:chevron-down-box-outline';
        case fieldTypes.DATE:               return 'mdi:calendar-outline';
        case fieldTypes.EMAIL:              return 'mdi:email-outline';
        default:                            return 'mdi:form-textbox';
        }
    };

    if (mode === 'overlay' || mode === 'dragging') {
        return (
            <div
                className={`acpt-badge acpt-badge-${resolveStyle()} m-0 z-index-top cursor-move with-shadow`}
                style={{width: "150px"}}
            >
                <span className="flex-between">
                    <span className="text-ellipsis">{label}</span>
                    <Icon icon={resolveIcon()} width={18} />
                </span>
            </div>
        );
    }

    return (
        <div className={`acpt-badge acpt-badge-${resolveStyle()} m-0 z-index-top ${hidden ? "hidden" : "block"} cursor-move ${isDragging ? 'with-border' : ''}`}>
            <div className="flex-between">
                <span className="text-ellipsis">{label}</span>
                <Icon icon={resolveIcon()} width={18} />
            </div>
        </div>
    );
};

TypedBadge.propTypes = {
    item: PropTypes.shape({
        type:  PropTypes.oneOf([...Object.values(fieldTypes)]).isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
    hidden:     PropTypes.bool,
    isDragging: PropTypes.bool,
    mode: PropTypes.oneOf(['overlay', 'dragging']),
};

export default TypedBadge;