import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Alert from "../Alert";
import {styleVariants} from "../../constants/styles";
import Button from "../Button";

const ErrorBoundaryFallback = ({error, resetErrorBoundary}) => {

    return (
        <div className="acpt-main">
            <div className="acpt-main-wrapper">
                <div className="acpt-card with-shadow">
                    <div className="acpt-card-header">
                        <h3>{useTranslation("The application has crashed")}</h3>
                    </div>
                    <div className="acpt-card-body">
                        <div className="responsive">
                            <div className="flex-column p-24 s-24">
                                <Alert style={styleVariants.WARNING}>
                                    <span className="i-flex-center s-8">
                                        <Icon icon="ph:warning" width={18} />
                                        <span>{useTranslation("An unexpected error has occurred")}</span>
                                    </span>
                                </Alert>
                                <div>
                                    {useTranslation("Something went wrong. Try clicking the reload the application button to reload the application.")}
                                </div>
                                {error && error.message && (
                                    <React.Fragment>
                                        <div className="acpt-code">
                                            <code className="i-flex-center p-8">
                                                Error message: {error.message}
                                            </code>
                                        </div>
                                    </React.Fragment>
                                )}
                                <div>
                                    <Button
                                        type="button"
                                        style={styleVariants.PRIMARY}
                                        onClick={resetErrorBoundary}
                                    >
                                        {useTranslation("Reload the application")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ErrorBoundaryFallback.propTypes = {
    error: PropTypes.string.isRequired,
    resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorBoundaryFallback;