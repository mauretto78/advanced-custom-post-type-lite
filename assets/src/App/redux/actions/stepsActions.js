export const START_FROM_STEP = 'START_FROM_STEP';
export const STEP_RESET = 'STEP_RESET';
export const STEP_FORWARD = 'STEP_FORWARD';
export const STEP_BACK = 'STEP_BACK';
export const STEPS_SUBMIT_IN_PROGRESS = 'STEPS_SUBMIT_IN_PROGRESS';
export const STEPS_SUBMIT_SUCCESS = 'STEPS_SUBMIT_SUCCESS';
export const STEPS_SUBMIT_FAILURE = 'STEPS_SUBMIT_FAILURE';

export const startFromStep = (step, data) => {
    return {
        type: START_FROM_STEP,
        payload: {
            step: step,
            data: data
        },
    };
};

export const stepReset = () => {
    return {
        type: STEP_RESET,
        payload: {},
    };
};

export const stepBack = () => {
    return {
        type: STEP_BACK,
        payload: {},
    };
};

export const stepForward = (data) => {
    return {
        type: STEP_FORWARD,
        payload: {
            data: data
        },
    };
};

export const stepsSubmitInProgress = (data) => {
    return {
        type: STEPS_SUBMIT_IN_PROGRESS,
        payload: {
            data: data
        },
    };
};

export const stepsSubmitSuccess = () => {
    return {
        type: STEPS_SUBMIT_SUCCESS
    };
};

export const stepsSubmitFailure = (error) => {
    return {
        type: STEPS_SUBMIT_FAILURE,
        payload: {
            error: error
        },
    };
};
