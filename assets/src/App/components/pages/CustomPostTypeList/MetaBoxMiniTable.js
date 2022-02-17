import React from 'react';
import {Icon} from "@iconify/react";

const MetaBoxMiniTable = ({postType, elements}) => {

    return (
        <div className="acpt-table-responsive">
            <table className="acpt-minitable">
                <tr>
                    <th>Meta box</th>
                    <th>Fields count</th>
                </tr>
                {elements.map((element)=>(
                    <tr>
                        <td>{element.name}</td>
                        <td>
                            <span className="acpt-badge">
                                <span className="label">
                                    {element.count}
                                </span>
                            </span>
                        </td>
                    </tr>
                ))}
            </table>
            <div className="minitable-buttons">
                <a href={`#/meta/${postType}`} >
                    Manage
                </a>
            </div>
        </div>
    );
};

export default MetaBoxMiniTable;