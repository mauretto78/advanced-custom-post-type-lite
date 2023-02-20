import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {stepBack} from "../../../redux/actions/stepsActions";
import {scrollToTop} from "../../../utils/scroll";

export default function StepsButtons( {isValid, next, prev}) {

    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.stepsReducer);

    return(
        <div className="acpt-step-buttons">
            {prev &&
            <a className="acpt-btn acpt-btn-primary-o"
               onClick={ e => {
                   dispatch(stepBack());
                   scrollToTop();
               }}
            >
                Previous Step
            </a>
            }
            {next &&
            <button
                className="acpt-btn acpt-btn-primary-o"
                disabled={(isValid) ? '' : 'disabled'}
                onClick={() =>{
                    scrollToTop();
                }}
            >
                Next Step
            </button>
            }

            {!next &&
            <button
                className="acpt-btn acpt-btn-primary"
                disabled={(!isValid || loading) ? 'disabled' : ''}
            >
                {loading ? 'Loading...' : 'Save'}
            </button>
            }
        </div>
    )
}