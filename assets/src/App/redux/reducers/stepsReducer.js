import {STEP_BACK, STEP_FORWARD, STEP_RESET, STEPS_SUBMIT_FAILURE, STEPS_SUBMIT_IN_PROGRESS, STEPS_SUBMIT_SUCCESS} from "../actions/stepsActions";

const initialState = {
    activeStep: 1,
    data: {},
    loading: false,
    success: false,
    errors: []
};

export const stepsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case STEP_RESET:
            return initialState;

        case STEP_FORWARD:

            const data = state.data;
            data[state.activeStep] = payload.data;

            return {
                ...state,
                data: data,
                activeStep: state.activeStep + 1
            };

        case STEP_BACK:
            return {
                ...state,
                data: state.data,
                activeStep: ((state.activeStep - 1) > 0) ? (state.activeStep - 1) : 1
            };

        case STEPS_SUBMIT_IN_PROGRESS:
            console.log('submission of steps form in progress...');

            const finalData = state.data;
            finalData[state.activeStep] = payload.data;

            return {
                ...state,
                data: finalData,
                loading: true
            };

        case STEPS_SUBMIT_FAILURE:
            console.error(payload.error);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload.error)){
                prevErrors.push(payload.error);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case STEPS_SUBMIT_SUCCESS:
            return {
                ...state,
                activeStep: 1,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};