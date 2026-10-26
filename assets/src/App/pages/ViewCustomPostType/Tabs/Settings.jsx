import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import Boolean from "../../../components/Boolean";
import Card from "../../../components/Card";
import {customPostTypeProps} from "../../../props/cptTaxonomyProps.js";

const Settings = ({data, isWPGraphQLActive = false}) => {

    if(data.length > 0){
        return (
            <Card>
                {isWPGraphQLActive && (
                    <React.Fragment>
                        <CardRow
                            label={useTranslation("Show the custom post type in WPGraphQL")}
                            value={<Boolean status={data[0].settings.show_in_graphql}/>}
                        />
                        <CardRow
                            label={useTranslation("GraphQL single name")}
                            value={data[0].settings.graphql_single_name}
                        />
                        <CardRow
                            label={useTranslation("GraphQL plural name")}
                            value={data[0].settings.graphql_plural_name}
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
                    value={(typeof data[0].settings.show_in_menu === 'string') ? data[0].settings.show_in_menu : <Boolean status={data[0].settings.show_in_menu}/>}
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
                    label={useTranslation("Sorting")}
                    value={
                        <div className="i-flex-center s-4">
                            <span>{data[0].settings.sorting && data[0].settings.sorting.orderBy ? useTranslation(data[0].settings.sorting.orderBy) : useTranslation("Date")}</span>
                            <span>—</span>
                            <span>{data[0].settings.sorting && data[0].settings.sorting.direction ? useTranslation(data[0].settings.sorting.direction) : useTranslation("Descending")}</span>
                        </div>
                    }
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
                    value={(typeof data[0].settings.has_archive === 'string') ? data[0].settings.has_archive : <Boolean status={data[0].settings.has_archive}/>}
                />
                <CardRow
                    label={useTranslation("Rewrite")}
                    value={<Boolean status={data[0].settings.rewrite}/>}
                />
                {data[0].settings.rewrite && (
                    <React.Fragment>
                        <CardRow
                            label={useTranslation("Custom rewrite rules")}
                            value={data[0].settings.custom_rewrite}
                        />
                        <CardRow
                            label={useTranslation("With front")}
                            value={<Boolean status={data[0].settings.with_front}/>}
                        />
                        <CardRow
                            label={useTranslation("Feeds")}
                            value={<Boolean status={data[0].settings.feeds !== false}/>}
                        />
                    </React.Fragment>
                )}
                <CardRow
                    label={useTranslation("Query var")}
                    value={typeof data[0].settings.query_var === "boolean" ? <Boolean status={data[0].settings.query_var} /> :  data[0].settings.query_var}
                />
                <CardRow
                    label={useTranslation("Custom query var")}
                    value={data[0].settings.custom_query_var}
                />
                <CardRow
                    label={useTranslation("Front URL prefix")}
                    value={data[0].settings.front_url_prefix}
                />
            </Card>
        );
    }

    return null;
};

Settings.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(customPostTypeProps)).isRequired,
    isWPGraphQLActive: PropTypes.bool,
};

export default Settings;