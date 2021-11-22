import React from 'react';

const AssocTaxonomyElement = ({id, element, onChange, defaultChecked}) => {

    return(
        <tr>
            <td>
                <strong>{element.slug}</strong>
            </td>
            <td>
                <span className="acpt-badge">
                    <span className="label">
                        {element.singular}
                    </span>
                </span>
            </td>
            <td>
                <span className="acpt-badge">
                    <span className="label">
                        {element.plural}
                    </span>
                </span>
            </td>
            <td className="with-border">
                <span className="acpt-badge">
                    <span className="label">
                        {element.postCount}
                    </span>
                </span>
            </td>
            <td>
                <label className="switch">
                    <input
                        id={element.id}
                        type="checkbox"
                        defaultChecked={defaultChecked} onChange={e => onChange({
                            id: element.id,
                            checked: e.target.checked
                        })}
                    />
                    <span className="slider round"/>
                </label>
            </td>
        </tr>
    )
};

export default AssocTaxonomyElement;