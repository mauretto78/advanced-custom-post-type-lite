import React from "react";
import PropTypes from 'prop-types';
import Alert from "../../../../../components/Alert";
import {styleVariants} from "../../../../../constants/styles";
import useTranslation from "../../../../../hooks/useTranslation";
import {v4 as uuidv4} from "uuid";
import {addConditionalRenderingElement} from "../../../../../redux/reducers/metaStateSlice";
import {useDispatch} from "react-redux";
import ConditionalRenderingElement from "./ConditionalRenderingElement";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const ConditionalRenderingTab = ({boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId}) => {

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

        dispatch(addConditionalRenderingElement({boxId, fieldId: field.id, parentFieldId, element}));
    };

    return (
        <div
            ref={parent}
            className={field.visibilityConditions && field.visibilityConditions.length > 0 ? 'flex-column s-24' : ''}
        >
            {field.visibilityConditions && field.visibilityConditions.length > 0 ? (
                <React.Fragment>
                    {field.visibilityConditions.map((element, index) => (
                        <ConditionalRenderingElement
                            key={element.id}
                            elementIndex={index}
                            boxIndex={boxIndex}
                            fieldIndex={fieldIndex}
                            boxId={boxId}
                            fieldId={field.id}
                            element={element}
                            parentFieldIndex={parentFieldIndex}
                            parentFieldId={parentFieldId}
                            isLast={index === (field.visibilityConditions.length - 1)}
                        />
                    ))}
                </React.Fragment>
            ) : (
                <Alert style={styleVariants.WARNING}>
                    {useTranslation("No conditions are present, click on \"Add condition\" button to add the first one.")}
                </Alert>
            )}
            <span>
                <a
                    href="#"
                    className={field.visibilityConditions && field.visibilityConditions.length > 0 ? '' : 'mt-24'}
                    onClick={e => {
                        e.preventDefault();
                        handleAddCondition();
                    }}
                >
                {useTranslation("Add condition")}
            </a>
            </span>
        </div>
    );
};

ConditionalRenderingTab.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    field: PropTypes.object.isRequired
};

export default ConditionalRenderingTab;