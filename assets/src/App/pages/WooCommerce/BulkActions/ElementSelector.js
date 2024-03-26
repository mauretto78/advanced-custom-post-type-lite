import React from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import {selectElement} from "../../../redux/reducers/productDataFieldsStateSlice";
import useTranslation from "../../../hooks/useTranslation";
import Tooltip from "../../../components/Tooltip";

const ElementSelector = ({element}) => {

    // manage global state
    const dispatch = useDispatch();
    const {selectedElements} = useSelector(state => state.productDataFieldsState);
    /**
     *
     * @return {boolean}
     */
    const isSelected = () => {
        const filter = selectedElements.filter(el => el.id === element.id );

        return filter.length > 0
    };

    return (
        <Tooltip
            label={
                <label className="checkbox" htmlFor={`select-${element.id}`} style={{top: "3px"}}>
                    <input
                        id={`select-${element.id}`}
                        type="checkbox"
                        checked={isSelected()}
                        onChange={e => {
                            dispatch(selectElement({
                                    element: element,
                                    selected: e.target.checked,
                                }
                            ));
                        }}
                    />
                    <span/>
                </label>
            }
            icon={false}
            tip={useTranslation(isSelected() ? "Deselect this element" : "Select this element")}
        />
    );
};

ElementSelector.propTypes = {
    element: PropTypes.object.isRequired,
};

export default ElementSelector;

