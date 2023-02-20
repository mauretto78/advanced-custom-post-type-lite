import React from 'react';
import {assocTaxonomyToPostType} from "../../../redux/thunks/assocTaxonomyToPostType";
import {useDispatch} from "react-redux";
import CustomPostTypeLabel from "../../reusable/CustomPostType/CustomPostTypeLabel";
import {assocPostTypeToTaxonomy} from "../../../redux/thunks/assocPostTypeToTaxonomy";

const AssocCustomPostTypeElement = ({id, element, taxonomy, defaultChecked}) => {

    // manage global state
    const dispatch = useDispatch();

    const handleOnChange = (element) => {
        dispatch(assocPostTypeToTaxonomy(taxonomy, [element]));
    };

    return(
        <tr>
            <td>
                <strong>{element.name}</strong>
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

export default AssocCustomPostTypeElement;