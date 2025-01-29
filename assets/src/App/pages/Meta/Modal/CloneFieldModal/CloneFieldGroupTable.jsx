import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import {useFormContext} from "react-hook-form";
import {arrayUnique, isEmpty} from "../../../../utils/objects";
import MetaFieldType from "../../../../components/MetaFieldType";

const CloneFieldGroupTable = ({id, group, field, gindex, watchedDefaultValueObject}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;
    const isRtl = globals.is_rtl;

    // manage form state
    const { setValue } = useFormContext();

    /**
     *
     * @return {[]}
     */
    const getGroupFields = (group) => {
        let fields = [];

        group.boxes && group.boxes.map((b) => {
            b.fields && b.fields.map((f) => {
                if(f.id !== field.id){
                    fields.push(f.id);
                }
            });
        });

        return fields;
    };

    /**
     *
     * @param group
     * @param selected
     */
    const handleToggleSelectAll = (group, selected) => {

        if(!group.id){
            return;
        }

        if(!selected){
            return;
        }

        // toggle select/deselect all for a field group
        if(selected === "deselect"){
            setValue(id, arrayUnique((watchedDefaultValueObject.filter(n => !getGroupFields(group).includes(n)))));
        } else if(selected === "select"){
            setValue(id, arrayUnique([...watchedDefaultValueObject, ...getGroupFields(group)]));
        }
    };

    const handleToggleFieldCheckbox = (checked, fid) => {
        const w = watchedDefaultValueObject;

        if(checked){
            w.push(fid);
            setValue(id, w);
        } else {
            setValue(id, w.filter(v => v !== fid));
        }
    };

    /**
     *
     * @param id
     * @return {boolean}
     */
    const isFieldChecked = (id) => {
        const w = watchedDefaultValueObject;

        if(isEmpty(w)){
            return false;
        }

        return w.includes(id);
    };

    if(getGroupFields(group).length === 0){
        return null;
    }

    return (
        <table id={group.id} className={`acpt-table with-border ${isRtl ? 'rtl' : ''}`}>
            {group.id !== null && (
                <thead>
                    <tr>
                        <th
                            style={{
                                padding: "12px 24px"
                            }}
                            colSpan={2}
                        >
                            <div className="flex-center flex-between s-8">
                                <span>
                                    {group.name}
                                </span>
                                <div>
                                    <select
                                        className="form-control sm"
                                        onChangeCapture={e => {
                                            e.preventDefault();

                                            const selected = e.target.value;

                                            if(selected){
                                                handleToggleSelectAll(group, selected);
                                            }
                                        }}
                                    >
                                        <option value={null}>{useTranslation("Action")}</option>
                                        <option value="select">{useTranslation("Select all")}</option>
                                        <option value="deselect">{useTranslation("Deselect all")}</option>
                                    </select>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
            )}
            {group.boxes && group.boxes.length > 0 && group.boxes.map((box, bindex) => (
                <tbody>
                    {box.fields && box.fields.length > 0 && box.fields.map((f, findex) => f.id !== field.id ? (
                        <React.Fragment>
                            <tr>
                                <td id={f.id} width={10}>
                                    <label className="checkbox" htmlFor={`${id}_${gindex}_${bindex}_${findex}`}>
                                        <input
                                            name={id}
                                            type="checkbox"
                                            id={`${id}_${gindex}_${bindex}_${findex}`}
                                            checked={isFieldChecked(f.id)}
                                            value={f.id}
                                            onChangeCapture={e => handleToggleFieldCheckbox(e.target.checked, f.id) }
                                        />
                                        <span/>
                                    </label>
                                </td>
                                <td>
                                    <div className="i-flex-center s-4">
                                        <label htmlFor={`${id}_${gindex}_${bindex}_${findex}`} className="cursor-pointer text-ellipsis">
                                            [{box.label ? box.label : box.name}] - {f.label ? f.label : f.name}
                                        </label>
                                        <MetaFieldType
                                            fieldType={f.type}
                                            css="with-border b-rounded p-8"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ) : (
                        <tr>
                            <td colSpan={2}>
                                {useTranslation("No boxes registered")}
                            </td>
                        </tr>
                    )) }
                </tbody>
            ))}
        </table>
    );
};

CloneFieldGroupTable.propTypes = {
    id: PropTypes.string.isRequired,
    gindex: PropTypes.number.isRequired,
    watchedDefaultValueObject: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired
};

export default CloneFieldGroupTable;