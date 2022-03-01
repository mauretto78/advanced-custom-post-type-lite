import React from 'react';
import {useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Boolean from "../../reusable/Boolean";
import {Icon} from "@iconify/react";

const SettingsElement = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const data = fetched[0].settings;

    // manage local state
    const {taxonomy} = useParams();

    return (
        <div>
            <table className="acpt-table acpt-table-secondary mb-3">
                <tr>
                    <th style={{width: '180px'}}>Is Public</th>
                    <td><Boolean status={data.public}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Publicly queryable</th>
                    <td><Boolean status={data.publicly_queryable}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Hierarchical</th>
                    <td><Boolean status={data.hierarchical}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Show in menu</th>
                    <td><Boolean status={data.show_in_menu}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Show in nav menus</th>
                    <td><Boolean status={data.show_in_nav_menus}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Show in REST API</th>
                    <td><Boolean status={data.show_in_rest}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>REST API base slug</th>
                    <td>{data.rest_base}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>REST Controller class</th>
                    <td>{data.rest_controller_class}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Show Tagcloud</th>
                    <td><Boolean status={data.show_tagcloud}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Show in quick edit</th>
                    <td><Boolean status={data.show_in_quick_edit}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Show admin column</th>
                    <td><Boolean status={data.show_admin_column}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Capabilities</th>
                    <td>
                        {data.capabilities && data.capabilities.map((s)=>
                            <div>{s}</div>
                        )}
                    </td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Rewrite</th>
                    <td><Boolean status={data.rewrite}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Custom rewrite</th>
                    <td>{data.custom_rewrite}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Query var</th>
                    <td><Boolean status={data.query_var}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Custom query var</th>
                    <td>{data.custom_query_var}</td>
                </tr>
            </table>
            <Link
                className="acpt-btn acpt-btn-primary"
                to={`/edit_taxonomy/${taxonomy}/3`}>
                <Icon icon="bx:bx-edit" width="24px" />
                Edit
            </Link>
        </div>
    );
};

export default SettingsElement;