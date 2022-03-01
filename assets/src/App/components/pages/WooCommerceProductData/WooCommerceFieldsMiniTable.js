import React from 'react';

const WooCommerceFieldsMiniTable = ({id, elements}) => {

    return (
        <div className="acpt-table-responsive">
            <table className="acpt-minitable">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                </tr>
                {elements.map((element)=>(
                    <tr>
                        <td>{element.name}</td>
                        <td>{element.type}</td>

                    </tr>
                ))}
            </table>
            <div className="minitable-buttons">
                <a href={`#/product-data/product/fields/${id}`} >
                    Manage
                </a>
            </div>
        </div>
    );
};

export default WooCommerceFieldsMiniTable;