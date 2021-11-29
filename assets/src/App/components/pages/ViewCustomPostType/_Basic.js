import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react";

const BasicElement = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchPostTypesReducer);
    const data = {
        name: fetched[0].name,
        singular: fetched[0].singular,
        plural: fetched[0].plural,
        icon: fetched[0].icon,
        supports: fetched[0].supports
    };

    // manage local state
    const {postType} = useParams();

    return (
        <div>
            <table className="acpt-table acpt-table-secondary mb-3">
                <tr>
                    <th style={{width: '180px'}}>Name</th>
                    <td>{data.name}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Singular</th>
                    <td>{data.singular}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Plural</th>
                    <td>{data.plural}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Icon</th>
                    <td>
                        <Icon icon={`dashicons:${data.icon}`} color="#0e3367" width="24px" />
                    </td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Supports</th>
                    <td>
                        {data.supports && data.supports.map((s)=>
                            (s !== '') && (
                                <div className="acpt-badge mr-1">
                                    <span className="label">{s}</span>
                                </div>
                            )
                        )}
                    </td>
                </tr>
            </table>
            <Link
                className="acpt-btn acpt-btn-primary"
                to={`/edit/${postType}`}>
                <Icon icon="bx:bx-edit" width="24px" />
                Edit
            </Link>
        </div>
    );
};

export default BasicElement;