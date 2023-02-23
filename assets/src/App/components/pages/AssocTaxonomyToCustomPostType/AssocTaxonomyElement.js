import React from 'react';
import {assocTaxonomyToPostType} from "../../../redux/thunks/assocTaxonomyToPostType";
import {useDispatch} from "react-redux";
import CustomPostTypeLabel from "../../reusable/CustomPostType/CustomPostTypeLabel";

const AssocTaxonomyElement = ({id, element, postType, defaultChecked}) => {

    // manage global state
    const dispatch = useDispatch();

    const handleOnChange = (element) => {
        dispatch(assocTaxonomyToPostType(postType, [element]));
    };

    return(
        <tr>
            <td>
                <strong>{element.slug}</strong>
            </td>
            <td>
                <CustomPostTypeLabel element={element} />
            </td>
            <td>
                {element.singular}
            </td>
            <td>
                {element.plural}
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
                        defaultChecked={defaultChecked}
                        onChange={e => handleOnChange({
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