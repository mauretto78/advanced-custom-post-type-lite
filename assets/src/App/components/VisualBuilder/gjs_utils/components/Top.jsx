import React from "react";

const Top = () => {

    // globals
    const globals = document.globals;

    return (
        <div className="gjs-top" id="gjs-top">
            <div className="logo">
                <svg width="36" height="36" viewBox="0 0 634 572" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M465.039 115.5L339.505 42.9755C333.314 39.3991 325.686 39.3991 319.495 42.9755L193.961 115.5L319.495 188.024C325.686 191.601 333.314 191.601 339.505 188.024L465.039 115.5ZM359.515 8.34015C340.943 -2.3891 318.057 -2.3891 299.485 8.34015L114 115.5L299.485 222.66C318.057 233.389 340.943 233.389 359.515 222.66L545 115.5L359.515 8.34015Z" fill="#777"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M520.34 209.498L394.765 281.952C388.572 285.524 384.758 292.131 384.76 299.28L384.801 444.258L510.376 371.805C516.568 368.232 520.383 361.625 520.381 354.476L520.34 209.498ZM374.775 247.305C356.197 258.024 344.754 277.844 344.76 299.292L344.82 513.507L530.366 406.452C548.944 395.733 560.387 375.913 560.381 354.465L560.32 140.25L374.775 247.305Z" fill="#777"/>
                    <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M275.34 444.259L275.381 299.281C275.383 292.131 271.568 285.525 265.376 281.952L139.801 209.498L139.76 354.476C139.758 361.625 143.572 368.232 149.765 371.805L275.34 444.259ZM315.381 299.292C315.387 277.844 303.944 258.024 285.366 247.305L99.8202 140.25L99.7599 354.465C99.7538 375.913 111.197 395.733 129.775 406.452L315.32 513.507L315.381 299.292Z" fill="#777"/>
                </svg>
                <span className="label">
                        <span className="a">A</span>CPT
                    </span>
                <span className="version">
                        v {globals.globals.plugin_version}
                    </span>
            </div>
            <div className="gjs-devices"/>
            <div className="gjs-basic-actions"/>
        </div>
    );
};

export default Top;