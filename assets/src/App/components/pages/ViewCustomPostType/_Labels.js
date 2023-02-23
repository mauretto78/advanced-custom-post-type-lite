import React from 'react';
import {Link, useParams} from "react-router-dom";
import {postLabelsList} from "../../../constants/label";
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react";

const LabelsElement = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchPostTypesReducer);
    const data = fetched[0].labels;

    // manage local state
    const {postType} = useParams();

    return (
        <div>
            <table className="acpt-table acpt-table-secondary mb-3">
                {postLabelsList.map((item) => (
                    <tr>
                        <th style={{width: '180px'}}>{item.label}</th>
                        <td>{data[item.id]}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default LabelsElement;