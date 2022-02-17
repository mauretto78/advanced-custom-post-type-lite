import React from 'react';
import '../../../scss/woocommerce.scss';
import Boolean from "../../reusable/Boolean";

const WoocommerceMiniTable = ({postType, elements}) => {

    return (
        <div className="acpt-table-responsive">
            <table className="acpt-minitable">
                <tr>
                    <th>Name</th>
                    <th>Icon</th>
                    <th>Show on UI</th>
                    <th>Fields</th>
                </tr>
                {elements.map((element)=>(
                    <tr>
                        <td>{element.name}</td>
                        <td>
                            <span className={`wcicon-${element.icon.icon}`} />
                        </td>
                        <td>
                            <Boolean status={element.showInUI}/>
                        </td>
                        <td>
                            <span className="acpt-badge">
                                <span className="label">
                                    {element.fields.length}
                                </span>
                            </span>
                        </td>
                    </tr>
                ))}
            </table>
            <div className="minitable-buttons">
                <a href={`#/product-data/${postType}`} >
                    Manage
                </a>
            </div>
        </div>
    );
};

export default WoocommerceMiniTable;