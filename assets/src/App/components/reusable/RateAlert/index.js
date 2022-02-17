import React from "react";
import {Icon} from "@iconify/react";

const {useState} = require( "react" );

const RateAlert = () => {

    const ACPT_DISMISS_ALERT = 'ACPT_DISMISS_ALERT';

    const wasDismissed = () => {
        return localStorage.getItem(ACPT_DISMISS_ALERT) === "1";
    };

    // local state
    const [visible, isVisible] = useState( !wasDismissed());

    const dismissAlert = () => {
        localStorage.setItem(ACPT_DISMISS_ALERT, "1");
        isVisible(false);
    };

    if(wasDismissed()){
        return null;
    }

    return (
        visible
        ?
            <div className="acpt-rate-it">
                <div className="mr-1">
                    <Icon icon="fa-regular:life-ring" color="#02c39a" width="48px"/>
                </div>
                <div>
                    <h3 className="acpt-rate-title">Support this project</h3>
                    <div className="acpt-rate">
                        If you like ACPT, please, <a href="https://wordpress.org/plugins/acpt-lite/" target="_blank">rate this plugin on Wordpress directory</a>. You will help to grow this project! Thank you! <br/>
                        <i>Mauro :)</i>
                    </div>
                    <a
                        href="https://wordpress.org/plugins/acpt-lite/"
                        target="_blank"
                        className="acpt-btn acpt-btn-sm acpt-btn-primary"
                    >
                        Rate ACPT Lite
                    </a>
                    &nbsp;
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            dismissAlert();
                        }}
                        className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
                    >
                        Dismiss this alert
                    </a>
                </div>
            </div>
        :
        null
    );
};

export default RateAlert;