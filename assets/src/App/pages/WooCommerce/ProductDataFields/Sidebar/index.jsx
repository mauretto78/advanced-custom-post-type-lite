import React from 'react';
import {useSelector} from "react-redux";
import FieldsPanel from "./FieldsPanel/index.jsx";
import FieldSettingsPanel from "./FieldSettingsPanel/index.jsx";

const Sidebar = () => {

    const {activeElement} = useSelector(state => state.productDataFieldsState);

    return (
        <aside className="sidebar">
            {activeElement ? (
                <FieldSettingsPanel key={activeElement.id} />
            ) : (
                <FieldsPanel />
            )}
        </aside>
    );
};

export default Sidebar;
