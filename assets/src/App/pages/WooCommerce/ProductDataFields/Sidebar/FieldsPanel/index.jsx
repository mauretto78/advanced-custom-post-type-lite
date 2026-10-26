import React, {useState} from 'react';
import useTranslation from "../../../../../hooks/useTranslation.jsx";
import {WooCommerceFieldsList} from "../../../../../constants/woocommerce_fields.jsx";
import FieldPanelGroup from "./FieldPanelGroup.jsx";

const FieldsPanel = () => {

    const [search, setSearch] = useState(null);
    return (
        <div className="h-100 b-right-1">
            <div className="p-24 b-bottom-1">
                <h2 className="mb-12">
                    {useTranslation("Field type")}
                </h2>
                <input
                    type="text"
                    data-testid="fields-search"
                    className="form-control"
                    placeholder={useTranslation("Search")}
                    onChangeCapture={e => setSearch(e.target.value)}
                />
            </div>
            <div className="p-24 flex-column s-24 with-scrollbar" style={{maxHeight: "calc(100vh - 200px)"}}>
                {WooCommerceFieldsList.map((group) => (
                    <FieldPanelGroup
                        key={group.label}
                        group={group}
                        search={search}
                    />
                ))}
            </div>
        </div>
    );
};

export default FieldsPanel;
