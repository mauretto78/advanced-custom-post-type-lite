import React from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import {selectElement} from "../../../redux/reducers/metaStateSlice";
import useTranslation from "../../../hooks/useTranslation";
import Tooltip from "../../../components/Tooltip";

const ElementSelector = ({element, elementType}) => {

    // manage global state
    const dispatch = useDispatch();
    const {selectedElements} = useSelector(state => state.metaState);
    /**
     *
     * @return {boolean}
     */
    const isSelected = () => {
        const filter = selectedElements.filter(el => el.id === element.id );

        return filter.length > 0
    };

    const handleSelect = (selected) => {
        dispatch(selectElement({
                element: element,
                selected: selected,
                type: elementType
            }
        ));

        element.children && element.children.map((c) => {
            dispatch(selectElement({
                element: c,
                selected: selected,
                type: elementType
            }));

            c.children && c.children.map((cc) => {
                dispatch(selectElement({
                    element: cc,
                    selected: selected,
                    type: elementType
                }));
            });
        });
    };

    return (
        <Tooltip
            label={
                <label className="checkbox" htmlFor={`select-${element.id}`} style={{top: "3px"}}>
                    <input
                        id={`select-${element.id}`}
                        type="checkbox"
                        checked={isSelected()}
                        onChange={e => handleSelect(e.target.checked)}
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
    elementType: PropTypes.oneOf([
        "box",
        "block",
        "field"
    ]).isRequired,
};

export default ElementSelector;

