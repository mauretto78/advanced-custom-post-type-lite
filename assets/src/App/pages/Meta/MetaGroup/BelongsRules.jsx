import React from 'react';
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {v4 as uuidv4} from "uuid";
import {addBelong, deleteBelong} from "../../../redux/reducers/metaStateSlice.jsx";
import useTranslation from "../../../hooks/useTranslation.jsx";
import Button from "../../../components/Button/index.jsx";
import {styleVariants} from "../../../constants/styles.jsx";
import Alert from "../../../components/Alert/index.jsx";
import BelongsRule from "./BelongsRule.jsx";

const BelongsRules = () => {

    const dispatch = useDispatch();
    const {control} = useFormContext();
    // useFieldArray's default keyName ('id') silently overwrites each row's real
    // `id` with its own ephemeral render key -- fields[index].id would then be a
    // random uuid, not the persisted rule's id. That id flows straight into
    // BelongsRule's hidden `belongs.${index}.id` input (submitted on save) and into
    // handleRemove's deleteBelong dispatch below, so the overwrite silently (a)
    // sent a fabricated id for every existing rule on every save, and (b) made
    // deleting a rule never actually remove it from the redux `group.belongs` state
    // (deleteBelong's id never matched). Renaming RHF's own bookkeeping key to
    // `_fieldKey` keeps `id` intact end-to-end.
    const {fields, remove, append} = useFieldArray({control, name: "belongs", keyName: "_fieldKey"});
    const [parent] = useAutoAnimate();

    const handleAppend = (e) => {
        e.preventDefault();
        const newBelong = {id: uuidv4(), belongsTo: null, operator: '=', find: null, logic: null};
        dispatch(addBelong({belong: newBelong}));
        append(newBelong);
    };

    const handleRemove = (index) => {
        dispatch(deleteBelong({belongId: fields[index].id}));
        remove(index);
    };

    if (!fields || fields.length === 0) {
        return (
            <React.Fragment>
                <Alert style={styleVariants.INFO}>
                    {useTranslation('No rules already created. Create the first one now by clicking the button "Add condition"!')}
                </Alert>
                <div className="mt-12">
                    <Button style={styleVariants.OUTLINED_PRIMARY} size="sm" icon="bx:plus" onClick={handleAppend}>
                        {useTranslation("Add condition")}
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className="responsive">
                <table className="w-100 mb-12">
                    <thead>
                        <tr>
                            <th className="pl-0 pt-0 pb-12 pr-12 text-left">
                                <span className="label-uppercase color-gray">{useTranslation("Location")}</span>
                            </th>
                            <th className="pl-0 pt-0 pb-12 pr-12 text-left" style={{width: "60px"}}>
                                <span className="label-uppercase color-gray">{useTranslation("Condition")}</span>
                            </th>
                            <th className="pl-0 pt-0 pb-12 pr-12 text-left">
                                <span className="label-uppercase color-gray">{useTranslation("Value")}</span>
                            </th>
                            <th className="pl-0 pt-0 pb-12 pr-12 text-left" style={{width: "80px"}}>
                                <span className="label-uppercase color-gray">{useTranslation("Logic")}</span>
                            </th>
                            <th style={{width: "40px"}} />
                        </tr>
                    </thead>
                    <tbody ref={parent}>
                        {fields.map((belong, index) => (
                            <BelongsRule
                                key={belong._fieldKey}
                                belong={belong}
                                index={index}
                                isLast={index === fields.length - 1}
                                remove={handleRemove}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <Button style={styleVariants.SECONDARY} onClick={handleAppend}>
                    {useTranslation("Add condition")}
                </Button>
            </div>
        </React.Fragment>
    );
};

export default BelongsRules;
