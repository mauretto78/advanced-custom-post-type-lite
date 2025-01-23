import React from 'react';
import PropTypes from "prop-types";
import ProductDataFieldOpen from "./ProductDataFieldOpen";
import ProductDataFieldClosed from "./ProductDataFieldClosed";
import {useSelector} from "react-redux";

const ProductDataField = ({field, index}) => {

    // manage global state
    const {closedElements} = useSelector(state => state.productDataFieldsState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

        return filter.length === 1;
    };

    if(!isClosed()){
        return (
            <ProductDataFieldOpen
                field={field}
                index={index}
            />
        );
    }

    return (
        <ProductDataFieldClosed
            field={field}
            index={index}
        />
    );
};

ProductDataField.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
};

export default ProductDataField;