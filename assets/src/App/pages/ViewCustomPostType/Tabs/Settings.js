import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import Boolean from "../../../components/Boolean";

const Settings = ({data, isWPGraphQLActive = false}) => {

    if(data.length > 0){
        return (
            <div className="with-border b-rounded">
                {isWPGraphQLActive && (
                    <React.Fragment>
                        <CardRow
                            label={useTranslation("Show the custom post type in WPGraphQL")}
                            value={<Boolean status={data[0].settings.show_in_graphql}/>}
                        />
                        <CardRow
                            label={useTranslation("GraphQL single name")}
                            value={<Boolean status={data[0].settings.graphql_single_name}/>}
                        />
                        <CardRow
                            label={useTranslation("GraphQL plural name")}
                            value={<Boolean status={data[0].settings.graphql_plural_name}/>}
                        />
                    </React.Fragment>
                )}
                <CardRow
                    label={useTranslation("Hierarchical")}
                    value={<Boolean status={data[0].settings.hierarchical}/>}
                />
                <CardRow
                    label={useTranslation("Is Public")}
                    value={<Boolean status={data[0].settings.public}/>}
                />
                <CardRow
                    label={useTranslation("Publicly queryable")}
                    value={<Boolean status={data[0].settings.publicly_queryable}/>}
                />
                <CardRow
                    label={useTranslation("Show in UI")}
                    value={<Boolean status={data[0].settings.show_ui}/>}
                />
                <CardRow
                    label={useTranslation("Show in menu")}
                    value={<Boolean status={data[0].settings.show_in_menu}/>}
                />
                <CardRow
                    label={useTranslation("Show in nav menus")}
                    value={<Boolean status={data[0].settings.show_in_nav_menus}/>}
                />
                <CardRow
                    label={useTranslation("Show in admin bar")}
                    value={<Boolean status={data[0].settings.show_in_admin_bar}/>}
                />
                <CardRow
                    label={useTranslation("Show in REST API")}
                    value={<Boolean status={data[0].settings.show_in_rest}/>}
                />
                <CardRow
                    label={useTranslation("REST API base slug")}
                    value={data[0].settings.rest_base}
                />
                <CardRow
                    label={useTranslation("Menu position")}
                    value={data[0].settings.menu_position}
                />
                <CardRow
                    label={useTranslation("Capability Type")}
                    value={data[0].settings.capability_type}
                />
                <CardRow
                    label={useTranslation("Has archive")}
                    value={<Boolean status={data[0].settings.has_archive}/>}
                />
                <CardRow
                    label={useTranslation("Rewrite")}
                    value={<Boolean status={data[0].settings.rewrite}/>}
                />
                <CardRow
                    label={useTranslation("Custom rewrite rules")}
                    value={data[0].settings.custom_rewrite}
                />
                <CardRow
                    label={useTranslation("Query var")}
                    value={data[0].settings.query_var}
                />
                <CardRow
                    label={useTranslation("Custom query var")}
                    value={data[0].settings.custom_query_var}
                />
            </div>
        );
    }
};

Settings.propTypes = {
    data: PropTypes.object.isRequired,
    isWPGraphQLActive: PropTypes.bool,
};

export default Settings;