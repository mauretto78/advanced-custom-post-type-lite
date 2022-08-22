import React from 'react';
import {useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Boolean from "../../reusable/Boolean";
import {Icon} from "@iconify/react";

const SettingsElement = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchPostTypesReducer);
    const data = fetched[0].settings;

    // manage local state
    const {postType} = useParams();

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
                    <th style={{width: '180px'}}>Show in UI</th>
                    <td><Boolean status={data.show_ui}/></td>
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
                    <th style={{width: '180px'}}>Show in admin bar</th>
                    <td><Boolean status={data.show_in_admin_bar}/></td>
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
                    <th style={{width: '180px'}}>Menu position</th>
                    <td>{data.menu_position}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Capability Type</th>
                    <td>{data.capability_type}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Has archive</th>
                    <td><Boolean status={data.has_archive}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Rewrite</th>
                    <td><Boolean status={data.rewrite}/></td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Custom rewrite rules</th>
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
            <div>
                <Link
                    className="acpt-btn acpt-btn-primary"
                    to={`/edit/${postType}/3`}
                >
                    <Icon icon="bx:bx-edit" width="18px" />
                    Edit
                </Link>
                &nbsp;
                <Link
                    className="acpt-btn acpt-btn-primary-o"
                    to={`/assoc-taxonomy-post/${postType}`}
                >
                    <Icon icon="bx:bx-purchase-tag" width="18px" />
                    Taxonomies association
                </Link>
            </div>
        </div>
    );
};

export default SettingsElement;