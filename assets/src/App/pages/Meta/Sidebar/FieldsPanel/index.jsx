import React, {useState} from 'react';
import useTranslation from "../../../../hooks/useTranslation.jsx";
import {fieldsList} from "../../../../constants/fields.jsx";
import FieldPanelGroup from "./FieldPanelGroup.jsx";
import LockedFieldTypes from "../../../../lite/LockedFieldTypes.jsx";

const FieldsPanel = () => {
    const [search, setSearch] = useState(null);
    const groups = fieldsList(0);

    return (
        <div className="h-100 b-right-1">
            <div className="p-24 b-bottom-1">
                <h3 className="mb-12">
                    {useTranslation("Field type")}
                </h3>
                <input
                    type="text"
                    data-testid="fields-search"
                    className="form-control"
                    placeholder={useTranslation("Search")}
                    onChangeCapture={e => setSearch(e.target.value)}
                />
            </div>
            <div className="p-24 flex-column s-24 with-scrollbar" style={{maxHeight: "calc(100vh - 200px)"}}>
                {groups.map((group, index) => (
                    <FieldPanelGroup
                        key={index}
                        name={group.label}
                        fields={group.options}
                        search={search}
                    />
                ))}
                <LockedFieldTypes search={search} />
            </div>
        </div>
    );
};

export default FieldsPanel;
