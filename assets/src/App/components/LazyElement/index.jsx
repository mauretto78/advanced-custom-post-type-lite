import React, {useRef} from "react";
import PropTypes from 'prop-types';
import {useOnScreen} from "../../hooks/useOnScreen";

const LazyElement = ({id, element, size, isClosed}) => {

    const ref = useRef();
    const isVisible = useOnScreen(ref);

    /**
     *
     * @return {number}
     */
    const loaderHeight = () => {

        if(isClosed){
            return 85;
        }

        if(size && size.type){
            switch (size.type) {
                case "field":
                    return 398;

                case "page":
                    return 628 + (491 * size.children);

                case "child-page":
                    return 537;

                case "product-data-field":
                    return 276;

                case "dataset-item":
                    return 46;
            }
        }

        return 20;
    };

    return (
        <div
            id={`lazy-${id}`}
            ref={ref}
        >
            {isVisible ? element : (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    height: `${loaderHeight()}px`
                }}>
                    Loading...
                </div>
            )}
        </div>
    );
};

LazyElement.propTypes = {
    id: PropTypes.string.isRequired,
    element: PropTypes.element.isRequired,
    isClosed: PropTypes.bool.isRequired,
    size: PropTypes.shape({
        type:  PropTypes.string.isRequired,
        children:  PropTypes.number.isRequired,
    }).isRequired,
};

export default LazyElement;