import React, {useRef} from "react";
import PropTypes from 'prop-types';
import {useOnScreen} from "../../hooks/useOnScreen";

const LazyElement = ({id, element}) => {

    const ref = useRef();
    const isVisible = useOnScreen(ref);

    return (
        <div id={`lazy-${id}`} ref={ref}>
            {isVisible ? element : (
                <div>
                    Loading...
                </div>
            )}
        </div>
    );
};

LazyElement.propTypes = {
    element: PropTypes.element.isRequired,
    id: PropTypes.string.isRequired,
};

export default LazyElement;