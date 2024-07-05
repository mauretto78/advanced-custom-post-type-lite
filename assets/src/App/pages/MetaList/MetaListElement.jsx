import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import DeleteMetaModal from "./Modal/DeleteMetaModal";
import BelongsModal from "../../components/Modal/BelongsModal";
import {useFormContext} from "react-hook-form";
import {fieldGroupsDisplay} from "../../constants/fields";

const MetaListElement = memo(({record, page}) => {

    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.id}`;

    /**
     *
     * @param display
     * @return {*}
     */
    const displayAs = (display) => {
        switch (display) {
            default:
            case fieldGroupsDisplay.STANDARD:
                return useTranslation("Standard view");

            case fieldGroupsDisplay.ACCORDION:
                return useTranslation("Accordion");

            case fieldGroupsDisplay.HORIZONTAL_TABS:
                return useTranslation("Horizontal tabs");

            case fieldGroupsDisplay.VERTICAL_TABS:
                return useTranslation("Vertical tabs");

        }
    };

    return (
        <React.Fragment>
            <tr>
                <td style={{
                    width: "24px"
                }}>
                    <label className="checkbox" htmlFor={formId}>
                        <input
                            type="checkbox"
                            id={formId}
                            name={formId}
                            defaultChecked={false}
                            {...register(formId)}
                        />
                        <span/>
                    </label>
                </td>
                <td>
                    {record.name}
                </td>
                <td>
                    {record.label}
                </td>
                <td>
                    {displayAs(record.display)}
                </td>
                <td>
                    <BelongsModal belongs={record.belongs} />
                </td>
                <td>
                    {record.fieldsCount}
                </td>
                <td>
                    <div className="i-flex-center s-8">
                        <Link to={`/edit_meta/${record.id}`}>
                            {useTranslation("Edit")}
                        </Link>
                        <DeleteMetaModal
                            id={record.id}
                            page={page}
                        />
                    </div>
                </td>
            </tr>
        </React.Fragment>
    );
});

MetaListElement.propTypes = {
    page: PropTypes.number.isRequired,
    record: PropTypes.object.isRequired
};

export default MetaListElement;