import React from 'react';
import Badge from "../../components/Badge";
import {styleVariants} from "../../constants/styles";

const VersionBadge = () => {

    const settings = document.globals;
    const version = settings.globals.plugin_version;

    return (
        <div className="hidden-xs">
            <Badge style={version.includes("beta") ? styleVariants.WARNING : styleVariants.SUCCESS}>
                {version}
            </Badge>
        </div>
    );
};

export default VersionBadge;