import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {stepBack} from "../../../redux/actions/stepsActions";
import {Icon} from "@iconify/react";

export default function StepsButtons( {isValid, next, prev}) {

    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.stepsReducer);

    return(
        <div className="acpt-step-buttons">
            {prev &&
            <a className="acpt-btn acpt-btn-primary prev" onClick={ e => dispatch(stepBack()) }>
                <Icon icon="bx:bx-chevron-left" width="24px" />
                Previous Step
            </a>
            }

            {next &&
            <button
                className="acpt-btn acpt-btn-primary next" disabled={(isValid) ? '' : 'disabled'}>
                Next Step
                <Icon icon="bx:bx-chevron-right" width="24px" />
            </button>
            }

            {!next &&
            <button
                className="acpt-btn acpt-btn-primary submit"
                disabled={(!isValid || loading) ? 'disabled' : ''}
            >
                {loading ? 'Loading...' : 'Save'}
                <Icon icon="bx:bx-save" width="24px" />
            </button>
            }
        </div>
    )
}