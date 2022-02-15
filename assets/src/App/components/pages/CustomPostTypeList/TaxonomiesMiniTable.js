import React from 'react';

const TaxonomiesMiniTable = ({postType, elements}) => {

    return (
        <div className="acpt-table-responsive">
            <table className="acpt-minitable">
                <tr>
                    <th>Taxonomy</th>
                    <th>Sing. label</th>
                    <th>Plural label</th>
                    <th>Post count</th>
                </tr>
                {elements.map((element)=>(
                    <tr>
                        <td>{element.slug}</td>
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
            </table>
            <div className="minitable-buttons">
                <a href={`#/assoc-taxonomy-post/${postType}`} >
                    Manage
                </a>
            </div>
        </div>
    );
};

export default TaxonomiesMiniTable;