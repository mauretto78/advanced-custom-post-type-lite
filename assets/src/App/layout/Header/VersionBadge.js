import React from 'react';
import Badge from "../../components/Badge";

const VersionBadge = () => {

    const settings = document.globals;

    return (
        <div className="hidden-xs top-2">
            <Badge style="success">
                {settings.globals.plugin_version}
            </Badge>
        </div>
    );
};

export default VersionBadge;