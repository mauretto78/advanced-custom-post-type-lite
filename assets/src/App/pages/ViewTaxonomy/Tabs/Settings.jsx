import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import Boolean from "../../../components/Boolean";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";

const Settings = ({data}) => {

    if(data.length > 0) {
        return (
            <Card>
                <CardRow
                    label={useTranslation("Is Public")}
                    value={<Boolean status={data[0].settings.public} />}
                />
                <CardRow
                    label={useTranslation("Publicly queryable")}
                    value={<Boolean status={data[0].settings.publicly_queryable} />}
                />
                <CardRow
                    label={useTranslation("Hierarchical")}
                    value={<Boolean status={data[0].settings.hierarchical} />}
                />
                <CardRow
                    label={useTranslation("Show in menu")}
                    value={<Boolean status={data[0].settings.show_in_menu} />}
                />
                <CardRow
                    label={useTranslation("Show in nav menus")}
                    value={<Boolean status={data[0].settings.show_in_nav_menus} />}
                />
                <CardRow
                    label={useTranslation("Show in REST API")}
                    value={<Boolean status={data[0].settings.show_in_rest} />}
                />
                <CardRow
                    label={useTranslation("REST API base slug")}
                    value={data[0].settings.rest_base}
                />
                <CardRow
                    label={useTranslation("REST Controller class")}
                    value={data[0].settings.rest_controller_class}
                />
                <CardRow
                    label={useTranslation("Show Tagcloud")}
                    value={<Boolean status={data[0].settings.show_tagcloud} />}
                />
                <CardRow
                    label={useTranslation("Show Tagcloud")}
                    value={<Boolean status={data[0].settings.show_in_quick_edit} />}
                />
                <CardRow
                    label={useTranslation("Show admin column")}
                    value={<Boolean status={data[0].settings.show_admin_column} />}
                />
                <CardRow
                    label={useTranslation("Capabilities")}
                    value={
                        <div className="i-flex-center s-8">
                            {data[0].settings.capabilities && data[0].settings.capabilities.map((s)=>(
                                <Badge>{s}</Badge>
                            ))}
                        </div>
                    }
                />
                <CardRow
                    label={useTranslation("Rewrite")}
                    value={<Boolean status={data[0].settings.rewrite} />}
                />
                <CardRow
                    label={useTranslation("Custom rewrite")}
                    value={data[0].settings.custom_rewrite}
                />
                <CardRow
                    label={useTranslation("Query var")}
                    value={<Boolean status={data[0].settings.query_var} />}
                />
                <CardRow
                    label={useTranslation("Custom query var")}
                    value={<Boolean status={data[0].settings.custom_query_var} />}
                />
            </Card>
        );
    }
};

Settings.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Settings;