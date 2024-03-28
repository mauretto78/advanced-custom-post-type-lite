import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {
    addField,
    deleteField,
    deselectAllElements
} from "../../../redux/reducers/productDataFieldsStateSlice";
import PropTypes from "prop-types";
import {useFormContext, useWatch} from "react-hook-form";
import {cloneWCField} from "../../../utils/cloners";

const BulkActions = ({view, setFieldTab}) => {

    // manage global state
    const dispatch = useDispatch();
    const {selectedElements} = useSelector(state => state.productDataFieldsState);

    // manage form state
    const { control, setValue, getValues } = useFormContext();
    const watchedFields = useWatch({
        control,
        name: "fields"
    });

    // manage local state
    const ref = useRef(null);
    const [action, setAction] = useState(null);

    const executeAction = () => {
        selectedElements.map((element) => {

            const fieldIndex =  watchedFields.findIndex((b) => b.id === element.id);
            const watchedField = watchedFields[fieldIndex];

            switch (action) {

                // duplicate
                case "duplicate":
                    const duplicatedField = cloneWCField(watchedField);

                    watchedFields.push(duplicatedField);
                    setValue("fields", watchedFields);
                    dispatch(addField({field: duplicatedField}));

                    break;

                // delete
                case "delete":
                    const deletedField = {...watchedField};
                    const fields = getValues("fields").filter(f => f.id !== element.id);
                    setValue("fields", fields);

                    if(setFieldTab){
                        setFieldTab(0);
                    }

                    dispatch(deleteField({field: deletedField}));

                    break;
            }
        });

        if(action === 'delete' || action === 'duplicate'){
            dispatch(deselectAllElements());
        }

        ref.current.value = "";
    };

    return (
        <React.Fragment>
            {selectedElements.length > 0 && (
                <div className={`flex-between mb-24`}>
                    <div>
                        {selectedElements.length} {useTranslation("Selected items")}
                    </div>
                    <div className="i-flex-center s-8">
                        <select
                            ref={ref}
                            className="form-control sm"
                            onChange={e => {
                                setAction(e.target.value !== "" ? e.target.value : null);
                            }}
                        >
                            <option value="">{useTranslation("Select")}</option>
                            <option value="duplicate">{useTranslation("Duplicate")}</option>
                            <option value="delete">{useTranslation("Delete")}</option>
                        </select>
                        <Button
                            style={styleVariants.WHITE}
                            size="sm"
                            disabled={action === null}
                            onClick={(e)=>{
                                e.preventDefault();
                                executeAction();
                            }}
                        >
                            {useTranslation("Execute")}
                        </Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

BulkActions.propTypes = {
    view: PropTypes.oneOf([
        "tab",
        "list"
    ]).isRequired,
    setFieldTab: PropTypes.func,
};

export default BulkActions;