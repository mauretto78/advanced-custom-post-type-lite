import React from "react";
import PropTypes from 'prop-types';
import {v4 as uuidv4} from "uuid";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import useTranslation from "../../../../hooks/useTranslation.jsx";
import {titleCase} from "../../../../utils/strings.jsx";
import {useDispatch} from "react-redux";
import {addBoxConditionalRenderingElement} from "../../../../redux/reducers/metaStateSlice.jsx";
import Alert from "../../../../components/Alert/index.jsx";
import {styleVariants} from "../../../../constants/styles.jsx";
import {metaBoxProps} from "../../../../props/metaProps.js";

const ConditionalRendering = ({box, boxIndex}) => {

    // manage global state
    const dispatch = useDispatch();

    // auto-animate
    const [parent] = useAutoAnimate();

    const handleAddCondition = () => {

        const element = {
            id: uuidv4(),
            type: null,
            operator: '=',
            value: '',
            logic: null,
            frontEnd: true,
            backEnd: true,
        };

        dispatch(addBoxConditionalRenderingElement({boxId: box.id, element: element}));
    };

    return (
        (<div>
            <h3 className="mb-12">
                {titleCase(useTranslation("CONDITIONAL LOGIC"))}
            </h3>
            <div
                ref={parent}
                className={box.visibilityConditions && box.visibilityConditions.length > 0 ? 'flex-column s-24' : ''}
            >
                {box.visibilityConditions && box.visibilityConditions.length > 0 ? (
                    <React.Fragment>
                        <div className="i-flex-center s-8 w-100">
                            <div className="w-60">
                                <span className="label-uppercase color-gray">
                                    {useTranslation("Location")}
                                </span>
                            </div>
                            <div className="w-40">
                                <span className="label-uppercase color-gray">
                                    {useTranslation("Condition")}
                                </span>
                            </div>
                            <div className="w-100">
                                <span className="label-uppercase color-gray">
                                    {useTranslation("Value")}
                                </span>
                            </div>
                            <div className="w-20">
                                <span className="label-uppercase color-gray">
                                    {useTranslation("Logic")}
                                </span>
                            </div>
                        </div>
                        {box.visibilityConditions.map((element, index) => (
                            null
                        ))}
                    </React.Fragment>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation("No conditions are present, click on \"Add condition\" button to add the first one.")}
                    </Alert>
                )}
                <span>
                    <button
                        type="button"
                        className={`btn-reset ${box.visibilityConditions && box.visibilityConditions.length > 0 ? '' : 'mt-12'}`}
                        onClick={e => {
                            e.preventDefault();
                            handleAddCondition();
                        }}
                    >
                        {useTranslation("Add condition")}
                    </button>
                </span>
            </div>
        </div>)
    );
};

ConditionalRendering.propTypes = {
    box: PropTypes.shape(metaBoxProps).isRequired,
    boxIndex: PropTypes.number.isRequired,
};

export default ConditionalRendering;