import React from "react";
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import MetaFieldType from "../../../../components/MetaFieldType";
import useTranslation from "../../../../hooks/useTranslation";
import Tooltip from "../../../../components/Tooltip";

const CloneFieldSelectedField = ({handleDeleteField, clonedFieldId, meta}) => {

    /**
     *
     * @return {*}
     */
    const getField = () => {
        let label = null;
        let type = null;

        meta.map((g) => {
            g.boxes && g.boxes.map((b) => {
                b.fields && b.fields.map((f) => {
                    if(f.id === clonedFieldId){
                        label = `[${b.label ? b.label : b.name}] - ${f.label ? f.label : f.name}`;
                        type = f.type;
                    }
                });
            });
        });

        return {
            label: label,
            type: type
        };
    };

    const field = getField();

    return (
        <div className="i-flex-center s-12 bg-pale-gray b-rounded p-12">
            <div className="i-flex-center s-4">
                <span>
                    {field.label ? field.label : "Loading..."}
                </span>
                {field.type && (
                    <MetaFieldType
                        fieldType={field.type}
                        css="with-border b-rounded p-8"
                    />
                )}
            </div>
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();

                            if(handleDeleteField){
                                handleDeleteField(clonedFieldId);
                            }
                        }}
                    >
                        <Icon icon="bx-trash" width={18} color="#F94144" />
                    </a>
                }
                tip={useTranslation("Delete this meta field")}
                icon={false}
            />
        </div>
    );
};

CloneFieldSelectedField.propTypes = {
    meta: PropTypes.array.isRequired,
    handleDeleteField: PropTypes.object,
    clonedFieldId: PropTypes.string.isRequired
};

export default CloneFieldSelectedField;