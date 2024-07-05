import React from 'react';
import PropTypes from 'prop-types';
import ElementTypeBadge from "../../components/ElementTypeBadge";
import {useDispatch} from "react-redux";
import {assocPostTypeToTaxonomy} from "../../redux/reducers/assocPostTypeToTaxonomySlice";
import {toast} from "react-hot-toast";
import useTranslation from "../../hooks/useTranslation";

const AssocCustomPostTypeToTaxonomyElement = ({record, taxonomy, defaultChecked}) => {

    // manage global state
    const dispatch = useDispatch();

    const handleOnChange = (element) => {
        dispatch(assocPostTypeToTaxonomy({taxonomy: taxonomy, postTypes:[element]}))
            .then(res => {

                const payload = res.payload;

                if(payload.success){
                    toast.success(useTranslation("Taxonomy was associated to selected Custom post types"));
                }

                if(payload.error){
                    toast.error(error);
                }
            })
            .catch(err => console.error(err))
        ;
    };

    return (
        <tr>
            <td>
                {record.name}
            </td>
            <td>
                <ElementTypeBadge element={record}/>
            </td>
            <td>
                {record.singular}
            </td>
            <td>
                {record.plural}
            </td>
            <td>
                <label
                    data-cy={`assoc-${record.name}-to-${taxonomy}`}
                    className="checkbox"
                    htmlFor={record.id}
                >
                    <input
                        id={record.id}
                        type="checkbox"
                        defaultChecked={defaultChecked}
                        onChange={e => handleOnChange({
                            id: record.id,
                            checked: e.target.checked
                        })}
                    />
                    <span/>
                </label>
            </td>
        </tr>
    );
};

AssocCustomPostTypeToTaxonomyElement.propTypes = {
    taxonomy: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
    defaultChecked: PropTypes.bool.isRequired,
};

export default AssocCustomPostTypeToTaxonomyElement;