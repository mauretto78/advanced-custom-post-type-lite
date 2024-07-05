import React from 'react';
import PropTypes from 'prop-types';
import ElementTypeBadge from "../../components/ElementTypeBadge";
import {useDispatch} from "react-redux";
import {assocTaxonomyToPostType} from "../../redux/reducers/assocTaxonomyToPostTypeSlice";
import {toast} from "react-hot-toast";
import useTranslation from "../../hooks/useTranslation";

const AssocTaxonomyToCustomPostTypeElement = ({record, postType, defaultChecked}) => {

    // manage global state
    const dispatch = useDispatch();

    const handleOnChange = (element) => {
        dispatch(assocTaxonomyToPostType({postType: postType, taxonomies:[element]}))
            .then(res => {

                const payload = res.payload;

                if(payload.success){
                    toast.success(useTranslation("Custom post type was associated to selected taxonomies"));
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
                {record.slug}
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
                    data-cy={`assoc-${record.slug}-to-${postType}`}
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

AssocTaxonomyToCustomPostTypeElement.propTypes = {
    postType: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
    defaultChecked: PropTypes.bool.isRequired,
};

export default AssocTaxonomyToCustomPostTypeElement;

