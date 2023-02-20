import React from 'react';

const MetaBoxMiniTable = ({postType, taxonomy, elements}) => {

    const manageLink = (postType) ? `#/meta/${postType}` : `#/meta-taxonomy/${taxonomy}`;

    return (
        <div className="acpt-table-responsive">
            <table className="acpt-minitable">
                <thead>
                <tr>
                    <th>Meta box</th>
                    <th>Fields count</th>
                </tr>
                </thead>
                <tbody>
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
                </tbody>
            </table>
            <div className="minitable-buttons">
                <a href={manageLink} >
                    Manage
                </a>
            </div>
        </div>
    );
};

export default MetaBoxMiniTable;