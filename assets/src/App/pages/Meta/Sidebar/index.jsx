import React from 'react';
import {useSelector} from "react-redux";
import FieldsPanel from "./FieldsPanel/index.jsx";
import BoxSettingsPanel from "./BoxSettingsPanel/index.jsx";
import FieldSettingsPanel from "./FieldSettingsPanel/index.jsx";

const Sidebar = () => {

    const {activeElement, activeBox} = useSelector(state => state.metaState);

    return (
        <aside className="sidebar">
            {activeElement ? (
                <FieldSettingsPanel key={activeElement.id} />
            ) : activeBox ? (
                <BoxSettingsPanel key={activeBox.id} />
            ) : (
                <FieldsPanel />
            )}
        </aside>
    );
};

export default Sidebar;
