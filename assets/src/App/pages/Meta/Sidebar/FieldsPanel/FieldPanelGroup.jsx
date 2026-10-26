import React, {useState} from 'react';
import PropTypes from 'prop-types';
import FieldPanelElement from "./FieldPanelElement.jsx";
import {Icon} from "@iconify/react";
import {primaryColor} from "../../../../utils/colors.jsx";

const FieldPanelGroup = ({name, fields, search}) => {

    const [collapsed, setCollapsed] = useState(false);

    const filtered = () => {
        if (!search) return fields;
        return fields.filter(f => f.label.toLowerCase().includes(search.toLowerCase()));
    };

    if (filtered().length === 0) return null;

    return (
        <div className="flex-column s-12">
            <div
                className="flex-between cursor-pointer mb-12"
                role="button"
                tabIndex={0}
                aria-expanded={!collapsed}
                onClick={() => setCollapsed(!collapsed)}
                onKeyDown={e => {
                    if(e.key === 'Enter' || e.key === ' '){
                        e.preventDefault();
                        setCollapsed(!collapsed);
                    }
                }}
            >
                <h4>{name}</h4>
                <Icon icon="bx:expand-alt" width={18} color={primaryColor()} />
            </div>
            {!collapsed && (
                <div className="grid grid-2 s-12">
                    {filtered().map((field, index) => (
                        <FieldPanelElement key={index} field={field} />
                    ))}
                </div>
            )}
        </div>
    );
};

FieldPanelGroup.propTypes = {
    name:   PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    search: PropTypes.string,
};

export default FieldPanelGroup;
