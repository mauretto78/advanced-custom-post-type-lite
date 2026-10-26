import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../../../hooks/useTranslation.jsx";
import {sluggifyString} from "../../../../../utils/strings.jsx";
import FieldPanelElement from "./FieldPanelElement.jsx";

const FieldPanelGroup = ({group, search}) => {

    /**
     *
     * @returns {{label?: string, value?: string}[]}
     */
    const filtered = () => {
        if (!search) return group.options;
        return group.options.filter(f => f.label.toLowerCase().includes(search.toLowerCase()));
    };

    if (filtered().length === 0) return null;

    return (
        <div>
            <h3 className="mb-12">
                {useTranslation(group.label)}
            </h3>
            <div
                className="grid grid-2 s-12"
                data-testid={`field-panel-group-${sluggifyString(group.label)}`}
            >
                {filtered().map((field) => (
                    <FieldPanelElement
                        key={field.label}
                        field={field}
                    />
                ))}
            </div>
        </div>
    );
};

FieldPanelGroup.propTypes = {
    search: PropTypes.string,
    group: PropTypes.shape({
        options: PropTypes.arrayOf(PropTypes.shape({
            label:  PropTypes.string.isRequired,
            value:  PropTypes.string.isRequired,
        })).isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired
};

export default FieldPanelGroup;
