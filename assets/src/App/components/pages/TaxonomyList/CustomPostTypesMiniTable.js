import React from 'react';

const CustomPostTypesMiniTable = ({taxonomy, elements}) => {

    return (
        <div className="acpt-table-responsive">
            <table className="acpt-minitable">
                <thead>
                <tr>
                    <th>CPT</th>
                    <th>Sing. label</th>
                    <th>Plural label</th>
                    <th>Post count</th>
                </tr>
                </thead>
                <tbody>
                {elements.map((element)=>(
                    <tr>
                        <td>{element.name}</td>
                        <td>{element.singular}</td>
                        <td>{element.plural}</td>
                        <td>
                            <span className="acpt-badge">
                                <span className="label">
                                    {element.postCount ? element.postCount : 0 }
                                </span>
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="minitable-buttons">
                <a href={`#/assoc-post-taxonomy/${taxonomy}`} >
                    Manage
                </a>
            </div>
        </div>
    );
};

export default CustomPostTypesMiniTable;