import React, {useEffect} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import {styleVariants} from "../../constants/styles";
import ToolCard from "./ToolCard.jsx";
import LockedToolCard from "../../lite/LockedToolCard.jsx";

const Tools = () => {
    const items = [
        {
            title: "API dashboard",
            color: styleVariants.SECONDARY,
            header: "Networking",
            description: "Discover, manage and test every REST endpoint exposed by ACPT via live Swagger UI.",
            icon: "bx:bx-code",
            link: "api",
            textLink: "Open dashboard",
        },
        {
            title: "Health check",
            color: styleVariants.SUCCESS,
            header: "Diagnostics",
            description: "Inspect the application state and automatically repair installation errors or schema issues.",
            icon: "ph:heartbeat-bold",
            link: "health-check",
            textLink: "Run check",
        },
        {
            title: "Dataset",
            color: styleVariants.WARNING,
            header: "Data",
            description: "Build reusable datasets for meta fields and forms. Import from CSV, JSON or YAML.",
            icon: "bx:data",
            link: "datasets",
            textLink: "Manage datasets",
        },
        {
            title: "Meta keys manager",
            color: styleVariants.DEFAULT,
            header: "Inspection",
            description: "Browse, search and manage every raw meta key stored by ACPT. Edit values directly or clean up stale entries across post types, taxonomies and users.",
            icon: "bx:bx-list-ul",
            link: "meta-keys-manager",
            textLink: "Open manager",
        },
        {
            title: "Export settings",
            color: styleVariants.INFO,
            header: "Portability",
            description: "Export your settings and meta field definitions into a compressed .acpt JSON archive for backup or migration.",
            icon: "bx:export",
            link: "export",
            textLink: "Export",
        },
        {
            title: "Import settings",
            color: styleVariants.DANGER,
            header: "Portability",
            description: "Restore settings and meta fields from a previously exported .acpt file. Maximum file size is 2 MB.",
            icon: "bx:import",
            link: "import",
            textLink: "Import",
        },
    ];

    useEffect(() => {
        metaTitle(useTranslation("ACPT Tools"));
        changeCurrentAdminMenuLink('#/tools');
    }, []);

    return (
        <Layout
            title={useTranslation("ACPT Tools")}
            crumbs={[
                {
                    label: useTranslation("ACPT Tools")
                }
            ]}
        >
            <div className="grid grid-3 s-24 md-24">
                {items.map((item, i) => (
                    item.link === "health-check" ? (
                        <ToolCard
                            key={`tool_card_${i}`}
                            title={item.title}
                            color={item.color}
                            header={item.header}
                            description={item.description}
                            icon={item.icon}
                            link={item.link}
                            textLink={item.textLink}
                        />
                    ) : (
                        <LockedToolCard
                            key={`tool_card_${i}`}
                            title={item.title}
                            color={item.color}
                            header={item.header}
                            description={item.description}
                            icon={item.icon}
                            link={item.link}
                        />
                    )
                ))}
            </div>
        </Layout>
    );
};

export default Tools;