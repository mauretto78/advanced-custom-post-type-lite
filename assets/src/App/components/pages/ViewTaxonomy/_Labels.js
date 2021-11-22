import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {taxonomyLabelsList} from "../../../constants/taxonomy_label";
import {Icon} from "@iconify/react";

const LabelsElement = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const data = fetched[0].labels;

    // manage local state
    const {taxonomy} = useParams();

    return (
        <div>
            <table className="acpt-table acpt-table-secondary mb-3">
                {taxonomyLabelsList.map((item) => (
                    <tr>
                        <th style={{width: '180px'}}>{item.label}</th>
                        <td>{data[item.id]}</td>
                    </tr>
                ))}
            </table>
            <Link
                className="acpt-btn acpt-btn-primary"
                to={`/edit_taxonomy/${taxonomy}`}>
                <Icon icon="bx:bx-edit" width="24px" />
                Edit
            </Link>
        </div>
    );
};

export default LabelsElement;