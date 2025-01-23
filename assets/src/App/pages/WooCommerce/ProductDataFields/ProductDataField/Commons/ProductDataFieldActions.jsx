import React from "react";
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import useTranslation from "../../../../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import Tooltip from "../../../../../components/Tooltip";
import {cloneWCField} from "../../../../../utils/cloners";
import {addField, hideElement, showElement} from "../../../../../redux/reducers/productDataFieldsStateSlice";
import {delay} from "../../../../../utils/misc";
import {scrollToId} from "../../../../../utils/scroll";
import DeleteProductDataFieldModal from "../../Modal/DeleteProductDataFieldModal";
import {saveIsClosed} from "../../../../../utils/localStorage";

const ProductDataFieldActions = ({field, index}) => {


    // manage global state
    const dispatch = useDispatch();
    const {closedElements} = useSelector(state => state.productDataFieldsState);

    // manage form state
    const {  control } = useFormContext();

    const { append } = useFieldArray({
        control,
        name: "fields",
    });

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

        return filter.length === 1;
    };

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(field.id);

        if((isClosed())){
            dispatch(showElement({id: field.id}));
        } else {
            dispatch(hideElement({id: field.id}));
        }
    };

    return (
        <span className="i-flex-center s-8">
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            const duplicatedField = cloneWCField(field);
                            dispatch(addField({field: duplicatedField}));
                            append(duplicatedField);

                            delay(1).then(()=>{
                                scrollToId(duplicatedField.id);
                            });
                        }}
                    >
                        <Icon icon="bx:duplicate" width={18} />
                    </a>
                }
                tip={useTranslation("Duplicate this meta field")}
                icon={false}
            />
            <Tooltip
                label={
                    <DeleteProductDataFieldModal
                        index={index}
                        field={field}
                    />
                }
                tip={useTranslation("Delete this meta field")}
                icon={false}
            />
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleToggleClose();
                        }}
                    >
                        <Icon icon="bx:expand-alt" width={18} />
                    </a>
                }
                tip={useTranslation("Hide/show this meta field")}
                icon={false}
            />
        </span>
    );
};

ProductDataFieldActions.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
};

export default ProductDataFieldActions;