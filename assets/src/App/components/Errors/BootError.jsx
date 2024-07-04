import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Alert from "../Alert";
import {styleVariants} from "../../constants/styles";

const BootError = ({message}) => {

    /**
     *
     * @return {*}
     */
    const getMessage = () => {
        switch (message) {
            case "SyntaxError":
                return (
                    <div className="flex-column s-12">
                        <div>A syntax error has occurred during booting the application.</div>
                        <div>So solve this issue try do the following:</div>
                        <ul className="disc">
                            <li>Open up your <code>wp-config.php</code> file</li>
                            <li>Check if you have WP_DEBUG_DISPLAY enabled: <code>define( 'WP_DEBUG_DISPLAY', true );</code></li>
                            <li>Disable WP_DEBUG_DISPLAY: <code>define( 'WP_DEBUG_DISPLAY', false );</code></li>
                            <li>Refresh the page</li>
                        </ul>
                        <div>If the problem persists, contact <a href="mailto:info@acpt.io">support</a>.</div>
                    </div>
                );

            default:
                return (
                    <div className="flex-column s-12">
                        <div>An unexpected error has occurred during booting the application.</div>
                        <div>Please try to refresh the page, or contact <a href="mailto:info@acpt.io">support</a>.</div>
                    </div>
                );
        }
    };

    return (
        <div className="acpt-main">
            <div className="acpt-main-wrapper">
                <div className="acpt-card with-shadow">
                    <div className="acpt-card-header">
                        <h3>{useTranslation("The application cannot be booted")}</h3>
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
                                {getMessage()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

BootError.propTypes = {
    message: PropTypes.string.isRequired,
};

export default BootError;